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

export const trackContactForm = (formType: string, propertyId?: string) => {
  pushToDataLayer({
    event: 'contact_form_submit',
    form_type: formType,
    property_id: propertyId
  });
};
