'use server'

import { z } from 'zod';

// Define the schema for newsletter subscription
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Validate the form data
    const rawData = {
      email: formData.get('email'),
    };

    const validatedData = newsletterSchema.parse(rawData);

    // Here you would typically:
    // 1. Save to database
    // 2. Send to email service (Mailchimp, SendGrid, etc.)
    // 3. Send confirmation email

    console.log('Newsletter subscription:', validatedData.email);

    // For now, just simulate success
    // In a real implementation, you'd integrate with your email service
    
    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}