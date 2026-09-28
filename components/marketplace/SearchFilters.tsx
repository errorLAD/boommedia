'use client'

import React, { useState } from 'react'
import { Search, Filter, X, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface SearchFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  activeFilterCount?: number
  onReset?: () => void
}

export function SearchFilters({
  search,
  onSearchChange,
  placeholder = 'Search...',
  children,
  activeFilterCount = 0,
  onReset,
}: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Top Search Bar with Filter Trigger on Mobile */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="h-11 rounded-xl pl-10 pr-4 text-sm bg-card border-border/80 shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl px-4 flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-6 overflow-y-auto">
              <SheetHeader className="mb-6 text-left">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base font-bold">Filter Options</SheetTitle>
                  {onReset && activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onReset}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="space-y-6">{children}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Reset Button */}
        {onReset && activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="hidden lg:flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Desktop Filters are rendered by parent in a sidebar grid */}
    </div>
  )
}
export default SearchFilters
