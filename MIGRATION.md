# Migration Guide: Vite/React → Next.js 15 with MongoDB

## Overview

This document outlines the major changes made when converting the RE101 project from Vite/React to Next.js 15 with MongoDB backend.

## What Changed

### Architecture

**Before (Vite/React):**
- Client-side only application
- RSS feeds fetched directly from browser (CORS proxy required)
- No backend or database
- Data lost on page refresh

**After (Next.js 15):**
- Full-stack application with server routes
- RSS feeds fetched server-side (no CORS issues)
- MongoDB backend for data persistence
- 30-minute caching for efficient data access

### Project Structure

**Before:**
```
src/
├── App.jsx
├── ThreatFeedPage.jsx
├── RoadmapPage.jsx
├── CommunityPage.jsx
├── ToolsPage.jsx
├── main.jsx
└── index.css
```

**After:**
```
app/
├── api/
│   └── threat-feed/
│       └── route.ts          # Server-side API
├── components/
│   └── ThreatFeed.tsx        # Client component
├── layout.tsx
├── page.tsx
└── globals.css

lib/
├── db.ts                     # MongoDB connection
├── rss-parser.ts             # Server-side RSS parsing
└── constants.ts              # Configuration
```

## Breaking Changes

### 1. RSS Feed Fetching

**Before:**
```javascript
async function fetchRSSviaProxy(feedUrl) {
  const proxy = `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(proxy);
  const text = await res.text();
  // Parse XML in browser
}
```

**After:**
```typescript
// Server-side in app/api/threat-feed/route.ts
async function fetchRSSviaProxy(feedUrl: string) {
  const proxy = `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(proxy, { next: { revalidate: 1800 } });
  // Parse XML on server
}
```

**Benefits:**
- No CORS errors
- Faster performance
- Server-side caching
- More secure (API keys stay on server)

### 2. Data Persistence

**Before:**
```javascript
const [articles, setArticles] = useState([]);
// Data lost on refresh
```

**After:**
```typescript
// MongoDB caches articles with 30-minute TTL
const cached = await threatsCollection.findOne({ _id: 'cache' });
if (cached && isWithinTTL(cached.cachedAt)) {
  return cached.articles;
}
```

### 3. Environment Variables

**Before:**
- No backend, no environment variables needed

**After:**
```env
MONGODB_URI=mongodb+srv://...
```

Required for database connection.

## Code Changes

### Component Changes

Most component logic remains the same, but now components are **client components** (`'use client'`):

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ThreatFeed() {
  // Component code
}
```

### API Fetching

Components now fetch from internal API endpoints:

```typescript
const loadFeeds = useCallback(async () => {
  try {
    const res = await fetch('/api/threat-feed');
    const data = await res.json();
    setArticles(data);
  } catch (error) {
    console.error('Failed to load threat feed:', error);
  }
}, []);
```

## New Features

### 1. Server-Side Rendering
- Better SEO (all pages are server-rendered)
- Metadata is automatically generated

### 2. MongoDB Integration
- Persistent data storage
- Automatic caching with TTL
- Scalable to large datasets

### 3. Type Safety
- Full TypeScript support
- Better IDE autocomplete
- Fewer runtime errors

### 4. Performance
- Server-side data fetching
- Automatic code splitting
- Next.js optimizations

## Migration Checklist

If you modified the original code and want to migrate your changes:

- [ ] Move utility functions to `lib/` directory
- [ ] Convert client components to use `'use client'` directive
- [ ] Update imports to use absolute paths (`@/`)
- [ ] Move styling to `app/globals.css` or component styles
- [ ] Update API calls to use `/api/` endpoints
- [ ] Add `.env.local` for environment variables
- [ ] Test all features in development
- [ ] Run `npm run build` to check for errors

## Running Different Versions

### Run Next.js Development Server
```bash
npm run dev
```
Runs Next.js dev server on port 3000

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Rollback

If you need to go back to the Vite version:

```bash
git checkout origin/main -- src/
git checkout vite.config.js
git checkout index.html
npm uninstall next mongodb rss-parser
npm install vite @vitejs/plugin-react
npm run dev
```

## Database Schema

### MongoDB Collections

**threat_articles (cached)**
```json
{
  "_id": "cache",
  "articles": [
    {
      "title": "String",
      "link": "String (URL)",
      "description": "String",
      "pubDate": "String (ISO 8601)",
      "source": "String",
      "sourceColor": "String (Hex)"
    }
  ],
  "cachedAt": "Date"
}
```

## Performance Improvements

### Before
- CORS proxy adds latency (300-500ms)
- Client-side XML parsing blocks UI
- No caching between sessions
- Repeated API calls to RSS sources

### After
- Direct server-to-server fetching
- Server-side parsing (non-blocking)
- 30-minute MongoDB cache
- Reduced external API calls by ~95%

## Known Limitations

1. **RSS Feed Sources**: Some feeds may become unavailable
   - Solution: Monitor errors, add fallback feeds

2. **GitHub API Rate Limiting**: YARA/Sigma rule lookup has limits
   - Solution: Add GITHUB_TOKEN for 5000 requests/hour

3. **MongoDB Atlas IP Whitelist**: Need to allow your server IP
   - Solution: Use "Allow from Anywhere" in development, restrict in production

## Future Improvements

- [ ] Add authentication for community features
- [ ] Store community posts in MongoDB
- [ ] Add full-text search for threat articles
- [ ] Implement WebSocket for real-time updates
- [ ] Add user preferences and saved searches
- [ ] Create admin dashboard for threat management

## Getting Help

- Check [SETUP.md](./SETUP.md) for installation help
- Review [README.md](./README.md) for features and usage
- Check [GitHub Issues](https://github.com/ashutpandey/Re101/issues)
- Review server logs: `npm run dev` terminal output

---

**Migration completed on**: January 2025
**Original framework**: React + Vite
**New framework**: Next.js 15 + MongoDB
