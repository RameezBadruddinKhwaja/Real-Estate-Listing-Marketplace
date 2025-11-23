# Deployment Guide

## Prerequisites

1. **Accounts Required:**
   - Vercel account (for frontend + API)
   - Supabase account (for database)
   - Mapbox account (for maps)
   - Railway/Render account (for AI service)

2. **Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in all required values

## Step 1: Supabase Setup

1. Create a new Supabase project at https://supabase.com

2. Enable PostGIS extension:
   - Go to Database → Extensions
   - Search for "postgis"
   - Enable it

3. Run database schema:
   - Go to SQL Editor
   - Copy contents of `lib/supabase/schema.sql`
   - Execute the SQL

4. Get your credentials:
   - Go to Project Settings → API
   - Copy:
     - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
     - Anon/Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

5. Configure Storage:
   - Go to Storage
   - Create a bucket named `properties`
   - Set it to public
   - Configure RLS policies for secure uploads

## Step 2: Mapbox Setup

1. Create account at https://mapbox.com

2. Get access token:
   - Go to Account → Access Tokens
   - Copy your default public token (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`)

## Step 3: Deploy Frontend + API to Vercel

1. Push code to GitHub repository

2. Go to https://vercel.com and import your repository

3. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   AI_API_URL=https://your-ai-service.railway.app
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. Deploy!

## Step 4: Deploy AI Service to Railway/Render

### Railway:

1. Go to https://railway.app

2. Create new project → Deploy from GitHub

3. Select your repository

4. Configure:
   - Root Directory: `ai-service`
   - Build Command: (auto-detected from Dockerfile)
   - Start Command: (auto-detected)

5. Add environment variables (if needed):
   ```
   API_KEY=your_api_key
   ```

6. Railway will provide a URL - add this to Vercel as `AI_API_URL`

### Render:

1. Go to https://render.com

2. New → Web Service

3. Connect your repository

4. Configure:
   - Root Directory: `ai-service`
   - Environment: Docker
   - Instance Type: Free (or as needed)

5. Add environment variables

6. Deploy

## Step 5: Post-Deployment Setup

1. **Create Admin Account:**
   - Sign up via your deployed app
   - Go to Supabase → Authentication → Users
   - Find your user and update role to 'admin' in profiles table

2. **Create Sample Agent:**
   - Create another account
   - Update role to 'agent' in profiles table
   - Insert record in agents table with this user_id

3. **Add Sample Properties:**
   - Use the sample data generator or
   - Manually create properties via the agent dashboard

4. **Test Core Features:**
   - Property search
   - Map functionality
   - Contact forms
   - Admin panel
   - Agent dashboard

## Step 6: Configure Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Step 7: Performance Optimization

1. **Enable Caching:**
   - Vercel automatically handles Next.js caching
   - Configure cache headers in `next.config.js` if needed

2. **Database Optimization:**
   - Supabase has automatic connection pooling
   - Monitor slow queries in Supabase dashboard
   - Add additional indexes if needed

3. **Image Optimization:**
   - Next.js Image component is already configured
   - Images from Supabase Storage are automatically optimized

## Monitoring & Maintenance

1. **Vercel Analytics:**
   - Enable in Project Settings
   - Monitor page views and performance

2. **Supabase Monitoring:**
   - Check database size
   - Monitor API usage
   - Review logs for errors

3. **Error Tracking:**
   - Consider adding Sentry or similar
   - Monitor Vercel Function logs

## Backup Strategy

1. **Database Backups:**
   - Supabase Pro includes daily backups
   - Free tier: Export via SQL Editor periodically

2. **Code Backups:**
   - Already in GitHub
   - Consider branch protection rules

## Scaling Considerations

1. **Database:**
   - Free tier: Good for MVP
   - Upgrade Supabase plan as needed
   - Consider read replicas for high traffic

2. **API:**
   - Vercel scales automatically
   - Monitor function execution time
   - Optimize queries if needed

3. **AI Service:**
   - Start with free tier
   - Scale up Railway/Render instance as needed
   - Consider caching AI responses

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] Service role key is only in server environment
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] HTTPS is enforced

## Troubleshooting

### Build Fails:
- Check Node.js version (18+)
- Clear cache and rebuild
- Check for TypeScript errors

### Database Connection Issues:
- Verify environment variables
- Check Supabase project status
- Review RLS policies

### Map Not Loading:
- Verify Mapbox token
- Check browser console for errors
- Ensure HTTPS is enabled

### AI Service Not Responding:
- Check Railway/Render deployment status
- Verify AI_API_URL is correct
- Check AI service logs

## Support

For issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review Railway/Render logs
4. Open GitHub issue if needed
