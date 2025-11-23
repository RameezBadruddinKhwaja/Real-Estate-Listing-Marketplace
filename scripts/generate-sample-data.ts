/**
 * Script to generate sample property data for testing
 * Usage: npx ts-node scripts/generate-sample-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad']
const locations = {
  Karachi: ['DHA Phase 5', 'Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad', 'Bahria Town'],
  Lahore: ['DHA Phase 6', 'Gulberg', 'Johar Town', 'Bahria Town', 'Model Town'],
  Islamabad: ['F-7', 'F-6', 'G-10', 'Bahria Town', 'DHA Phase 2'],
  Rawalpindi: ['Bahria Town', 'Satellite Town', 'Gulistan Colony', 'PWD', 'Chaklala'],
  Faisalabad: ['Peoples Colony', 'Eden Valley', 'Canal Road', 'Gulberg', 'Model Town']
}

const propertyTypes = ['house', 'apartment', 'villa', 'townhouse', 'plot', 'commercial']
const amenities = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Garden',
  'Security',
  'Elevator',
  'Balcony',
  'Terrace',
  'Central Heating',
  'Central AC',
  'Servant Quarter',
  'Store Room',
  'Laundry Room',
  'Study Room',
  'Prayer Room'
]

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomCoordinates(city: string): { lat: number; lng: number } {
  const cityCoords: Record<string, { lat: number; lng: number; range: number }> = {
    Karachi: { lat: 24.8607, lng: 67.0011, range: 0.1 },
    Lahore: { lat: 31.5497, lng: 74.3436, range: 0.1 },
    Islamabad: { lat: 33.6844, lng: 73.0479, range: 0.05 },
    Rawalpindi: { lat: 33.5651, lng: 73.0169, range: 0.05 },
    Faisalabad: { lat: 31.4504, lng: 73.1350, range: 0.08 }
  }

  const coords = cityCoords[city] || cityCoords.Karachi
  return {
    lat: coords.lat + (Math.random() - 0.5) * coords.range,
    lng: coords.lng + (Math.random() - 0.5) * coords.range
  }
}

function generatePropertyTitle(type: string, location: string, bedrooms: number): string {
  const adjectives = ['Luxury', 'Modern', 'Spacious', 'Beautiful', 'Elegant', 'Premium', 'Stunning', 'Contemporary']
  const adj = randomElement(adjectives)

  if (type === 'plot' || type === 'commercial') {
    return `${adj} ${type} in ${location}`
  }

  return `${adj} ${bedrooms} Bedroom ${type} in ${location}`
}

function generateDescription(type: string, bedrooms: number, bathrooms: number, area: number, location: string): string {
  return `This beautiful ${type} offers ${bedrooms} spacious bedrooms and ${bathrooms} modern bathrooms, spread across ${area} square feet. Located in the prestigious ${location} area, this property combines comfort and convenience. Perfect for families looking for a quality home in a prime location. Don't miss this opportunity to own a piece of paradise!`
}

async function generateSampleData() {
  console.log('Starting sample data generation...')

  try {
    // Create locations
    console.log('Creating locations...')
    const locationRecords = []

    for (const [city, areas] of Object.entries(locations)) {
      for (const area of areas) {
        locationRecords.push({
          name: area,
          city,
          state: city === 'Islamabad' ? 'ICT' : city === 'Karachi' ? 'Sindh' : 'Punjab',
          country: 'Pakistan'
        })
      }
    }

    const { data: createdLocations, error: locationError } = await supabase
      .from('locations')
      .insert(locationRecords)
      .select()

    if (locationError) {
      console.error('Error creating locations:', locationError)
      return
    }

    console.log(`Created ${createdLocations.length} locations`)

    // Note: You need to manually create agent accounts via Supabase Auth first
    // Then retrieve agent IDs to assign to properties

    console.log('Sample data generation complete!')
    console.log('Note: Create agent accounts via Supabase Auth, then run property generation separately')

  } catch (error) {
    console.error('Error generating sample data:', error)
  }
}

generateSampleData()
