// Define a common CommunityFilterType interface that can be used across the application
export interface CommunityFilterType {
  id: string;
  slug: string;
  name: string | null;
  shortName: string | null;
  featured?: boolean;
  displayOrder?: number;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

/**
 * Convert API community data to CommunityFilterType
 * This handles the case where the API response might not match our expected interface
 */
export function toCommunityFilterType(apiCommunity: any): CommunityFilterType {
  return {
    id: apiCommunity.id || apiCommunity.slug || '',
    slug: apiCommunity.slug,
    name: apiCommunity.name,
    shortName: apiCommunity.shortName || null,
    featured: apiCommunity.featured || false,
    displayOrder: apiCommunity.displayOrder || 0,
    propertyCount: apiCommunity.propertyCount || 0,
    rentCount: apiCommunity.rentCount || 0,
    saleCount: apiCommunity.saleCount || 0,
    commercialRentCount: apiCommunity.commercialRentCount || 0,
    commercialSaleCount: apiCommunity.commercialSaleCount || 0
  };
}
