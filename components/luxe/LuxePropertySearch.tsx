"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { safeGTMPush } from '@/lib/gtm-form-filter'

interface SearchFilters {
  type: string
  location: string
  bedrooms: string
  priceFrom: string
  priceTo: string
}

interface LuxePropertySearchProps {
  onSearch?: (filters: SearchFilters) => void
  onClearFilters?: () => void
  resultsCount?: number
  communityFilter?: string
  className?: string
}

export default function LuxePropertySearch({ 
  onSearch, 
  onClearFilters, 
  resultsCount = 6,
  communityFilter = "City",
  className 
}: LuxePropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    type: "",
    location: "",
    bedrooms: "",
    priceFrom: "",
    priceTo: ""
  })

  const propertyTypes = ["Villa", "Apartment", "Penthouse", "Townhouse", "Studio"]
  const locations = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "DIFC", "Business Bay", "JBR"]
  const bedroomOptions = ["Studio", "1", "2", "3", "4", "5+"]

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch?.(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      type: "",
      location: "",
      bedrooms: "",
      priceFrom: "",
      priceTo: ""
    }
    setFilters(clearedFilters)
    onClearFilters?.()
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "")

  return (
    <div className={cn("w-full", className)}>
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              onFocus={(e) => {
                // Prevent GTM form tracking
                e.stopPropagation();
                (e.nativeEvent as Event).stopImmediatePropagation?.();
              }}
              className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              suppressHydrationWarning={true}
            >
              <option value="">Type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              onFocus={(e) => {
                // Prevent GTM form tracking
                e.stopPropagation();
                (e.nativeEvent as Event).stopImmediatePropagation?.();
              }}
              className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              suppressHydrationWarning={true}
            >
              <option value="">Location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms Dropdown */}
          <div className="relative">
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              onFocus={(e) => {
                // Prevent GTM form tracking
                e.stopPropagation();
                (e.nativeEvent as Event).stopImmediatePropagation?.();
              }}
              className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              suppressHydrationWarning={true}
            >
              <option value="">Bedrooms</option>
              {bedroomOptions.map(bedroom => (
                <option key={bedroom} value={bedroom}>{bedroom}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="from"
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange("priceFrom", e.target.value)}
              onFocus={(e) => {
                // Prevent GTM form tracking
                e.stopPropagation();
                (e.nativeEvent as Event).stopImmediatePropagation?.();
              }}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              suppressHydrationWarning={true}
            />
            <span className="text-gray-400">-</span>
            <input
              type="text"
              placeholder="to"
              value={filters.priceTo}
              onChange={(e) => handleFilterChange("priceTo", e.target.value)}
              onFocus={(e) => {
                // Prevent GTM form tracking
                e.stopPropagation();
                (e.nativeEvent as Event).stopImmediatePropagation?.();
              }}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              suppressHydrationWarning={true}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              console.log('LuxePropertySearch search button clicked');
              console.log('Filters:', filters);
              
              // Track luxe search submission using safe GTM push
              safeGTMPush({
                event: 'luxe_property_search',
                search_location: 'luxe_property_search',
                search_type: 'luxe',
                search_query: '',
                form_data: {
                  property_type: filters.type,
                  location: filters.location,
                  bedrooms: filters.bedrooms,
                  price_from: filters.priceFrom,
                  price_to: filters.priceTo
                },
                timestamp: new Date().toISOString()
              });
              
              onSearch?.(filters);
            }}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Show Results
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-800">
        {resultsCount} Property found
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">
        Community: {communityFilter}
          </span>
        </div>

        {hasActiveFilters && (
          <button
        onClick={handleClearFilters}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors w-fit"
          >
        <X className="w-4 h-4" />
        <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  )
}
