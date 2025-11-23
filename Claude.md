# Real Estate Listing Marketplace

## Overview

Modern production-ready property listing marketplace with map search, agent dashboards, messaging, and AI-generated property descriptions + price estimates.

## Stack

* Next.js (App Router) + TypeScript
* Shadcn UI + Tailwind CSS
* Express.js (Vercel-compatible serverless)
* Supabase (Auth, Postgres, Storage, RLS)
* Mapbox or Leaflet for maps
* Python FastAPI for AI price prediction & description generation

## Theme & UI

* Large hero search bar
* Map-first UI with property pins
* Elegant listing cards with image gallery
* Light and clean real-estate professional theme

## Core Features

* Property listings with gallery
* Map search (lat/lng bounding box)
* Agent profiles and dashboards
* Favorites / saved listings
* Lead capture + messaging
* Admin: property approvals, featured listings
* AI: auto-generate descriptions, estimate price, chatbot for search

## Pages / Routes

* `/` — Search + Listings
* `/property/[id]` — Property detail
* `/agent/[id]` — Agent profile
* `/favorites` — Saved properties
* `/dashboard/agent` — Agent tools
* `/admin` — Admin panel

## Database Schema (Supabase)

* `properties`
* `property_images`
* `agents`
* `favorites`
* `messages`
* `leads`
* `categories`
* `locations`

## Backend Structure (Vercel Compatible)

```
/api
  index.ts
  properties.ts
  agents.ts
  favorites.ts
  leads.ts
  ai.ts
```

### Express Example

```
import express from 'express'
import serverless from 'serverless-http'

const app = express()
app.use(express.json())

app.get('/properties', async (req, res) => {})

export const handler = serverless(app)
```

## Map Integration

* Mapbox SDK (recommended)
* Polygon + radius-based search
* Clustering support

## AI Integration

### Python FastAPI

* `/generate-description` → property description
* `/estimate-price` → price prediction based on area, location, beds, etc.
* `/search-chatbot` → "Find me a 3 bed under 20M in DHA"

## Deployment

* Next.js → Vercel
* Express → Vercel Serverless
* AI microservice → Render/Railway
* Supabase → DB, auth, storage

## Environment Variables

* SUPABASE_URL
* SUPABASE_SERVICE_ROLE
* SUPABASE_ANON_KEY
* MAPBOX_KEY
* AI_API_URL
* AI_API_KEY

## Claude Tasks

* Generate sample property dataset + images
* Scaffold listing cards + map search components
* Build filters (price, area, beds, location)
* Create AI prompts for description + price estimation

## Production Checklist

* Geospatial indexing (PostGIS in Supabase)
* Optimize images (Supabase storage + Next.js Image)
* Lead notifications via email/SMS
* RLS for agent property ownership

---

Real-estate marketplace file ready. Agla **Job Portal** banaun?
