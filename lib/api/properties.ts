import { Property, SearchFilters, PaginatedResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function getProperties(filters?: SearchFilters): Promise<PaginatedResponse<Property>> {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.query) params.append('search', filters.query)
    if (filters.property_type) {
      filters.property_type.forEach(type => params.append('property_type', type))
    }
    if (filters.listing_type) params.append('listing_type', filters.listing_type)
    if (filters.price_min) params.append('price_min', filters.price_min.toString())
    if (filters.price_max) params.append('price_max', filters.price_max.toString())
    if (filters.area_min) params.append('area_min', filters.area_min.toString())
    if (filters.area_max) params.append('area_max', filters.area_max.toString())
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString())
    if (filters.location) params.append('location', filters.location)
    if (filters.bounds) params.append('bounds', JSON.stringify(filters.bounds))
  }

  const response = await fetch(`${API_BASE_URL}/api/properties?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }

  return response.json()
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create property')
  }

  return response.json()
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update property')
  }

  return response.json()
}

export async function deleteProperty(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete property')
  }
}

// AI Services
export async function generateDescription(data: any): Promise<any> {
  const response = await fetch(`${process.env.AI_API_URL}/generate-description`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to generate description')
  }

  return response.json()
}

export async function estimatePrice(data: any): Promise<any> {
  const response = await fetch(`${process.env.AI_API_URL}/estimate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to estimate price')
  }

  return response.json()
}
