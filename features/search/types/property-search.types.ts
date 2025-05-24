import { CommunityFilterType } from "@/types/community";

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