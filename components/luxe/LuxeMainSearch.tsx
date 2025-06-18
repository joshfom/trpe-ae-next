"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type SearchMode = "Buy" | "Rent" | "Development"

interface LuxeMainSearchProps {
  className?: string
  onSearch?: (query: string, mode: SearchMode) => void
  onFilterChange?: (filters: any) => void
}

export function LuxeMainSearch({ className, onSearch, onFilterChange }: LuxeMainSearchProps ) {
  const [searchMode, setSearchMode] = useState<SearchMode>("Buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const searchModes: SearchMode[] = ["Buy", "Rent", "Development"]

  const handleSearch = () => {
    onSearch?.(searchQuery, searchMode)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center focus-within:border-slate-500 bg-background border border-border rounded-2xl sm:rounded-full overflow-hidden">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for properties, locations, or keywords..."
              className="outline-none flex-1 border-0 focus:ring-white text-base sm:text-lg focus:outline-none focus:outline-hidden py-4 sm:py-6 px-4 sm:px-6 shadow-none rounded-none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            
            {/* Separator and Actions */}
            <div className="flex items-center justify-between sm:justify-end px-4 sm:pr-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-border">
              {/* Filter Button */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground px-3 py-2"
                >
                <Filter className="stroke-1 size-4 sm:size-5" />
                <span className="text-sm sm:text-base">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 sm:w-96 pt-3" align="end">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="space-y-4">
                <h4 className="font-medium leading-none">Filters</h4>
                <div className="text-sm text-muted-foreground">
                  Filter functionality will be implemented here
                </div>
                {/* Placeholder for filter controls */}
                <div className="space-y-3">
                  <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="text-xs text-muted-foreground mt-1">Coming soon...</div>
                  </div>
                  <div>
                  <label className="text-sm font-medium">Property Type</label>
                  <div className="text-xs text-muted-foreground mt-1">Coming soon...</div>
                  </div>
                  <div>
                  <label className="text-sm font-medium">Bedrooms</label>
                  <div className="text-xs text-muted-foreground mt-1">Coming soon...</div>
                  </div>
                </div>
                </div>
                </div>
              </PopoverContent>
              </Popover>

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
            {searchMode === "Development" && "Explore new development projects"}
          </p>
        </div>
      </div>
    </div>
  )
}
