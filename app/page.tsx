'use client'

import { useState, useEffect } from 'react'
import { Property, SearchFilters } from '@/types'
import Header from '@/components/layout/Header'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyFilters from '@/components/property/PropertyFilters'
import PropertyMap from '@/components/map/PropertyMap'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapIcon, Grid3x3 } from 'lucide-react'
import { getProperties } from '@/lib/api/properties'

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [filters])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await getProperties(filters)
      setProperties(response.data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters({ ...filters, query: searchQuery })
  }

  const handleMapBoundsChange = (bounds: any) => {
    setFilters({ ...filters, bounds })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the perfect home with AI-powered search and real-time map exploration
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 bg-white rounded-lg shadow-lg p-2">
              <Input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="border-0 focus-visible:ring-0 text-base"
              />
              <Button onClick={handleSearch} size="lg">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, property_type: ['house'] })}
              >
                Houses
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, property_type: ['apartment'] })}
              >
                Apartments
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, listing_type: 'rent' })}
              >
                For Rent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, listing_type: 'sale' })}
              >
                For Sale
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <PropertyFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </aside>

          {/* Properties Content */}
          <div className="flex-1">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Loading...' : `${properties.length} Properties Found`}
              </h2>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <PropertyMap
                properties={properties}
                onBoundsChange={handleMapBoundsChange}
                height="calc(100vh - 300px)"
              />
            )}

            {/* Empty State */}
            {!loading && properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No properties found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
