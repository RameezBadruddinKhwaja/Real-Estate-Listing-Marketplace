import express, { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get user's favorites
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' })
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        property:properties(
          *,
          location:locations(*),
          agent:agents(*),
          images:property_images(*)
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error fetching favorites:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add to favorites
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, property_id } = req.body

    if (!user_id || !property_id) {
      return res.status(400).json({ error: 'user_id and property_id are required' })
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id, property_id })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Property already in favorites' })
      }
      throw error
    }

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error adding favorite:', error)
    res.status(500).json({ error: error.message })
  }
})

// Remove from favorites
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Removed from favorites' })
  } catch (error: any) {
    console.error('Error removing favorite:', error)
    res.status(500).json({ error: error.message })
  }
})

// Check if property is favorited
router.get('/check', async (req: Request, res: Response) => {
  try {
    const { user_id, property_id } = req.query

    if (!user_id || !property_id) {
      return res.status(400).json({ error: 'user_id and property_id are required' })
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user_id)
      .eq('property_id', property_id)
      .maybeSingle()

    if (error) throw error

    res.json({ is_favorited: !!data, favorite_id: data?.id })
  } catch (error: any) {
    console.error('Error checking favorite:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
