# Supabase Integration Guide

## Overview

RE101 now uses **Supabase PostgreSQL** as the primary database for:
- **People** - Security leaders and researchers
- **Tools** - Malware analysis toolkit
- **Blogs** - Security research articles
- **Communities** - Forums and discussion platforms
- **Threat Articles** - Optional caching for RSS feeds

## Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name (e.g., "re101")
4. Set a strong database password
5. Select a region closest to you
6. Click "Create new project" and wait 2-3 minutes

### 2. Get Your Credentials

In your Supabase project dashboard:
1. Go to **Settings** → **API**
2. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role Secret Key

### 3. Update Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
```

### 4. Seed the Database

Run the seeding script to populate sample data:

```bash
# Install dependencies
npm install

# Run the seed script
npx ts-node -P tsconfig.json scripts/seed-supabase.ts
```

Expected output:
```
🌱 Seeding Supabase database...

Seeding people...
✓ Inserted vx-underground
✓ Inserted Kevin Beaumont
...

Seeding tools...
✓ Inserted tool: Ghidra
✓ Inserted tool: IDA Free
...

✅ Database seeded successfully!
```

### 5. Run the Application

```bash
npm run dev
```

Visit:
- [localhost:3000](http://localhost:3000) - Threat Feed
- [localhost:3000/people](http://localhost:3000/people) - Security Leaders
- [localhost:3000/tools](http://localhost:3000/tools) - Analysis Tools
- [localhost:3000/blogs](http://localhost:3000/blogs) - Research Articles
- [localhost:3000/communities](http://localhost:3000/communities) - Communities

## Database Schema

### People Table

```sql
create table public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  expertise text[] default '{}',
  github_url text,
  twitter_url text,
  linkedin_url text,
  profile_image_url text,
  followers_count integer default 0,
  contributions_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Tools Table

```sql
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  url text,
  difficulty text,
  tags text[] default '{}',
  rating numeric default 0,
  reviews_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Blogs Table

```sql
create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  author_id uuid,
  category text,
  tags text[] default '{}',
  published boolean default false,
  likes_count integer default 0,
  views_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Communities Table

```sql
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  platform_url text,
  members_count integer default 0,
  tags text[] default '{}',
  type text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## API Endpoints

All endpoints return cached data (1-hour TTL):

### GET `/api/people`
Fetches all people ordered by followers count.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "bio": "Security researcher...",
    "expertise": ["Malware", "RE"],
    "followers_count": 5000,
    "contributions_count": 100,
    ...
  }
]
```

### GET `/api/tools?category=static`
Fetches tools, optionally filtered by category.

**Query Parameters:**
- `category` - Filter by category (static, dynamic, intel, detection, practice)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Ghidra",
    "description": "NSA disassembler...",
    "category": "static",
    "rating": 4.9,
    ...
  }
]
```

### GET `/api/blogs?category=malware`
Fetches published blogs, optionally filtered by category.

**Query Parameters:**
- `category` - Filter by category

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Malware Analysis Guide",
    "content": "...",
    "category": "Malware",
    "views_count": 5000,
    ...
  }
]
```

### GET `/api/communities`
Fetches active communities.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "RE101 Discord",
    "type": "discord",
    "members_count": 5000,
    ...
  }
]
```

## Adding Your Own Data

### Add a Person

```bash
# Via Supabase Dashboard
1. Go to SQL Editor
2. Run:

insert into people (name, bio, expertise, twitter_url, followers_count)
values (
  'Your Name',
  'Your bio',
  ARRAY['Expertise1', 'Expertise2'],
  'https://twitter.com/...',
  1000
);
```

### Add a Tool

```bash
# Via Supabase Dashboard or API

insert into tools (name, description, category, url, difficulty, tags, rating)
values (
  'Tool Name',
  'Description',
  'static',
  'https://...',
  'Essential',
  ARRAY['tag1', 'tag2'],
  4.5
);
```

## Troubleshooting

### "Cannot connect to Supabase"

1. Check `.env.local` has the correct credentials
2. Verify Supabase project is active
3. Check your firewall allows connections to Supabase
4. Verify the `NEXT_PUBLIC_SUPABASE_URL` format is correct

### "No data showing"

1. Check if database is seeded: `npm run seed`
2. Verify tables exist in Supabase dashboard
3. Check API endpoints in browser: `http://localhost:3000/api/people`
4. Look at Network tab in browser DevTools for errors

### "RLS Policy Error"

Row-level security (RLS) is enabled but without policies, the app still works for anon access.
If you get RLS errors:
1. Go to Supabase Dashboard → SQL Editor
2. For each table, disable RLS temporarily or add an allow-all policy:

```sql
create policy "allow_read" on people
  for select
  using (true);
```

### "Seed script fails"

1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
2. Check Node.js version: `node --version` (need v18+)
3. Install dependencies: `npm install`
4. Check Supabase network status

## Performance Tips

- **Caching**: All API endpoints cache for 1 hour using Next.js `revalidate`
- **Pagination**: For large datasets, add limit/offset to API routes
- **Indexing**: Supabase automatically indexes primary keys; add more for frequently filtered columns
- **Images**: Use Supabase Storage for profile images and tool screenshots

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

The Supabase integration is built-in, no additional configuration needed.

## Migration from MongoDB

If you had MongoDB data, here's how to migrate:

```javascript
// 1. Export MongoDB data as JSON
// 2. Transform to Supabase format
// 3. Insert via Supabase API or dashboard

const tools = mongoTools.map(t => ({
  name: t.name,
  description: t.description,
  category: t.category,
  url: t.url,
  tags: t.tags || [],
  rating: t.rating || 0,
}));

// Insert into Supabase
await supabase.from('tools').insert(tools);
```

## Support

For issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. See TROUBLESHOOTING.md for app-specific issues
3. Check browser console for API errors
4. Review Supabase logs in your project dashboard
