import { create } from 'zustand';

interface PropertyType {
  id: string;
  name: string;
  slug: string;
}

interface PropertyTypeState {
  propertyTypes: PropertyType[];
  setPropertyTypes: (propertyTypes: PropertyType[]) => void;
}

export const usePropertyTypesStore = create<PropertyTypeState>((set) => ({
  propertyTypes: [],
  setPropertyTypes: (propertyTypes) => set({ propertyTypes }),
}));