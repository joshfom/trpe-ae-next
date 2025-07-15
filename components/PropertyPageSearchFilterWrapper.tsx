import React from 'react';
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';

interface PropertyPageSearchFilterWrapperProps {
  offeringType?: string;
  propertyType?: string;
}

/**
 * Wrapper component for PropertyPageSearchFilter
 * This provides a simple interface for the main properties page
 */
const PropertyPageSearchFilterWrapper: React.FC<PropertyPageSearchFilterWrapperProps> = ({ 
  offeringType = 'all',
  propertyType 
}) => {
  return (
    <PropertyPageSearchFilter 
      offeringType={offeringType}
      propertyType={propertyType}
    />
  );
};

export default PropertyPageSearchFilterWrapper;
