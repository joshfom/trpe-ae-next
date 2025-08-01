/**
 * Early GTM Form Blocking Script
 * This script should be loaded as early as possible to prevent ANY automatic form tracking
 * from being sent to GTM before our main filter is ready.
 */

// Extend window interface
declare global {
    interface Window {
        dataLayer: any[];
        __earlyGTMFilterActive?: boolean;
    }
}

(function() {
    'use strict';
    
    // Initialize dataLayer if it doesn't exist
    (window as any).dataLayer = (window as any).dataLayer || [];
    
    // List of events to block
    const BLOCKED_EVENTS = [
        'form_start',
        'form_submited', 
        'form_submit',
        'gtm.formSubmit',
        'gtm.formStart',
        'gtm.formInteraction',
        'gtm.form',
        'formSubmit'
    ];
    
    // Function to check if an event should be blocked
    const shouldBlock = (data: any): boolean => {
        if (!data) return false;
        
        // Always allow search_submitted
        if (data.event === 'search_submitted') return false;
        
        // Block known unwanted events
        if (data.event && BLOCKED_EVENTS.includes(data.event)) return true;
        
        // Block events with form-related eventModel
        if (data.eventModel && (
            data.eventModel.form_id !== undefined ||
            data.eventModel.form_name !== undefined ||
            data.eventModel.form_destination !== undefined ||
            data.eventModel.first_field_id !== undefined ||
            data.eventModel.first_field_name !== undefined
        )) return true;
        
        // Block events with GTM form priority
        if (data.gtm && (data.gtm.priorityId === 5 || data.gtm.priorityId === 6)) return true;
        
        return false;
    };
    
    // Store original push method
    const originalPush = (window as any).dataLayer.push;
    
    // Override push method immediately
    (window as any).dataLayer.push = function(data: any) {
        if (shouldBlock(data)) {
            return (window as any).dataLayer.length;
        }
        
        return originalPush.call(this, data);
    };
    
    // Mark that early filter is active
    (window as any).__earlyGTMFilterActive = true;
})();

export {}; // Make this a module
