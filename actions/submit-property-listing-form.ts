"use server";

/**
 * Server action to submit property listing data to Bitrix CRM
 * @param formData Property listing form data
 * @returns Response indicating success or failure
 */
export async function submitPropertyListingForm(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  offeringType: string;
  propertyType: string;
  address: string;
  message?: string; // Make message optional
}) {
  try {
    // Create a lead in Bitrix CRM for property listing
    const crmUrl = `https://crm.trpeglobal.com/rest/18/l3lel0d42eptuymb/crm.lead.add.json?
      FIELDS[TITLE]=${encodeURIComponent('New Property Listing Request')}
      &FIELDS[NAME]=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`)}
      &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(formData.email)}
      &FIELDS[EMAIL][0][VALUE_TYPE]=WORK
      &FIELDS[PHONE][0][VALUE]=${encodeURIComponent(formData.phone)}
      &FIELDS[PHONE][0][VALUE_TYPE]=WORK
      &FIELDS[COMMENTS]=${encodeURIComponent(`
        Property Details:
        - Offering Type: ${formData.offeringType}
        - Property Type: ${formData.propertyType}
        - Address: ${formData.address}
        - Message: ${formData.message || 'No additional message provided'}
      `)}
      &FIELDS[SOURCE_ID]=WEB
      &FIELDS[UF_CRM_1234567890]=${encodeURIComponent('Property Listing')}
    `;

    const crmResponse = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error('CRM API Error:', errorText);
      throw new Error('Failed to create lead in CRM');
    }

    const crmData = await crmResponse.json();
    console.log('CRM Response:', crmData);

    return {
      success: true,
      data: crmData
    };
  } catch (error) {
    console.error("Error submitting property listing form:", error);
    return {
      success: false,
      error: "An error occurred while submitting your property listing request"
    };
  }
}
