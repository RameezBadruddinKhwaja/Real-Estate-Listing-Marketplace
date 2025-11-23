import express, { Request, Response, NextFunction } from 'express'
import serverless from 'serverless-http'
import propertiesRouter from './routes/properties'
import agentsRouter from './routes/agents'
import favoritesRouter from './routes/favorites'
import leadsRouter from './routes/leads'

const app = express()

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/properties', propertiesRouter)
app.use('/api/agents', agentsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/leads', leadsRouter)

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

export default app
export const handler = serverless(app)
