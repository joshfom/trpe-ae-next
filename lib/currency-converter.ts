import {useCurrencyStore} from "@/hooks/use-currency-store";


export default function currencyConverter(value: number | null): string | null {
    const currency = useCurrencyStore.getState().currency; // Retrieve the current currency from the Zustand store

    // If no value is passed, return null
    if (value === null) {
        return null;
    }

    let result = value;
    let currencySymbol = '';

    // Convert AED to other currencies if the current currency is not AED
    if (currency === 'GBP') {
        result = value * 0.20; // Conversion rate from AED to GBP
        currencySymbol = '£';
    } else if (currency === 'EUR') {
        result = value * 0.23; // Conversion rate from AED to EUR
        currencySymbol = '€';
    } else if (currency === 'USD') {
        result = value * 0.27; // Conversion rate from AED to USD
        currencySymbol = '$';
    } else if (currency === 'AED') {
        currencySymbol = 'AED';
    }

    // Return the result and the currency symbol as a string
    return currencySymbol + ' ' + result.toLocaleString();
}
