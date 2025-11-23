import { z } from 'zod'

// Property validation schema
export const propertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  price: z.number().positive('Price must be positive'),
  area: z.number().positive('Area must be positive'),
  area_unit: z.enum(['sqft', 'sqm', 'marla', 'kanal']),
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  property_type: z.enum(['house', 'apartment', 'villa', 'townhouse', 'plot', 'commercial', 'farmhouse', 'penthouse']),
  listing_type: z.enum(['sale', 'rent']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  amenities: z.array(z.string()).optional(),
  address: z.string().optional(),
})

// Lead/Contact form validation
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  property_id: z.string().uuid(),
  agent_id: z.string().uuid(),
})

// Agent profile validation
export const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  agency: z.string().max(100).optional(),
  license_number: z.string().optional(),
})

// Search filters validation
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  property_type: z.array(z.enum(['house', 'apartment', 'villa', 'townhouse', 'plot', 'commercial', 'farmhouse', 'penthouse'])).optional(),
  listing_type: z.enum(['sale', 'rent']).optional(),
  price_min: z.number().positive().optional(),
  price_max: z.number().positive().optional(),
  area_min: z.number().positive().optional(),
  area_max: z.number().positive().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  location: z.string().optional(),
})

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate and sanitize user input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      }
    }
    return {
      success: false,
      errors: ['Validation failed']
    }
  }
}
