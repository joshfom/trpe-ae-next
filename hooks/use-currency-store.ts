import { create, SetState } from 'zustand';

type CurrencyState = {
    currency: 'AED' | 'GBP' | 'EUR' | 'USD';
    setCurrency: (currency: 'AED' | 'GBP' | 'EUR' | 'USD') => void;
};

export const useCurrencyStore = create<CurrencyState>((set: SetState<CurrencyState>) => ({
    currency: 'AED', // Default to AED
    setCurrency: (currency) => set({ currency }),
}));
