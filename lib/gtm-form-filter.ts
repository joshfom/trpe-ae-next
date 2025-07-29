/**
 * GTM Form Event Filter
 * Prevents unwanted automatic form tracking events from being sent to Google Tag Manager
 * and ensures only explicitly defined events are tracked.
 */

// List of unwanted form events that should be filtered out
const UNWANTED_FORM_EVENTS = [
    'form_start',
    'form_submited', // Note: intentional typo as it might come from GTM auto-tracking
    'form_submit',
    'gtm.formSubmit',
    'gtm.formStart',
    'gtm.formInteraction',
    'gtm.form',
    'formSubmit',
    'gtm.formInteract',
    'form_interaction',
    'form_focus',
    'form_abandonment'
];

// Check if an event should be blocked based on content
const shouldBlockEvent = (data: any): boolean => {
    // Always allow our specific search_submitted event
    if (data && data.event === 'search_submitted') {
        return false;
    }
    
    // Allow our other custom search events
    if (data && data.event && (
        data.event.startsWith('search_') ||
        data.event === 'page_view' ||
        data.event === 'gtm.js' ||
        data.event === 'gtm.load' ||
        data.event === 'gtm.dom' ||
        data.event === 'gtm.config'
    )) {
        return false;
    }
    
    // Block if event name matches unwanted events (most important check)
    if (data && data.event && UNWANTED_FORM_EVENTS.includes(data.event)) {
        console.log(`🚫 Blocking by event name: ${data.event}`);
        return true;
    }
    
    // Block ALL events that have eventModel with form properties (this is GTM auto-tracking)
    if (data && data.eventModel && typeof data.eventModel === 'object') {
        // Check if eventModel has form-related properties
        const hasFormProps = Object.keys(data.eventModel).some(key => 
            key.includes('form') || key.includes('element') || key.includes('url') || key.includes('text')
        );
        if (hasFormProps) {
            console.log(`🚫 Blocking event with form eventModel:`, data.event, data.eventModel);
            return true;
        }
    }
    
    // Block if it has GTM auto-generated form data structure (priority 5, 6, or 7 are form events)
    if (data && data.gtm && (data.gtm.priorityId === 5 || data.gtm.priorityId === 6 || data.gtm.priorityId === 7)) {
        console.log(`🚫 Blocking by GTM priority ${data.gtm.priorityId}:`, data.event);
        return true;
    }
    
    // Block any event that contains form-related properties at root level
    if (data && (data.form_id || data.form_name || data.form_destination || data.form_length)) {
        console.log(`🚫 Blocking by form properties:`, data.event);
        return true;
    }
    
    // Block events that have element_* properties (GTM auto-tracking)
    if (data && Object.keys(data).some(key => key.startsWith('element_'))) {
        console.log(`🚫 Blocking event with element properties:`, data.event);
        return true;
    }
    
    // Block events that look like GTM auto-tracking based on data structure
    if (data && data.event && !data.event.startsWith('gtm.') && data.eventCallback === 'Function' && data.gtm) {
        console.log(`🚫 Blocking potential GTM auto-tracking event:`, data.event);
        return true;
    }
    
    return false;
};

/**
 * Initializes the GTM form event filter
 * Call this once in your application startup
 */
export const initializeGTMFormFilter = () => {
    if (typeof window === 'undefined') return;

    // Initialize immediately and also wait for GTM
    const setupFilter = () => {
        if (window.dataLayer) {
            // Store the original push method
            const originalPush = window.dataLayer.push;
            
            // Override the push method to filter out unwanted events
            window.dataLayer.push = function(data: any): number {
                // Use our comprehensive blocking logic
                if (shouldBlockEvent(data)) {
                    console.log(`🚫 GTM Form Filter: Blocked unwanted event "${data.event}"`, data);
                    return window.dataLayer.length; // Return current length without adding
                }
                
                // Allow the event through
                console.log(`✅ GTM Form Filter: Allowed event "${data.event}"`);
                return originalPush.call(this, data);
            };
            
            // Set a flag to indicate the filter is active
            (window as any).__gtmFormFilterInitialized = true;
            console.log('🛡️ GTM Form Filter: Initialized successfully - All form events will be blocked except search_submitted');
            return true;
        }
        return false;
    };

    // Try to set up immediately
    if (!setupFilter()) {
        // If dataLayer isn't ready, wait and try again
        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            attempts++;
            if (setupFilter() || attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 100);
    }
};/**
 * Nuclear option - completely clear ALL form events from dataLayer every 100ms
 * Use this if other methods fail
 */
export const startAggressiveFormEventCleaner = () => {
    if (typeof window === 'undefined') return;
    
    const cleanFormEvents = () => {
        if (!window.dataLayer) return;
        
        const originalLength = window.dataLayer.length;
        const filteredEvents = window.dataLayer.filter((item: any) => {
            // Only keep events that are NOT form-related
            if (!item || !item.event) return true;
            
            // Always keep search_submitted
            if (item.event === 'search_submitted') return true;
            
            // Remove form events
            if (UNWANTED_FORM_EVENTS.includes(item.event)) return false;
            
            // Remove events with eventModel (GTM auto-tracking)
            if (item.eventModel) return false;
            
            // Remove events with form priorities
            if (item.gtm && (item.gtm.priorityId === 5 || item.gtm.priorityId === 6 || item.gtm.priorityId === 7)) return false;
            
            // Remove events with eventCallback = "Function"
            if (item.eventCallback === 'Function') return false;
            
            return true;
        });
        
        if (filteredEvents.length !== originalLength) {
            window.dataLayer.length = 0;
            window.dataLayer.push(...filteredEvents);
            console.log(`🧹 Aggressive Cleaner: Removed ${originalLength - filteredEvents.length} form events`);
        }
    };
    
    // Clean every 100ms
    setInterval(cleanFormEvents, 100);
    console.log('🧹 Aggressive Form Event Cleaner: Started - Removing form events every 100ms');
};
export const clearUnwantedFormEvents = () => {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    
    const originalLength = window.dataLayer.length;
    
    // Filter out unwanted events
    const filteredEvents = window.dataLayer.filter((item: any) => {
        return !shouldBlockEvent(item);
    });
    
    // Replace the dataLayer contents
    window.dataLayer.length = 0;
    window.dataLayer.push(...filteredEvents);
    
    const removedCount = originalLength - filteredEvents.length;
    if (removedCount > 0) {
        console.log(`GTM Form Filter: Removed ${removedCount} unwanted form events`);
    }
};

/**
 * Safe method to push events to dataLayer while ensuring no unwanted events get through
 */
export const safeGTMPush = (data: any) => {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    
    // Use our comprehensive blocking logic
    if (shouldBlockEvent(data)) {
        console.warn(`GTM Form Filter: Attempted to push blocked event "${data.event}"`, data);
        return;
    }
    
    // Clear any unwanted events before pushing new one
    clearUnwantedFormEvents();
    
    // Push the new event
    window.dataLayer.push(data);
};

// Extend window interface
declare global {
    interface Window {
        dataLayer: any[];
    }
}
