import express, { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get leads for an agent
router.get('/', async (req: Request, res: Response) => {
  try {
    const { agent_id, status } = req.query

    if (!agent_id) {
      return res.status(400).json({ error: 'agent_id is required' })
    }

    let query = supabase
      .from('leads')
      .select(`
        *,
        property:properties(
          id,
          title,
          price,
          images:property_images(url, is_primary)
        )
      `)
      .eq('agent_id', agent_id)

    if (status) {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error fetching leads:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create new lead
router.post('/', async (req: Request, res: Response) => {
  try {
    const leadData = req.body

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (error) throw error

    // TODO: Send notification to agent

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error creating lead:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update lead status
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'status is required' })
    }

    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error updating lead:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get messages for a lead
router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(id, full_name, avatar_url),
        receiver:receiver_id(id, full_name, avatar_url)
      `)
      .eq('lead_id', id)
      .order('created_at', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: error.message })
  }
})

// Send message
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { sender_id, receiver_id, content } = req.body

    const { data, error } = await supabase
      .from('messages')
      .insert({
        lead_id: id,
        sender_id,
        receiver_id,
        content
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
