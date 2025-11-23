-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'agent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  agency TEXT,
  license_number TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_properties INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'Pakistan',
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table with geospatial support
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  area DECIMAL(10,2) NOT NULL,
  area_unit TEXT DEFAULT 'sqft' CHECK (area_unit IN ('sqft', 'sqm', 'marla', 'kanal')),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'villa', 'townhouse', 'plot', 'commercial', 'farmhouse', 'penthouse')),
  listing_type TEXT DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold', 'rented')),
  featured BOOLEAN DEFAULT FALSE,

  -- Location and coordinates
  location_id UUID REFERENCES public.locations(id),
  address TEXT,
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,

  -- Agent relationship
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,

  -- Metadata
  amenities TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for geospatial queries
CREATE INDEX IF NOT EXISTS properties_coordinates_idx ON public.properties USING GIST (coordinates);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties(status);
CREATE INDEX IF NOT EXISTS properties_property_type_idx ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS properties_listing_type_idx ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties(price);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS properties_agent_id_idx ON public.properties(agent_id);

-- Property images table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_images_property_id_idx ON public.property_images(property_id);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_property_id_idx ON public.favorites(property_id);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_agent_id_idx ON public.leads(agent_id);
CREATE INDEX IF NOT EXISTS leads_property_id_idx ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_lead_id_idx ON public.messages(lead_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON public.messages(receiver_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Agents are viewable by everyone" ON public.agents
  FOR SELECT USING (true);

CREATE POLICY "Agents can update own profile" ON public.agents
  FOR UPDATE USING (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Approved properties are viewable by everyone" ON public.properties
  FOR SELECT USING (status = 'approved' OR auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

CREATE POLICY "Agents can insert own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

CREATE POLICY "Agents can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

CREATE POLICY "Agents can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

-- Property images policies
CREATE POLICY "Property images are viewable by everyone" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "Agents can manage own property images" ON public.property_images
  FOR ALL USING (
    property_id IN (
      SELECT p.id FROM public.properties p
      JOIN public.agents a ON p.agent_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Agents can view own leads" ON public.leads
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.agents WHERE id = agent_id)
    OR auth.uid() = user_id
  );

CREATE POLICY "Anyone can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own received messages" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET views = views + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update agent's total properties count
CREATE OR REPLACE FUNCTION update_agent_property_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agents
    SET total_properties = total_properties + 1
    WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agents
    SET total_properties = GREATEST(0, total_properties - 1)
    WHERE id = OLD.agent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_property_count_trigger
AFTER INSERT OR DELETE ON public.properties
FOR EACH ROW EXECUTE FUNCTION update_agent_property_count();

-- Function for geospatial search within bounding box
CREATE OR REPLACE FUNCTION search_properties_in_bounds(
  min_lat DECIMAL,
  min_lng DECIMAL,
  max_lat DECIMAL,
  max_lng DECIMAL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.price,
    ST_Y(p.coordinates::geometry) as latitude,
    ST_X(p.coordinates::geometry) as longitude
  FROM public.properties p
  WHERE p.status = 'approved'
    AND ST_Within(
      p.coordinates::geometry,
      ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    );
END;
$$ LANGUAGE plpgsql;
