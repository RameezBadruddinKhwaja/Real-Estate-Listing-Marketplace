'use client'

import { useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PropertyMapProps {
  properties: Property[]
  onBoundsChange?: (bounds: any) => void
  selectedPropertyId?: string
  height?: string
}

export default function PropertyMap({
  properties,
  onBoundsChange,
  selectedPropertyId,
  height = '600px'
}: PropertyMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [popupInfo, setPopupInfo] = useState<Property | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 67.0011,
    latitude: 24.8607,
    zoom: 11
  })

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find(p => p.id === selectedPropertyId)
      if (property) {
        setViewState({
          longitude: property.coordinates.longitude,
          latitude: property.coordinates.latitude,
          zoom: 14
        })
        setPopupInfo(property)
      }
    }
  }, [selectedPropertyId, properties])

  const handleMapMove = () => {
    if (mapRef.current && onBoundsChange) {
      const bounds = mapRef.current.getMap().getBounds()
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    }
  }

  // Create GeoJSON for clustering
  const geojsonData = {
    type: 'FeatureCollection',
    features: properties.map(property => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [property.coordinates.longitude, property.coordinates.latitude]
      },
      properties: {
        id: property.id,
        title: property.title,
        price: property.price
      }
    }))
  }

  // Cluster layer
  const clusterLayer = {
    id: 'clusters',
    type: 'circle' as const,
    source: 'properties',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#3B82F6',
        10,
        '#2563EB',
        30,
        '#1D4ED8'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        30,
        40
      ]
    }
  }

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol' as const,
    source: 'properties',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    paint: {
      'text-color': '#ffffff'
    }
  }

  return (
    <div style={{ height, width: '100%' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onMoveEnd={handleMapMove}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Clustering */}
        <Source
          id="properties"
          type="geojson"
          data={geojsonData as any}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
        </Source>

        {/* Individual markers */}
        {properties.map(property => (
          <Marker
            key={property.id}
            longitude={property.coordinates.longitude}
            latitude={property.coordinates.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation()
              setPopupInfo(property)
            }}
          >
            <div className="cursor-pointer transform hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8 text-primary fill-primary drop-shadow-lg" />
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.coordinates.longitude}
            latitude={popupInfo.coordinates.latitude}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <Link href={`/property/${popupInfo.id}`}>
              <div className="w-64">
                {popupInfo.images && popupInfo.images.length > 0 && (
                  <div className="relative w-full h-40 mb-2">
                    <Image
                      src={popupInfo.images.find(img => img.is_primary)?.url || popupInfo.images[0].url}
                      alt={popupInfo.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-1">{popupInfo.title}</h3>
                <p className="text-primary font-bold text-lg">{formatPrice(popupInfo.price)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {popupInfo.bedrooms} beds • {popupInfo.bathrooms} baths
                </p>
              </div>
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  )
}
