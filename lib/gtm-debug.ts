/**
 * GTM Event Monitor
 * Debug utility to monitor and log all GTM events being sent to the dataLayer
 * Use this in development to identify unwanted events
 */

let eventLog: any[] = [];

export const initializeGTMMonitor = () => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'development') return;

    console.log('GTM Event Monitor: Initializing...');

    // Wait for dataLayer to be available
    const checkDataLayer = () => {
        if (window.dataLayer) {
            const originalPush = window.dataLayer.push;
            
            window.dataLayer.push = function(data: any): number {
                // Log the event
                eventLog.push({
                    timestamp: new Date().toISOString(),
                    data: JSON.parse(JSON.stringify(data))
                });
                
                // Color-code different event types
                const eventType = data?.event || 'unknown';
                const isFormEvent = eventType.includes('form') || eventType.includes('submit');
                const isSearchEvent = eventType.includes('search');
                
                if (isFormEvent) {
                    console.log('%c📝 GTM Form Event:', 'color: orange; font-weight: bold', data);
                } else if (isSearchEvent) {
                    console.log('%c🔍 GTM Search Event:', 'color: green; font-weight: bold', data);
                } else {
                    console.log('%c📊 GTM Event:', 'color: blue; font-weight: bold', data);
                }
                
                return originalPush.call(this, data);
            };
            
            console.log('GTM Event Monitor: Active - All events will be logged');
            
            // Add global debugging methods
            (window as any).gtmDebug = {
                getEventLog: () => eventLog,
                clearLog: () => { eventLog = []; },
                getFormEvents: () => eventLog.filter(log => 
                    log.data.event && log.data.event.includes('form')
                ),
                getSearchEvents: () => eventLog.filter(log => 
                    log.data.event && log.data.event.includes('search')
                ),
                printLog: () => {
                    console.table(eventLog.map(log => ({
                        timestamp: log.timestamp,
                        event: log.data.event || 'N/A',
                        eventType: log.data.event?.includes('form') ? 'Form' : 
                                  log.data.event?.includes('search') ? 'Search' : 'Other'
                    })));
                }
            };
            
            console.log('GTM Event Monitor: Debug methods available via window.gtmDebug');
        } else {
            setTimeout(checkDataLayer, 100);
        }
    };
    
    checkDataLayer();
};

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    setTimeout(initializeGTMMonitor, 1000);
}

declare global {
    interface Window {
        gtmDebug?: {
            getEventLog: () => any[];
            clearLog: () => void;
            getFormEvents: () => any[];
            getSearchEvents: () => any[];
            printLog: () => void;
        };
    }
}
