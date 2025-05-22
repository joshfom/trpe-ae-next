export const PROPERTY_TYPES = [
    { value: 'apartments', label: 'Apartments' },
    { value: 'villas', label: 'Villas' },
    { value: 'townhouses', label: 'Townhouses' },
    { value: 'plots', label: 'Plots' },
    { value: 'offices', label: 'Offices' },
    { value: 'retail', label: 'Retail' },
    { value: 'warehouses', label: 'Warehouses' }
] as const;

export const OFFERING_TYPES = [
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
    { value: 'commercial-sale', label: 'Commercial' }
] as const;

export const SORT_OPTIONS = [
    { value: 'relevant', label: 'Relevant' },
    { value: 'price_low', label: 'Price (low)' },
    { value: 'price_high', label: 'Price (high)' },
    { value: 'beds_least', label: 'Beds (least)' },
    { value: 'beds_most', label: 'Beds (most)' }
] as const;