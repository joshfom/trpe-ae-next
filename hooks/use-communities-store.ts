import { create } from 'zustand';

interface Community {
  id: string;
  name: string;
  slug: string;
}

interface CommunityState {
  communities: Community[];
  setCommunities: (communities: Community[]) => void;
}

export const useCommunitiesStore = create<CommunityState>((set) => ({
  communities: [],
  setCommunities: (communities) => set({ communities }),
}));