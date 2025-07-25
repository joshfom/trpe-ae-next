import { pushToDataLayer } from '@/lib/gtm';

// Common GTM event tracking functions
export const trackPageView = (pageName: string, additionalData?: any) => {
  pushToDataLayer({
    event: 'page_view',
    page_name: pageName,
    ...additionalData
  });
};

export const trackUserAction = (action: string, category: string, label?: string, value?: number) => {
  pushToDataLayer({
    event: 'user_action',
    action,
    category,
    label,
    value
  });
};

export const trackPropertyView = (propertyId: string, propertyType: string, price?: number) => {
  pushToDataLayer({
    event: 'property_view',
    property_id: propertyId,
    property_type: propertyType,
    price
  });
};

export const trackSearchEvent = (searchTerm: string, filters?: any) => {
  pushToDataLayer({
    event: 'property_search',
    search_term: searchTerm,
    filters
  });
};

// New function specifically for search form submissions
export const trackSearchFormSubmit = (formData: {
  form_id?: string;
  form_name?: string;
  form_destination?: string;
  form_length?: number;
  search_term?: string;
  filters?: any;
  send_to?: string;
}) => {
  pushToDataLayer({
    event: 'form_search', // Changed from form_submit to form_search
    eventModel: {
      form_id: formData.form_id || "",
      form_name: formData.form_name || null,
      form_destination: formData.form_destination || "https://trpe.ae/",
      form_length: formData.form_length || 7,
      event_callback: "Function",
      send_to: formData.send_to || "AW-11470392777"
    },
    eventCallback: "Function",
    search_term: formData.search_term,
    filters: formData.filters,
    gtm: {
      uniqueEventId: Math.floor(Math.random() * 1000000),
      priorityId: 8
    }
  });
};

export const trackContactForm = (formType: string, propertyId?: string) => {
  pushToDataLayer({
    event: 'contact_form_submit',
    form_type: formType,
    property_id: propertyId
  });
};

// Enhanced contact form tracking with detailed form data
export const trackContactFormSubmit = (formData: {
  form_id?: string;
  form_name?: string;
  form_type: string;
  form_destination?: string;
  form_length?: number;
  property_id?: string;
  send_to?: string;
  user_data?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    [key: string]: any;
  };
}) => {
  pushToDataLayer({
    event: 'contact_form_submit',
    eventModel: {
      form_id: formData.form_id || formData.form_type + '_form',
      form_name: formData.form_name || formData.form_type.replace('_', ' ') + ' Form',
      form_destination: formData.form_destination || "https://trpe.ae/",
      form_length: formData.form_length || 0,
      form_type: formData.form_type,
      property_id: formData.property_id || null,
      event_callback: "Function",
      send_to: formData.send_to || "AW-11470392777"
    },
    eventCallback: "Function",
    user_data: formData.user_data || {},
    gtm: {
      uniqueEventId: Math.floor(Math.random() * 1000000),
      priorityId: 8
    }
  });
};
