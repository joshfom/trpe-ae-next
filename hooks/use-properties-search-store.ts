import {create} from 'zustand';
import { PropertyType } from "@/types/property";

interface PropertiesState {
    properties: PropertyType[];
    isLoading: boolean;
    hasMore: boolean;
    totalCount: number;
    getNextPage: boolean;
    gettingNextPage: boolean;
    setProperties: (properties: PropertyType[]) => void;
    setGettingNextPage: (gettingNextPage: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setHasMore: (hasMore: boolean) => void;
    setTotalCount: (totalCount: number) => void;
    setGetNextPage: (getNextPage: boolean) => void;
    loadMore: () => void;
}

export const usePropertiesSearchStore = create<PropertiesState>((set, get) => ({
    properties: [],
    isLoading: true,
    hasMore: false,
    totalCount: 0,
    getNextPage: false,
    gettingNextPage: false,
    setProperties: (properties) => set({properties}),
    setGettingNextPage: (gettingNextPage) => set({gettingNextPage}),
    setIsLoading: (isLoading) => set({isLoading}),
    setHasMore: (hasMore) => set({hasMore}),
    setTotalCount: (totalCount) => set({totalCount}),
    setGetNextPage: (getNextPage) => set({getNextPage}),
    loadMore: () => {
        console.log('loading more more');
        const {hasMore, getNextPage} = get();
        if (hasMore && !getNextPage) {
            set({getNextPage: true});
        }
    }
}));