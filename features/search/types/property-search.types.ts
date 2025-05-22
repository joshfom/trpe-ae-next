export interface CommunityFilterType {
    id: string;
    slug: string;
    name: string | null;
    shortName: string;
    propertyCount?: number;        // Make these counts optional if they're not always present
    rentCount?: number;
    saleCount?: number;
    commercialRentCount?: number;
    commercialSaleCount?: number;
}

export interface SearchFormData {
    query: string;
    unitType: string;
    minPrice: string;
    maxPrice: string;
    minSize: string;
    maxSize: string;
    bed: number;
    bath: number;
    status: string;
    offerType: string;
    furnishing: string;
    sortBy: string;
    currency: string;
}

export interface FilterState {
    showFilters: boolean;
    showSearchDropdown: boolean;
    isOpen: boolean;
    searchInput: string;
    searchType: string;
    openMobileSearch: boolean;
    selectedCommunities: CommunityFilterType[];
    searchedCommunities: CommunityFilterType[];
    searchMode: string;
    filtersCount: number;
}