import { values } from 'lodash';
import { PriceFilter, OfferingType, SizeFilter } from '../types/property-search';

export const OFFERING_TYPES: OfferingType[] = [
  { slug: 'for-sale', label: 'For Sale' },
  { slug: 'for-rent', label: 'For Rent' },
  { slug: 'commercial-sale', label: 'Commercial' }
];

/**
 * An array of price filter objects used for filtering properties based on their price.
 * Each filter object contains a `value` representing the price in numerical format
 * and a `label` representing the price in a formatted string.
 *
 * @constant
 * @type {PriceFilter[]}
 * @example
 * // Example usage:
 * const filters = PRICE_FILTERS;
 * console.log(filters[0]); // { value: 400000, label: '400,000' }
 */


export const PRICE_FILTERS: PriceFilter[] = [
  { value: 400000, label: '400,000' },
  { value: 450000, label: '450,000' },
  { value: 500000, label: '500,000' },
  { value: 550000, label: '550,000' },
  { value: 600000, label: '600,000' },
  { value: 650000, label: '650,000' },
  { value: 700000, label: '700,000' },
    { value: 750000, label: '750,000' },
    { value: 800000, label: '800,000' },
    { value: 850000, label: '850,000' },
    { value: 900000, label: '900,000' },
    { value: 950000, label: '950,000' },
    { value: 1000000, label: '1,000,000' },
    { value: 1500000, label: '1,500,000' },
    { value: 2000000, label: '2,000,000' },
    { value: 2500000, label: '2,500,000' },
    { value: 3000000, label: '3,000,000' },
    { value: 3500000, label: '3,500,000' },
    { value: 4000000, label: '4,000,000' },
    { value: 4500000, label: '4,500,000' },
    { value: 5000000, label: '5,000,000' },
    { value: 5500000, label: '5,500,000' },
    { value: 6000000, label: '6,000,000' },
    { value: 6500000, label: '6,500,000' },
    { value: 7000000, label: '7,000,000' },
    { value: 7500000, label: '7,500,000' },
    { value: 8000000, label: '8,000,000' },
    { value: 8500000, label: '8,500,000' },
    { value: 9000000, label: '9,000,000' },
    { value: 9500000, label: '9,500,000' },
    { value: 10000000, label: '10,000,000' },
    { value: 15000000, label: '15,000,000' },
    { value: 20000000, label: '20,000,000' },
    { value: 25000000, label: '25,000,000' },
    { value: 30000000, label: '30,000,000' },
    { value: 35000000, label: '35,000,000' },
    { value: 40000000, label: '40,000,000' },
    { value: 45000000, label: '45,000,000' },
    { value: 50000000, label: '50,000,000' },
    { value: 55000000, label: '55,000,000' },
    { value: 60000000, label: '60,000,000' },
    { value: 65000000, label: '65,000,000' },
    { value: 70000000, label: '70,000,000' },
    { value: 75000000, label: '75,000,000' },
    { value: 80000000, label: '80,000,000' },
    { value: 85000000, label: '85,000,000' },
    { value: 90000000, label: '90,000,000' },
    { value: 95000000, label: '95,000,000' },
    { value: 100000000, label: '100,000,000' },
    { value: 150000000, label: '150,000,000' },
    { value: 200000000, label: '200,000,000' },
    { value: 250000000, label: '250,000,000' },
    { value: 300000000, label: '300,000,000' },
    { value: 350000000, label: '350,000,000' },
    { value: 400000000, label: '400,000,000' },
    { value: 450000000, label: '450,000,000' },
    { value: 500000000, label: '500,000,000' },
    { value: 550000000, label: '550,000,000' },
    { value: 600000000, label: '600,000,000' },
    { value: 650000000, label: '650,000,000' },
    { value: 700000000, label: '700,000,000' },
    { value: 750000000, label: '750,000,000' },
    { value: 800000000, label: '800,000,000' },
    { value: 850000000, label: '850,000,000' },
    { value: 900000000, label: '900,000,000' },
    { value: 950000000, label: '950,000,000' },
    { value: 1000000000, label: '1,000,000,000' },
];

export const SIZE_FILTERS: SizeFilter[] = [
  { value: 1000, label: '1,000 Sqft' },
  { value: 2000, label: '2,000 Sqft' },
  { value: 3000, label: '3,000 Sqft' },
  { value: 4000, label: '4,000 Sqft' },
  { value: 5000, label: '5,000 Sqft' },
  { value: 6000, label: '6,000 Sqft' },
  { value: 7000, label: '7,000 Sqft' },
  { value: 8000, label: '8,000 Sqft' },
  { value: 9000, label: '9,000 Sqft' },
  { value: 10000, label: '10,000 Sqft' },
  { value: 15000, label: '15,000 Sqft' },
  { value: 20000, label: '20,000 Sqft' },
  { value: 25000, label: '25,000 Sqft' },
  { value: 30000, label: '30,000 Sqft' },
];
