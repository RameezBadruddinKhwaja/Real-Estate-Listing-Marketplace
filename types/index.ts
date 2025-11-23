export interface Property {
  id: string
  title: string
  description: string
  price: number
  area: number
  area_unit: 'sqft' | 'sqm' | 'marla' | 'kanal'
  bedrooms: number
  bathrooms: number
  property_type: PropertyType
  listing_type: ListingType
  status: PropertyStatus
  featured: boolean
  location: Location
  coordinates: Coordinates
  images: PropertyImage[]
  amenities: string[]
  agent: Agent
  created_at: string
  updated_at: string
  views: number
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  thumbnail_url?: string
  is_primary: boolean
  order: number
}

export interface Location {
  id: string
  name: string
  city: string
  state: string
  country: string
  postal_code?: string
  address?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Agent {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  avatar_url?: string
  bio?: string
  agency?: string
  license_number?: string
  rating: number
  total_properties: number
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

export interface Lead {
  id: string
  property_id: string
  agent_id: string
  name: string
  email: string
  phone: string
  message: string
  status: LeadStatus
  created_at: string
}

export interface Message {
  id: string
  lead_id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export type PropertyType =
  | 'house'
  | 'apartment'
  | 'villa'
  | 'townhouse'
  | 'plot'
  | 'commercial'
  | 'farmhouse'
  | 'penthouse'

export type ListingType = 'sale' | 'rent'

export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'rented'

export type UserRole = 'buyer' | 'agent' | 'admin'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface SearchFilters {
  query?: string
  property_type?: PropertyType[]
  listing_type?: ListingType
  price_min?: number
  price_max?: number
  area_min?: number
  area_max?: number
  bedrooms?: number
  bathrooms?: number
  location?: string
  bounds?: BoundingBox
  amenities?: string[]
}

export interface BoundingBox {
  north: number
  south: number
  east: number
  west: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
