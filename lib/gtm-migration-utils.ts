// Utility functions to help migrate from form_submit to form_search events
import { pushToDataLayer } from '@/lib/gtm';

/**
 * Intercepts any existing form_submit events and converts them to form_search
 * if they are related to search forms. Use this as a temporary migration tool.
 */
export const interceptFormSubmitEvents = () => {
  if (typeof window === 'undefined') return;

  // Store the original dataLayer push method
  const originalPush = window.dataLayer?.push;
  
  if (!originalPush) return;

  // Override the push method to intercept form_submit events
  window.dataLayer.push = function(data: any) {
    // Check if this is a form_submit event that should be converted to form_search
    if (data.event === 'form_submit' && isSearchForm(data)) {
      // Convert to form_search event
      const convertedData = {
        ...data,
        event: 'form_search'
      };
      return originalPush.call(this, convertedData);
    }
    
    // Otherwise, use the original method
    return originalPush.call(this, data);
  };
};

/**
 * Determines if a form submission event is related to search functionality
 */
function isSearchForm(data: any): boolean {
  // Check various indicators that this might be a search form
  const searchIndicators = [
    'search',
    'filter',
    'property',
    'community',
    'listing',
    'find',
    'browse'
  ];

  // Check form_id
  if (data.eventModel?.form_id) {
    return searchIndicators.some(indicator => 
      data.eventModel.form_id.toLowerCase().includes(indicator)
    );
  }

  // Check form_name
  if (data.eventModel?.form_name) {
    return searchIndicators.some(indicator => 
      data.eventModel.form_name.toLowerCase().includes(indicator)
    );
  }

  // Check form_destination for search-related paths
  if (data.eventModel?.form_destination) {
    const url = data.eventModel.form_destination.toLowerCase();
    return url.includes('/properties') || 
           url.includes('/search') || 
           url.includes('/browse') ||
           url.includes('/for-sale') ||
           url.includes('/for-rent');
  }

  return false;
}

/**
 * Scans the current page for search forms and adds proper tracking
 */
export const addSearchFormTracking = () => {
  if (typeof window === 'undefined') return;

  // Find all forms that might be search forms
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Check if this looks like a search form
    const hasSearchInput = form.querySelector('input[name*="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    const hasFilterElements = form.querySelector('select[name*="community"], select[name*="price"], select[name*="bed"], select[name*="bath"]');
    const hasSearchButton = form.querySelector('button[type="submit"]:has(svg), button:contains("Search")');
    
    if (hasSearchInput || (hasFilterElements && hasSearchButton)) {
      // Add event listener if not already present
      if (!form.dataset.gtmTracked) {
        form.addEventListener('submit', handleSearchFormSubmit);
        form.dataset.gtmTracked = 'true';
      }
    }
  });
};

/**
 * Handles search form submissions and sends proper GTM events
 */
function handleSearchFormSubmit(event: Event) {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  // Extract search-related data
  const searchTerm = formData.get('search') || formData.get('query') || formData.get('q') || '';
  const filters: Record<string, any> = {};
  
  // Collect filter data
  for (const [key, value] of formData.entries()) {
    if (key !== 'search' && key !== 'query' && key !== 'q' && value) {
      filters[key] = value;
    }
  }

  // Send the form_search event
  pushToDataLayer({
    event: 'form_search',
    eventModel: {
      form_id: form.id || form.className || 'search-form',
      form_name: form.getAttribute('name') || 'Search Form',
      form_destination: window.location.origin,
      form_length: Object.keys(filters).length + (searchTerm ? 1 : 0),
      event_callback: "Function",
      send_to: "AW-11470392777"
    },
    eventCallback: "Function",
    search_term: searchTerm,
    filters: filters,
    gtm: {
      uniqueEventId: Math.floor(Math.random() * 1000000),
      priorityId: 8
    }
  });
}

/**
 * Finds and logs all potential form_submit events in the codebase
 * Use this to audit your codebase for migration
 */
export const debugDataLayerFormEvents = () => {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return;
  }
  
  // Filter dataLayer for form-related events
  const formSubmitEvents = window.dataLayer.filter((item: any) => 
    item && item.event === 'form_submit'
  );
  
  if (formSubmitEvents.length > 0) {
    // Log found events (for development only)
    const searchRelated = formSubmitEvents.filter(e => 
      JSON.stringify(e).toLowerCase().includes('search') ||
      JSON.stringify(e).toLowerCase().includes('property')
    );
  }
};

/**
 * Initialize all migration utilities
 * Call this once in your application
 */
export const initializeGTMMigration = () => {
  interceptFormSubmitEvents();
  
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSearchFormTracking);
  } else {
    addSearchFormTracking();
  }
  
  // Also run debug in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(debugDataLayerFormEvents, 2000);
  }
};
