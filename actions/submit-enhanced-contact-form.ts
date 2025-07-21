"use server";

import { revalidatePath } from "next/cache";

export interface EnhancedFormData {
    requestType: string[];
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    currentCity: string;
    budget?: string;
    currency: string;
    message?: string;
}

/**
 * Server action to submit enhanced contact form data to Bitrix CRM
 * @param formData Enhanced form data to submit
 * @returns Response indicating success or failure
 */
export async function submitEnhancedContactForm(formData: EnhancedFormData) {
    try {
        const requestTypeString = formData.requestType.join(', ');
        const budgetInfo = formData.budget ? `${formData.budget} ${formData.currency}` : '';
        const comments = `
            Request Type: ${requestTypeString}
            Current City: ${formData.currentCity}
            ${budgetInfo ? `Budget: ${budgetInfo}` : ''}
            ${formData.message ? `Message: ${formData.message}` : ''}
            Language: ${formData.currency === 'AED' ? 'Arabic/English' : 'International'}
        `.trim();

        const crmUrl = `https://crm.trpeglobal.com/rest/18/${process.env.NEXT_PUBLIC_BITRIX_KEY}/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`TRPE Landing Form Lead - ${requestTypeString}`)}&
            &FIELDS[NAME]=${encodeURIComponent(formData.firstName)}
            &FIELDS[LAST_NAME]=${encodeURIComponent(formData.lastName)}
            &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(formData.email)}
            &FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${encodeURIComponent(formData.phone)}
            &FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[COMMENTS]=${encodeURIComponent(comments)}
            &FIELDS[SOURCE_ID]=WEB
            &FIELDS[UF_CRM_1234567890]=${encodeURIComponent(formData.currentCity)}
            `;

        const crmResponse = await fetch(crmUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!crmResponse.ok) {
            throw new Error('Failed to create lead in CRM');
        }

        const result = await crmResponse.json();
        
        // Revalidate the path to update any cached data
        revalidatePath("/landing/enlgish-form");
        
        return {
            success: true,
            data: result,
            message: "Form submitted successfully"
        };
    } catch (error) {
        console.error('Error submitting enhanced contact form:', error);
        return {
            success: false,
            error: "An error occurred while sending your message. Please try again."
        };
    }
}
