-- Sample data for testing
-- Run this after schema.sql

-- Insert sample locations
INSERT INTO public.locations (name, city, state, country) VALUES
('DHA Phase 5', 'Karachi', 'Sindh', 'Pakistan'),
('Bahria Town', 'Lahore', 'Punjab', 'Pakistan'),
('F-7 Markaz', 'Islamabad', 'ICT', 'Pakistan'),
('Gulberg', 'Lahore', 'Punjab', 'Pakistan'),
('Clifton Block 2', 'Karachi', 'Sindh', 'Pakistan');

-- Note: You'll need to create actual user accounts via Supabase Auth first
-- Then use those user IDs to create agents and properties

-- Example agent insert (replace user_id with actual UUID from auth.users)
-- INSERT INTO public.agents (user_id, name, email, phone, bio, agency, verified) VALUES
-- ('uuid-here', 'Ahmed Khan', 'ahmed@realestate.com', '+92 300 1234567', 'Experienced real estate agent with 10+ years in the industry', 'Prime Realty', true);

-- Example property insert (replace agent_id and location_id with actual UUIDs)
-- INSERT INTO public.properties (
--   title,
--   description,
--   price,
--   area,
--   area_unit,
--   bedrooms,
--   bathrooms,
--   property_type,
--   listing_type,
--   status,
--   featured,
--   location_id,
--   address,
--   coordinates,
--   agent_id,
--   amenities
-- ) VALUES (
--   'Luxury Villa in DHA Phase 5',
--   'Beautiful 5 bedroom villa with modern amenities and spacious garden.',
--   150000000,
--   5000,
--   'sqft',
--   5,
--   6,
--   'villa',
--   'sale',
--   'approved',
--   true,
--   'location-uuid',
--   'Street 12, DHA Phase 5',
--   ST_SetSRID(ST_MakePoint(67.0011, 24.8607), 4326),
--   'agent-uuid',
--   ARRAY['Swimming Pool', 'Garden', 'Parking', 'Security', 'Gym']
-- );
