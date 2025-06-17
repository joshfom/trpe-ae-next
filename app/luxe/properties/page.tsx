"use client"

import { useState } from "react"
import LuxePropertySearch from "@/components/luxe/LuxePropertySearch"
import LuxePropCard from "@/components/luxe/LuxePropCard"
import LuxePagination from "@/components/luxe/LuxePagination"

export default function LuxePropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsCount, setResultsCount] = useState(6)
  
  // Mock property data - in real app this would come from API/database
  const mockProperties = [
    {
      id: "1",
      title: "West Square Villa",
      location: "Jumeirah Village Triangle",
      price: 2300000,
      beds: 5,
      baths: 7,
      sqft: 9780,
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "2",
      title: "Marina Bay Penthouse",
      location: "Dubai Marina",
      price: 4500000,
      beds: 4,
      baths: 5,
      sqft: 8200,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "3",
      title: "Palm Jumeirah Mansion",
      location: "Palm Jumeirah",
      price: 8900000,
      beds: 6,
      baths: 8,
      sqft: 12500,
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "4",
      title: "Downtown Luxury Apartment",
      location: "Downtown Dubai",
      price: 3200000,
      beds: 3,
      baths: 4,
      sqft: 6500,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "5",
      title: "Business Bay Tower",
      location: "Business Bay",
      price: 1800000,
      beds: 2,
      baths: 3,
      sqft: 4200,
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "6",
      title: "DIFC Premium Office",
      location: "DIFC",
      price: 5600000,
      beds: 4,
      baths: 5,
      sqft: 7800,
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]

  const totalPages = Math.ceil(resultsCount / 6) || 1

  const handleSearch = (filters: any) => {
    console.log("Search filters:", filters)
    // In real app, this would trigger an API call
    // For now, just log the filters
  }

  const handleClearFilters = () => {
    console.log("Clearing filters")
    // In real app, this would reset the search results
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // In real app, this would fetch new page of results
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className='w-full relative h-[60vh] lg:h-[70vh]'>
        {/* Background Image - Modern architecture with greenery */}
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern Architecture"
          className='w-full h-full object-cover'
        />
        
        {/* Light overlay for better search visibility */}
        <div className='absolute inset-0 bg-white/30'></div>
        
        {/* Search Container */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='max-w-6xl mx-auto px-4 w-full'>
            <LuxePropertySearch 
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
              resultsCount={resultsCount}
              communityFilter="City"
            />
          </div>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className='w-full py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4'>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-playfair font-medium text-gray-800">
                {resultsCount} Properties found
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                Community: City
              </span>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear Filters</span>
            </button>
          </div>

          {/* Properties Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {mockProperties.map((property) => (
              <LuxePropCard 
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                imageUrl={property.imageUrl}
                className='bg-white shadow-sm hover:shadow-lg transition-shadow'
              />
            ))}
          </div>

          {/* Pagination */}
          <LuxePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        </div>
      </section>
    </div>
  )
}
