import express, { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get all agents
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, verified } = req.query

    let query = supabase
      .from('agents')
      .select('*', { count: 'exact' })

    if (verified === 'true') {
      query = query.eq('verified', true)
    }

    const offset = (Number(page) - 1) * Number(limit)
    query = query
      .range(offset, offset + Number(limit) - 1)
      .order('rating', { ascending: false })

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
    console.error('Error fetching agents:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single agent
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single()

    if (agentError) throw agentError

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    // Get agent's properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*)
      `)
      .eq('agent_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (propertiesError) throw propertiesError

    res.json({
      ...agent,
      properties
    })
  } catch (error: any) {
    console.error('Error fetching agent:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create agent profile
router.post('/', async (req: Request, res: Response) => {
  try {
    const agentData = req.body

    const { data, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error creating agent:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update agent profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error updating agent:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
