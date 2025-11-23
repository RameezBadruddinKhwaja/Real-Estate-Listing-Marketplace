'use client'

import { useState } from 'react'
import { SearchFilters, PropertyType, ListingType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface PropertyFiltersProps {
  onFilterChange: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export default function PropertyFilters({ onFilterChange, initialFilters = {} }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showFilters, setShowFilters] = useState(false)

  const propertyTypes: PropertyType[] = ['house', 'apartment', 'villa', 'townhouse', 'plot', 'commercial', 'farmhouse', 'penthouse']

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const togglePropertyType = (type: PropertyType) => {
    const currentTypes = filters.property_type || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]

    handleFilterChange('property_type', newTypes.length > 0 ? newTypes : undefined)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof SearchFilters] !== undefined)

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {Object.keys(filters).length}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Listing Type */}
            <div className="space-y-2">
              <Label>Listing Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={filters.listing_type === 'sale' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('listing_type', filters.listing_type === 'sale' ? undefined : 'sale')}
                  className="flex-1"
                >
                  For Sale
                </Button>
                <Button
                  variant={filters.listing_type === 'rent' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('listing_type', filters.listing_type === 'rent' ? undefined : 'rent')}
                  className="flex-1"
                >
                  For Rent
                </Button>
              </div>
            </div>

            {/* Property Types */}
            <div className="space-y-2">
              <Label>Property Type</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map(type => (
                  <Button
                    key={type}
                    variant={filters.property_type?.includes(type) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePropertyType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Price</Label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.price_min || ''}
                    onChange={(e) => handleFilterChange('price_min', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Price</Label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.price_max || ''}
                    onChange={(e) => handleFilterChange('price_max', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div className="space-y-2">
              <Label>Area (sqft)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Area</Label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.area_min || ''}
                    onChange={(e) => handleFilterChange('area_min', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Area</Label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.area_max || ''}
                    onChange={(e) => handleFilterChange('area_max', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label>Minimum Bedrooms</Label>
              <Select
                value={filters.bedrooms?.toString()}
                onValueChange={(value) => handleFilterChange('bedrooms', value ? Number(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label>Minimum Bathrooms</Label>
              <Select
                value={filters.bathrooms?.toString()}
                onValueChange={(value) => handleFilterChange('bathrooms', value ? Number(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                type="text"
                placeholder="Enter location..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.listing_type && (
            <Badge variant="secondary" className="gap-2">
              {filters.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('listing_type', undefined)}
              />
            </Badge>
          )}
          {filters.property_type?.map(type => (
            <Badge key={type} variant="secondary" className="gap-2 capitalize">
              {type}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => togglePropertyType(type)}
              />
            </Badge>
          ))}
          {filters.bedrooms && (
            <Badge variant="secondary" className="gap-2">
              {filters.bedrooms}+ Beds
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('bedrooms', undefined)}
              />
            </Badge>
          )}
          {filters.bathrooms && (
            <Badge variant="secondary" className="gap-2">
              {filters.bathrooms}+ Baths
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('bathrooms', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
