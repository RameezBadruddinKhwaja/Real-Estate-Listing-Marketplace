'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import PropertyCard from '@/components/property/PropertyCard'
import { Property } from '@/types'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      // TODO: Implement with actual user ID from auth
      // const response = await fetch('/api/favorites?user_id=USER_ID')
      // const data = await response.json()
      // setFavorites(data.map((f: any) => f.property))
      setFavorites([])
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (propertyId: string) => {
    // TODO: Implement favorite removal
    console.log('Remove favorite:', propertyId)
    setFavorites(favorites.filter(p => p.id !== propertyId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring properties and save your favorites!
            </p>
            <a
              href="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleRemoveFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
