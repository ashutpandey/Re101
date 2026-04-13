# Supabase Quick Reference

## Env Vars (Already Set in Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

## One-Command Setup

```bash
npm install && npx ts-node -P tsconfig.json scripts/seed-supabase.ts && npm run dev
```

## API Endpoints

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/threat-feed` | GET | Threat articles from RSS feeds |
| `/api/people` | GET | Security researchers & leaders |
| `/api/tools?category=all` | GET | Analysis tools (filter: static/dynamic/intel/detection/practice) |
| `/api/blogs?category=all` | GET | Security research articles |
| `/api/communities` | GET | Discussion communities & forums |

## Pages

| URL | Component | Data Source |
|-----|-----------|------------|
| `/` | ThreatFeed.tsx | RSS feeds |
| `/people` | People.tsx | Supabase `people` table |
| `/tools` | Tools.tsx | Supabase `tools` table |
| `/blogs` | Blogs.tsx | Supabase `blogs` table |
| `/communities` | Communities.tsx | Supabase `communities` table |

## Database Tables

```
people
  ├─ id (uuid)
  ├─ name, bio, expertise[]
  ├─ github_url, twitter_url, linkedin_url
  ├─ followers_count, contributions_count
  └─ created_at, updated_at

tools
  ├─ id (uuid)
  ├─ name, description, category
  ├─ url, difficulty, tags[]
  ├─ rating, reviews_count
  └─ created_at, updated_at

blogs
  ├─ id (uuid)
  ├─ title, content, author_id
  ├─ category, tags[], published
  ├─ likes_count, views_count
  └─ created_at, updated_at

communities
  ├─ id (uuid)
  ├─ name, description, category
  ├─ platform_url, members_count
  ├─ tags[], type, active
  └─ created_at, updated_at
```

## Seed Database

```bash
npx ts-node -P tsconfig.json scripts/seed-supabase.ts
```

Output should show:
```
✓ Inserted vx-underground
✓ Inserted Kevin Beaumont
...
✓ Inserted tool: Ghidra
✓ Inserted tool: IDA Free
...
✓ Inserted blog: Introduction to Reverse Engineering Malware
...
✓ Inserted community: RE101 Discord Community
...
✅ Database seeded successfully!
```

## Check Data

### Via API (in browser or curl)
```bash
# Get people
curl http://localhost:3000/api/people

# Get tools
curl http://localhost:3000/api/tools

# Get blogs
curl http://localhost:3000/api/blogs

# Get communities
curl http://localhost:3000/api/communities

# Get threat feed
curl http://localhost:3000/api/threat-feed
```

### Via Supabase Dashboard
1. Go to supabase.com → your project
2. Click "Editor" on left sidebar
3. Select table → view data

## Troubleshooting

**Problem**: Pages show "Loading..." forever  
**Solution**: 
```bash
# Check if data exists
curl http://localhost:3000/api/people

# If empty, seed the database
npx ts-node -P tsconfig.json scripts/seed-supabase.ts
```

**Problem**: "Permission denied" error  
**Solution**: Check Supabase dashboard, tables should have RLS enabled but accessible via anon key.

**Problem**: Env vars not working  
**Solution**:
```bash
# Check if env vars are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Restart dev server
npm run dev
```

## Add Custom Data

### Via Dashboard
1. Go to Supabase → your project → Editor
2. Click table → "+" button
3. Fill form → Save

### Via SQL
```sql
-- Add a person
INSERT INTO people (name, bio, expertise, twitter_url, followers_count)
VALUES ('Name', 'Bio', ARRAY['tag1', 'tag2'], 'https://x.com/...', 1000);

-- Add a tool
INSERT INTO tools (name, description, category, url, difficulty, tags, rating)
VALUES ('Tool', 'Desc', 'static', 'https://...', 'Essential', ARRAY['tag'], 4.5);

-- Add a blog
INSERT INTO blogs (title, content, category, tags, published, author_id)
VALUES ('Title', 'Content...', 'Category', ARRAY['tag'], true, NULL);

-- Add a community
INSERT INTO communities (name, description, category, platform_url, type, members_count, active)
VALUES ('Name', 'Desc', 'Cat', 'https://...', 'discord', 5000, true);
```

## Environment Variables (if not using Vercel integration)

For local development, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxx
```

Get these from Supabase Dashboard → Settings → API

## Deployment

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Env vars are auto-set via integration
4. Deploy!

### Other Platforms
1. Set env vars in platform settings
2. Deploy normally
3. Run seed script after deployment (optional)

## Files Changed

**New Files:**
- `lib/supabase.ts` - Supabase client
- `app/api/people/route.ts` - People endpoint
- `app/api/tools/route.ts` - Tools endpoint
- `app/api/blogs/route.ts` - Blogs endpoint
- `app/api/communities/route.ts` - Communities endpoint
- `app/components/People.tsx` - People component
- `app/components/Tools.tsx` - Tools component
- `app/components/Blogs.tsx` - Blogs component
- `app/components/Communities.tsx` - Communities component
- `app/people/page.tsx` - /people page
- `app/tools/page.tsx` - /tools page
- `app/blogs/page.tsx` - /blogs page
- `app/communities/page.tsx` - /communities page
- `scripts/seed-supabase.ts` - Seeding script

**Modified Files:**
- `package.json` - Added @supabase/supabase-js
- `app/api/threat-feed/route.ts` - Memory cache fallback

**Still Available (Not Used):**
- `lib/db.ts` - MongoDB client (kept for reference)
- `app/components/ThreatFeed.tsx` - Still works for RSS feeds

## Caching

All endpoints cache responses for 1 hour using Next.js `revalidate`:
```typescript
export const revalidate = 3600; // 1 hour in seconds
```

First request fetches from Supabase. Subsequent requests serve cached data.

## Next Steps

1. ✅ Seed database: `npx ts-node -P tsconfig.json scripts/seed-supabase.ts`
2. ✅ Run app: `npm run dev`
3. ✅ Check pages load: `/people`, `/tools`, `/blogs`, `/communities`
4. ✅ Add more data via Supabase dashboard
5. ✅ Deploy to Vercel

## Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Project Repo](SUPABASE_SETUP.md)
- [Troubleshooting](TROUBLESHOOTING.md)
