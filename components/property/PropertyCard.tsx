'use client'

import { Property } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatArea } from '@/lib/utils'
import { Bed, Bath, Maximize2, MapPin, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface PropertyCardProps {
  property: Property
  onFavorite?: (propertyId: string) => void
  isFavorited?: boolean
}

export default function PropertyCard({ property, onFavorite, isFavorited = false }: PropertyCardProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const primaryImage = property.images?.find(img => img.is_primary) || property.images?.[0]

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorited(!favorited)
    if (onFavorite) {
      onFavorite(property.id)
    }
  }

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative h-56 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && (
              <Badge className="bg-yellow-500 text-white">Featured</Badge>
            )}
            <Badge variant="secondary" className="bg-white/90">
              {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
          </div>

          {/* Favorite button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-bold text-xl">{formatPrice(property.price)}</p>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.location?.name}, {property.location?.city}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-700">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize2 className="w-4 h-4" />
              <span>{formatArea(property.area, property.area_unit)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
          <div className="flex items-center gap-2">
            {property.agent?.avatar_url ? (
              <Image
                src={property.agent.avatar_url}
                alt={property.agent.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}
            <span className="text-sm text-gray-600">{property.agent?.name}</span>
          </div>

          <Badge variant="outline" className="capitalize">
            {property.property_type}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
