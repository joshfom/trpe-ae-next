import { create, SetState } from 'zustand';

type UnitState = {
    unit: 'sqf' | 'sqm';
    setUnit: (unit: 'sqf' | 'sqm') => void;
};

export const useUnitStore = create<UnitState>((set: SetState<UnitState>) => ({
    unit: 'sqf', // Default to square feet
    setUnit: (unit) => set({ unit }),
}));
