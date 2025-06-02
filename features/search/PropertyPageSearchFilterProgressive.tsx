import React from 'react';
import PropertyPageSearchFilterNoScript from './PropertyPageSearchFilterNoScript';
import PropertyPageSearchFilterServer from './PropertyPageSearchFilterServer';

interface PropertyPageSearchFilterProgressiveProps {
    offeringType: string;
    searchParams?: {
        search?: string;
        community?: string;
        propertyType?: string;
        minPrice?: string;
        maxPrice?: string;
        bedrooms?: string;
        bathrooms?: string;
    };
}

// Progressive enhancement component that works with and without JavaScript
function PropertyPageSearchFilterProgressive({ 
    offeringType, 
    searchParams = {} 
}: PropertyPageSearchFilterProgressiveProps) {
    return (
        <>
            {/* NoScript version - always rendered and works without JavaScript */}
            <noscript>
                <PropertyPageSearchFilterNoScript 
                    offeringType={offeringType}
                    currentParams={searchParams}
                />
            </noscript>
            
            {/* JavaScript-enhanced version - hidden by default, shown when JS loads */}
            <div className="js-only" style={{ display: 'none' }}>
                <PropertyPageSearchFilterServer offeringType={offeringType} />
            </div>
            
            {/* Fallback version for when JS is disabled - hidden when JS loads */}
            <div className="no-js-fallback">
                <PropertyPageSearchFilterNoScript 
                    offeringType={offeringType}
                    currentParams={searchParams}
                />
            </div>
            
            {/* Script to show/hide appropriate versions */}
            <script 
                dangerouslySetInnerHTML={{
                    __html: `
                        // Hide fallback and show JS version when JavaScript is available
                        document.querySelector('.no-js-fallback').style.display = 'none';
                        document.querySelector('.js-only').style.display = 'block';
                    `
                }}
            />
        </>
    );
}

export default PropertyPageSearchFilterProgressive;
