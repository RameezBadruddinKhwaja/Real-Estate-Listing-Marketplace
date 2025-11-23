import { Metadata } from 'next'
import { Property, Agent } from '@/types'

const SITE_NAME = 'Prime Properties'
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://primeproperties.com'

export function generatePropertyMetadata(property: Property): Metadata {
  const title = `${property.title} - ${SITE_NAME}`
  const description = property.description?.substring(0, 160) || `${property.bedrooms} bed ${property.property_type} for ${property.listing_type} in ${property.location?.name}`

  const images = property.images?.map(img => ({
    url: img.url,
    width: 1200,
    height: 630,
    alt: property.title
  })) || []

  return {
    title,
    description,
    keywords: [
      property.property_type,
      property.listing_type,
      property.location?.name || '',
      property.location?.city || '',
      'real estate',
      'property',
      `${property.bedrooms} bedroom`,
    ].filter(Boolean).join(', '),
    authors: [{ name: property.agent?.name || SITE_NAME }],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/property/${property.id}`,
      siteName: SITE_NAME,
      images,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length > 0 ? [images[0].url] : [],
    },
    robots: {
      index: property.status === 'approved',
      follow: true,
      googleBot: {
        index: property.status === 'approved',
        follow: true,
      },
    },
  }
}

export function generateAgentMetadata(agent: Agent): Metadata {
  const title = `${agent.name} - Real Estate Agent - ${SITE_NAME}`
  const description = agent.bio || `Contact ${agent.name}, professional real estate agent. ${agent.total_properties} properties listed.`

  return {
    title,
    description,
    keywords: [
      'real estate agent',
      agent.name,
      agent.agency || '',
      'property listings',
    ].filter(Boolean).join(', '),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/agent/${agent.id}`,
      siteName: SITE_NAME,
      images: agent.avatar_url ? [{
        url: agent.avatar_url,
        width: 400,
        height: 400,
        alt: agent.name
      }] : [],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export function generateStructuredData(property: Property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${SITE_URL}/property/${property.id}`,
    image: property.images?.map(img => img.url) || [],
    price: property.price,
    priceCurrency: 'PKR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location?.city,
      addressRegion: property.location?.state,
      addressCountry: property.location?.country || 'Pakistan',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.coordinates?.latitude,
      longitude: property.coordinates?.longitude,
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: property.area_unit.toUpperCase(),
    },
  }
}
