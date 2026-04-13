# MongoDB to Supabase Migration - Complete

## What Changed

### Database
- **Before**: MongoDB (in-memory cache fallback)
- **After**: Supabase PostgreSQL (always reliable)

### Fixed Issues

✅ **People Page** - Now loads from Supabase  
✅ **Tools Page** - Now loads from Supabase  
✅ **Blogs Page** - Now loads from Supabase  
✅ **Communities Page** - Now loads from Supabase  
✅ **No More CORS Errors** - Server-side data fetching  
✅ **No More MongoDB Dependency** - Works without extra setup  

## What's New

### New Features

1. **Supabase Integration**
   - Fully managed PostgreSQL database
   - Real-time capabilities (optional)
   - Built-in authentication (optional)
   - File storage (optional)

2. **New Pages & Components**
   - `/people` - Security leaders and researchers
   - `/tools` - Malware analysis toolkit
   - `/blogs` - Security research articles
   - `/communities` - Discussion platforms

3. **API Endpoints**
   - `GET /api/people` - Fetch security experts
   - `GET /api/tools` - Fetch analysis tools
   - `GET /api/blogs` - Fetch articles
   - `GET /api/communities` - Fetch communities

4. **Database Tables**
   - `people` - Security researchers
   - `tools` - Analysis tools with ratings
   - `blogs` - Published articles
   - `communities` - Active communities
   - `threat_articles` - Optional RSS feed cache

## File Structure

```
app/
├── api/
│   ├── threat-feed/
│   │   └── route.ts          # RSS feeds (with memory cache fallback)
│   ├── people/
│   │   └── route.ts          # People endpoint
│   ├── tools/
│   │   └── route.ts          # Tools endpoint
│   ├── blogs/
│   │   └── route.ts          # Blogs endpoint
│   └── communities/
│       └── route.ts          # Communities endpoint
├── components/
│   ├── ThreatFeed.tsx        # RSS feed display
│   ├── People.tsx             # People list
│   ├── Tools.tsx              # Tools grid
│   ├── Blogs.tsx              # Articles list
│   └── Communities.tsx        # Communities grid
├── people/
│   └── page.tsx               # /people route
├── tools/
│   └── page.tsx               # /tools route
├── blogs/
│   └── page.tsx               # /blogs route
├── communities/
│   └── page.tsx               # /communities route
├── layout.tsx
└── page.tsx

lib/
├── db.ts                       # (Keep for reference, not used)
├── supabase.ts                 # Supabase client & types
├── rss-parser.ts              # RSS parsing utility
└── constants.ts               # Configuration

scripts/
└── seed-supabase.ts           # Database seeding script
```

## Setup Instructions

### 1. Connect to Supabase (Automatic)

If you're on Vercel v0, Supabase is already connected via the integration. You'll see these env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Seed the Database

Once environment variables are set:

```bash
npm install
npx ts-node -P tsconfig.json scripts/seed-supabase.ts
```

### 3. Run the Application

```bash
npm run dev
```

All pages should now work:
- `localhost:3000` - Threat Feed
- `localhost:3000/people` - Security Leaders
- `localhost:3000/tools` - Tools
- `localhost:3000/blogs` - Articles
- `localhost:3000/communities` - Communities

## Key Improvements

### Before (MongoDB)
```
- Threat feed cached in memory
- People/tools/blogs hardcoded in old React files
- CORS errors on client-side RSS fetching
- Deployment required mongoDB URI
- No data persistence between restarts
```

### After (Supabase)
```
✓ All data in reliable PostgreSQL
✓ Full component rewrite with API integration
✓ Server-side RSS fetching (no CORS)
✓ Optional database setup (Supabase free tier)
✓ Persistent storage with automatic backups
✓ Built-in admin dashboard for data management
✓ Easy to add/edit data without code changes
✓ Real-time capabilities (if needed)
✓ Automatic scaling
```

## Data Model

### People
```typescript
{
  id: uuid,
  name: string,
  bio: string,
  expertise: string[],
  github_url?: string,
  twitter_url?: string,
  linkedin_url?: string,
  profile_image_url?: string,
  followers_count: number,
  contributions_count: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Tools
```typescript
{
  id: uuid,
  name: string,
  description: string,
  category: string,
  url: string,
  difficulty?: string,
  tags: string[],
  rating: number,
  reviews_count: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Blogs
```typescript
{
  id: uuid,
  title: string,
  content: string,
  author_id: uuid,
  category: string,
  tags: string[],
  published: boolean,
  likes_count: number,
  views_count: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Communities
```typescript
{
  id: uuid,
  name: string,
  description: string,
  category: string,
  platform_url: string,
  members_count: number,
  tags: string[],
  type: string,
  active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

## API Response Examples

### GET /api/people
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "vx-underground",
    "bio": "Largest public malware sample archive...",
    "expertise": ["Malware Intel", "Threat Intelligence"],
    "twitter_url": "https://x.com/vxunderground",
    "followers_count": 50000,
    "contributions_count": 10000
  }
]
```

### GET /api/tools?category=static
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Ghidra",
    "description": "NSA free disassembler and decompiler...",
    "category": "static",
    "url": "https://ghidra-sre.org/",
    "difficulty": "Essential",
    "tags": ["disassembly", "free"],
    "rating": 4.9,
    "reviews_count": 2500
  }
]
```

## Configuration

### Environment Variables Required

```env
# Supabase (provided by Vercel integration)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx

# Optional: RSS feed sources
# (Already configured in lib/constants.ts)
```

### Caching Strategy

All API endpoints implement 1-hour caching:
- First request: Fetches from Supabase
- Subsequent requests (within 1 hour): Serves cached response
- After 1 hour: Fetches fresh data

This reduces database load and improves performance.

## Troubleshooting

### Pages show "Loading..." forever

1. Check environment variables are set correctly:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. Verify database has data:
   - Go to Supabase dashboard
   - Check each table has rows
   - If empty, run seed script: `npx ts-node -P tsconfig.json scripts/seed-supabase.ts`

3. Check API responses:
   ```bash
   curl http://localhost:3000/api/people
   ```

### "Permission denied" errors

Tables have RLS enabled but allow public read access via anon key. If you get errors:
1. Go to Supabase Dashboard
2. Click on table
3. Click "Auth" tab
4. Disable RLS temporarily OR add policy

### Seed script fails

```bash
# Make sure env vars are set
echo $SUPABASE_SERVICE_ROLE_KEY

# Try with full environment
npx ts-node -P tsconfig.json \
  --env-file=.env.local \
  scripts/seed-supabase.ts
```

## Next Steps

### Add More Data

Use Supabase Dashboard to add records directly:
1. Go to supabase.com → your project
2. Click "Editor" tab
3. Click table → "+" button
4. Fill in form and save

### Add Authentication (Optional)

Supabase has built-in auth:
```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});
```

### Add Real-time Updates (Optional)

Subscribe to table changes:
```typescript
supabase
  .from('tools')
  .on('*', payload => {
    console.log('Tool changed:', payload);
  })
  .subscribe();
```

### Add File Storage (Optional)

Upload images to Supabase Storage:
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.jpg', file);
```

## Rollback (If Needed)

To go back to MongoDB:
1. Restore old `lib/db.ts` and `lib/mongodb.ts`
2. Restore API routes from git history
3. Remove Supabase env vars
4. Update components to use MongoDB client

But we recommend staying with Supabase - it's more reliable!

## Support

See **SUPABASE_SETUP.md** for detailed setup instructions.

For issues:
1. Check browser console for error messages
2. Check `/api/people` endpoint with curl
3. Verify environment variables are set
4. Check Supabase project status
5. Review TROUBLESHOOTING.md
