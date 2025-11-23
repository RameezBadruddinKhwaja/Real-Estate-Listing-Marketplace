# Prime Properties - Real Estate Marketplace

A modern, production-ready real estate marketplace built with Next.js, featuring AI-powered property descriptions, geospatial search, and comprehensive agent dashboards.

## Features

### Core Features
- **Map-First Search**: Interactive Mapbox integration with property clustering and bounding box search
- **AI-Powered**:
  - Auto-generate property descriptions
  - Price estimation based on location and features
  - Natural language search chatbot
- **Advanced Filtering**: Price, area, beds, baths, property type, location
- **Agent Dashboard**: Property management, lead tracking, messaging
- **Admin Panel**: Property approvals, featured listings management
- **Favorites**: Save and track favorite properties
- **Lead Management**: Contact forms, messaging between buyers and agents
- **Image Optimization**: Supabase Storage with Next.js Image optimization

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Map GL (Mapbox)

**Backend:**
- Express.js (Serverless on Vercel)
- Supabase (PostgreSQL with PostGIS, Auth, Storage, RLS)
- FastAPI (AI Microservice)

**Database:**
- PostgreSQL with PostGIS extension
- Geospatial indexing for location-based queries
- Row Level Security (RLS) for data protection

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+ (for AI service)
- Supabase account
- Mapbox account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd Real-Estate-Listing-Marketplace
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your keys:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `AI_API_URL`

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `lib/supabase/schema.sql`
   - Enable PostGIS extension in Supabase dashboard

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. (Optional) Start the AI service:
\`\`\`bash
cd ai-service
pip install -r requirements.txt
python main.py
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── property/          # Property detail pages
│   ├── agent/             # Agent profile pages
│   ├── dashboard/         # Agent & admin dashboards
│   ├── favorites/         # Saved properties
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── property/         # Property-related components
│   ├── agent/            # Agent components
│   ├── map/              # Map components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
│   ├── api/              # API client functions
│   ├── supabase/         # Supabase client & schema
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
├── api/                   # Express.js API routes
│   └── routes/           # API route handlers
└── ai-service/           # FastAPI AI microservice
    ├── main.py           # FastAPI app
    ├── requirements.txt  # Python dependencies
    └── Dockerfile        # Docker configuration
\`\`\`

## Database Schema

### Main Tables
- `profiles` - User profiles
- `agents` - Agent information
- `properties` - Property listings with geospatial data
- `property_images` - Property images
- `locations` - Location data
- `favorites` - User favorites
- `leads` - Contact leads
- `messages` - Messaging between users

### Key Features
- PostGIS for geospatial queries
- Spatial indexing on coordinates
- Row Level Security (RLS) for data protection
- Automatic triggers for updated_at timestamps
- Functions for view counting and property searches

## API Endpoints

### Properties
- `GET /api/properties` - List properties with filters
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Agents
- `GET /api/agents` - List agents
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Create agent profile
- `PUT /api/agents/:id` - Update agent profile

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Leads
- `GET /api/leads` - Get leads for agent
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead status

### AI Service
- `POST /generate-description` - Generate property description
- `POST /estimate-price` - Estimate property price
- `POST /search-chatbot` - Parse natural language query

## Deployment

### Vercel (Frontend + API)
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy

### Railway/Render (AI Service)
1. Connect your GitHub repository
2. Set root directory to `ai-service`
3. Add environment variables
4. Deploy

## Security Features

- Row Level Security (RLS) on all tables
- API rate limiting
- Input validation with Zod
- CSRF protection
- Secure authentication with Supabase Auth
- Image upload validation
- SQL injection prevention

## Performance Optimizations

- Next.js Image optimization
- Geospatial indexing for fast map searches
- Property clustering on map
- Database query optimization
- API response caching
- Lazy loading of images
- Code splitting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@primeproperties.com or create an issue in the repository.
