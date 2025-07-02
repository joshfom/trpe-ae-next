"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Filter, ArrowRight, X, Home, Building2, Bed, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

type SearchMode = "Buy" | "Rent" 

interface LuxeMainSearchProps {
  className?: string
  onSearch?: (query: string, mode: SearchMode) => void
  onFilterChange?: (filters: any) => void
}

export function LuxeMainSearch({ className, onSearch, onFilterChange }: LuxeMainSearchProps ) {
  const [searchMode, setSearchMode] = useState<SearchMode>("Buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    propertyType: "",
    bedrooms: "",
    location: ""
  })

  // Touch/swipe handling for sheet
  const sheetRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const searchModes: SearchMode[] = ["Buy", "Rent"]

  const handleSearch = () => {
    onSearch?.(searchQuery, searchMode)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      priceRange: { min: "", max: "" },
      propertyType: "",
      bedrooms: "",
      location: ""
    }
    setFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  // Handle touch events for swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isDownSwipe = distance < -50 // Swipe down threshold
    
    if (isDownSwipe && isFilterOpen) {
      setIsFilterOpen(false)
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className={cn("w-full py-8 sm:py-12", className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Mode Toggle */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto">
            {searchModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSearchMode(mode)}
                className={cn(
                  "relative pb-2 text-base sm:text-lg transition-colors duration-200 whitespace-nowrap",
                  searchMode === mode
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
                {searchMode === mode && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center focus-within:border-slate-500 bg-background border border-border rounded-2xl sm:rounded-full overflow-hidden shadow-sm">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for properties, locations, or keywords..."
              className="outline-none flex-1 border-0 focus:ring-0 text-base sm:text-lg focus:outline-none py-4 sm:py-6 px-4 sm:px-6 shadow-none rounded-none bg-transparent"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            
            {/* Separator and Actions */}
            <div className="flex items-center justify-between sm:justify-end px-4 sm:pr-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-border">
              {/* Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground px-3 py-2"
                  >
                    <Filter className="stroke-1 size-4 sm:size-5" />
                    <span className="text-sm sm:text-base">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  ref={sheetRef}
                  side="bottom" 
                  className="h-[85vh] rounded-t-3xl bg-white border-0 shadow-2xl backdrop-blur-sm p-0"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Drag Handle */}
                  <div className="w-full flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>
                  
                  <SheetHeader className="px-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-2xl font-playfair text-gray-900">Search Filters</SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                          <X className="h-4 w-4 text-gray-600" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
                    <div className="space-y-8">
                      {/* Price Range */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          
                          <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">
                              Minimum Price
                            </label>
                            <Input
                              placeholder="Min"
                              value={filters.priceRange.min}
                              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                              className="rounded-2xl bg-gray-50 border-gray-200 h-12"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">
                              Maximum Price
                            </label>
                            <Input
                              placeholder="Max"
                              value={filters.priceRange.max}
                              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                              className="rounded-2xl bg-gray-50 border-gray-200 h-12"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Property Type */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Home className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-medium text-gray-900">Property Type</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {["Apartment", "Villa", "Townhouse", "Penthouse", "Commercial"].map((type) => (
                            <Button
                              key={type}
                              variant={filters.propertyType === type ? "default" : "outline"}
                              onClick={() => handleFilterChange('propertyType', filters.propertyType === type ? "" : type)}
                              className="rounded-2xl justify-start bg-white hover:bg-gray-50 h-12"
                            >
                              <Building2 className="h-4 w-4 mr-2" />
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Bed className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-medium text-gray-900">Bedrooms</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[ "1", "2", "3", "4", "5+"].map((beds) => (
                            <Button
                              key={beds}
                              variant={filters.bedrooms === beds ? "default" : "outline"}
                              onClick={() => handleFilterChange('bedrooms', filters.bedrooms === beds ? "" : beds)}
                              className="rounded-2xl bg-white hover:bg-gray-50 h-12"
                            >
                              {beds}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-medium text-gray-900">Location</h3>
                        </div>
                        <Input
                          placeholder="Enter location..."
                          value={filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          className="rounded-2xl bg-gray-50 border-gray-200 h-12"
                        />
                      </div>
                      
                      {/* Add some bottom padding for safe scrolling */}
                      <div className="h-6"></div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex space-x-4 p-6 border-t border-gray-100 bg-white">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 rounded-2xl bg-white hover:bg-gray-50 border-gray-200 h-12"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 rounded-2xl bg-primary hover:bg-primary/90 h-12"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="h-6 w-px bg-border mx-3" />

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                variant={"outline"}
                className="flex items-center space-x-2 border-none px-4 py-2"
              >
                <ArrowRight className="size-6" />
              </Button>
            </div>
            </div>
        </div>

        {/* Search Mode Context Text */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {searchMode === "Buy" && "Find your perfect property to purchase"}
            {searchMode === "Rent" && "Discover premium rental properties"}
          </p>
        </div>
      </div>
    </div>
  )
}
