# Quick Start Guide

## 60-Second Setup

### 1. Clone & Install (30 seconds)
```bash
git clone https://github.com/ashutpandey/Re101.git
cd Re101
npm install
```

### 2. Add MongoDB (20 seconds)
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create free account
- Create cluster
- Get connection string
- Create `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/re101?retryWrites=true&w=majority
```

### 3. Run (10 seconds)
```bash
npm run dev
# Open http://localhost:3000
```

---

## Most Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start           # Run production build

# Checking
npm run lint        # Check for errors
```

---

## Common Issues & Quick Fixes

### "Cannot find MONGODB_URI"
```bash
# Create .env.local file in project root
echo "MONGODB_URI=your_connection_string" > .env.local

# Restart dev server
npm run dev
```

### "Threat feeds not loading"
1. Check `.env.local` has `MONGODB_URI`
2. Verify MongoDB cluster is "Active"
3. Restart dev server: `npm run dev`
4. Click "Refresh" button

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## File Structure

```
app/
├── api/threat-feed/route.ts    ← API endpoint
├── components/ThreatFeed.tsx   ← Main component
└── page.tsx                     ← Homepage

lib/
├── db.ts                        ← MongoDB config
└── constants.ts                 ← Settings

.env.local                       ← ADD YOUR MONGODB URI HERE
package.json                     ← Dependencies
```

---

## Environment Variables

Only one required:

```env
# Add this to .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/re101?retryWrites=true&w=majority
```

---

## MongoDB Setup Steps

### Create Free Cluster (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up → Create account
3. Create Deployment → Select Free tier
4. Choose region closest to you
5. Wait for cluster initialization

### Get Connection String (1 minute)
1. Click "Connect" on cluster
2. Select "Drivers"
3. Choose Node.js
4. Copy connection string
5. Replace `<password>` with your database password

### Allow Your IP (1 minute)
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow from Anywhere" (development only!)
4. Confirm

### Create `.env.local` (30 seconds)
```bash
# In project root directory
echo "MONGODB_URI=YOUR_CONNECTION_STRING" > .env.local
```

---

## Verify Setup Works

### Test 1: Check Dependencies
```bash
npm list next mongodb
# Should show versions without errors
```

### Test 2: Check Environment
```bash
cat .env.local
# Should show your MONGODB_URI
```

### Test 3: Check API
```bash
# In another terminal while npm run dev is running
curl http://localhost:3000/api/threat-feed
# Should return JSON array of articles
```

### Test 4: Check Browser
- Open http://localhost:3000
- Click "Refresh"
- Should load threat feeds

---

## What Each Button Does

| Button | Action | Expected Result |
|--------|--------|-----------------|
| Search box | Filter articles | Shows matching articles |
| Week/Month | Change timeframe | Shows articles from that period |
| Refresh | Load latest feeds | Fetches from RSS sources |
| Σ / Y Rules | Find detection rules | Opens rule lookup modal |
| IOCs ↓ | Show indicators | Displays extracted IOCs |
| Source dots | Toggle feed | Filters by selected sources |

---

## Deploying to Vercel

### 1-Click Deploy
```bash
# Push code to GitHub
git add .
git commit -m "Ready for Vercel"
git push

# Then at vercel.com
# Import repo → Add MONGODB_URI → Deploy
```

---

## Most Asked Questions

**Q: Why is my threat feed empty?**
A: Check that MONGODB_URI is set in `.env.local`, restart the dev server, and click Refresh.

**Q: How do I change the refresh rate?**
A: Edit `lib/constants.ts` and change `CACHE_TTL` value (in milliseconds).

**Q: Can I add more RSS feeds?**
A: Yes! Edit the `FEEDS` array in `app/api/threat-feed/route.ts`.

**Q: How do I customize threat keywords?**
A: Edit `THREAT_KEYWORDS` in `app/components/ThreatFeed.tsx`.

**Q: Is my data secure?**
A: Yes, MongoDB URI stays on server. Use IP whitelist in production.

---

## Performance Tips

- **First load:** 1-2 seconds (fetches fresh feeds)
- **Cached load:** <500ms (serves from MongoDB)
- **Refresh:** Fetches latest from RSS sources

---

## Debugging

### See Detailed Logs
```bash
# Terminal where npm run dev is running shows all logs
# Check for:
# - MongoDB connection status
# - RSS feed fetch results
# - Error messages
```

### Check Database
1. MongoDB Atlas dashboard
2. Collections
3. threat_articles
4. Should see cached articles

### Browser Console
- F12 or Ctrl+Shift+I
- Check for JavaScript errors
- Check Network tab for API calls

---

## Need More Help?

- **Setup issues?** → Read `SETUP.md`
- **Something broken?** → Check `TROUBLESHOOTING.md`
- **Want to understand changes?** → Read `MIGRATION.md`
- **Full documentation?** → Read `README.md`

---

## TL;DR

```bash
# Install
npm install

# Setup MongoDB
# 1. Create account at mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Get connection string
# 4. Create .env.local with MONGODB_URI

# Run
npm run dev

# Open browser
# http://localhost:3000

# Click Refresh to load threat feeds
```

That's it! 🚀

---

**Last Updated:** January 2026
**Framework:** Next.js 15 + MongoDB
