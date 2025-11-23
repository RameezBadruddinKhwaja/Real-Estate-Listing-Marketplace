import express, { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get properties with filters and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      property_type,
      listing_type,
      price_min,
      price_max,
      area_min,
      area_max,
      bedrooms,
      bathrooms,
      location,
      search,
      bounds,
      featured
    } = req.query

    let query = supabase
      .from('properties')
      .select(`
        *,
        location:locations(*),
        agent:agents(*),
        images:property_images(*)
      `, { count: 'exact' })
      .eq('status', 'approved')

    // Apply filters
    if (property_type) {
      const types = Array.isArray(property_type) ? property_type : [property_type]
      query = query.in('property_type', types)
    }

    if (listing_type) {
      query = query.eq('listing_type', listing_type)
    }

    if (price_min) {
      query = query.gte('price', Number(price_min))
    }

    if (price_max) {
      query = query.lte('price', Number(price_max))
    }

    if (area_min) {
      query = query.gte('area', Number(area_min))
    }

    if (area_max) {
      query = query.lte('area', Number(area_max))
    }

    if (bedrooms) {
      query = query.gte('bedrooms', Number(bedrooms))
    }

    if (bathrooms) {
      query = query.gte('bathrooms', Number(bathrooms))
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Geospatial search (bounding box)
    if (bounds) {
      const { north, south, east, west } = JSON.parse(bounds as string)

      const { data: geoData } = await supabase
        .rpc('search_properties_in_bounds', {
          min_lat: south,
          min_lng: west,
          max_lat: north,
          max_lng: east
        })

      if (geoData) {
        const propertyIds = geoData.map((p: any) => p.id)
        query = query.in('id', propertyIds)
      }
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit)
    query = query.range(offset, offset + Number(limit) - 1)

    // Order by
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    res.json({
      data,
      total: count,
      page: Number(page),
      page_size: Number(limit),
      total_pages: Math.ceil((count || 0) / Number(limit))
    })
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single property by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(*),
        agent:agents(*),
        images:property_images(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'Property not found' })
    }

    // Increment views
    await supabase.rpc('increment_property_views', { property_id: id })

    res.json(data)
  } catch (error: any) {
    console.error('Error fetching property:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create new property
router.post('/', async (req: Request, res: Response) => {
  try {
    const propertyData = req.body

    // Create coordinates geography point
    const coordinates = `POINT(${propertyData.longitude} ${propertyData.latitude})`

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        coordinates
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error creating property:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update property
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Update coordinates if latitude/longitude changed
    if (updates.latitude && updates.longitude) {
      updates.coordinates = `POINT(${updates.longitude} ${updates.latitude})`
    }

    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error updating property:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete property
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Property deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting property:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
