import { useReducer } from 'react';
import { FilterState } from '@/features/search/types/property-search.types';
import { CommunityFilterType } from '@/types/community';

type SearchAction =
    | { type: 'SET_SHOW_FILTERS'; payload: boolean }
    | { type: 'SET_SHOW_SEARCH_DROPDOWN'; payload: boolean }
    | { type: 'SET_SEARCH_INPUT'; payload: string }
    | { type: 'SET_SELECTED_COMMUNITIES'; payload: CommunityFilterType[] }
    | { type: 'RESET_FILTERS' };

const initialState: FilterState = {
    showFilters: false,
    showSearchDropdown: false,
    isOpen: false,
    searchInput: '',
    searchType: 'for-sale',
    openMobileSearch: false,
    selectedCommunities: [],
    searchedCommunities: [],
    searchMode: 'for-sale',
    filtersCount: 0
};

function searchReducer(state: FilterState, action: SearchAction): FilterState {
    switch (action.type) {
        case 'SET_SHOW_FILTERS':
            return { ...state, showFilters: action.payload };
        case 'SET_SHOW_SEARCH_DROPDOWN':
            return { ...state, showSearchDropdown: action.payload };
        case 'SET_SEARCH_INPUT':
            return { ...state, searchInput: action.payload };
        case 'SET_SELECTED_COMMUNITIES':
            return { ...state, selectedCommunities: action.payload };
        case 'RESET_FILTERS':
            return { ...initialState };
        default:
            return state;
    }
}

export const useSearchReducer = () => {
    return useReducer(searchReducer, initialState);
};