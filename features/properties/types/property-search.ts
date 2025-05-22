
export type SearchType = 'for-sale' | 'for-rent' | 'commercial-sale';

export interface PropertySearchFormValues {
  query: string;
  ty: string;
  miPrice: string;
  mxPrice: string;
  miSize: string;
  mxSize: string;
  bed: number;
  bath: number;
  status: string;
  sType: SearchType;
}

export interface SearchState {
  searchInput: string;
  searchType: SearchType;
  selectedCommunities: CommunityFilterType[];
  communityResults: CommunityFilterType[];
}

export interface OfferingType {
  slug: SearchType;
  label: string;
}

export interface PriceFilter {
  value: number;
  label: string;
}

export interface SizeFilter {
  value: number;
  label: string;
}
