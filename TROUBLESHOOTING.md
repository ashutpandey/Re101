# Troubleshooting Guide

## Threat Feed Issues

### Issue 1: "Threat feeds not loading / Loading Intel Feeds... indefinitely"

**Symptoms:**
- Page shows "⟳ Loading Intel Feeds..." and never loads
- Console shows no errors
- Refresh button has no effect

**Solutions:**

1. **Check MongoDB Connection:**
   ```bash
   # Check that .env.local exists
   cat .env.local
   
   # Should show:
   # MONGODB_URI=mongodb+srv://...
   ```

2. **Verify MongoDB URI is correct:**
   - Go to MongoDB Atlas
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Make sure password is correct (no special characters issue)

3. **Check MongoDB cluster is active:**
   - Go to MongoDB Atlas dashboard
   - Verify cluster status shows "Active"
   - If paused, resume it

4. **Check IP whitelist:**
   - Go to MongoDB Atlas → "Network Access"
   - Your IP should be whitelisted
   - For development, use "Allow from Anywhere" (0.0.0.0/0)

5. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Issue 2: "Cannot find module 'mongodb'"

**Symptoms:**
```
Error: Cannot find module 'mongodb'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 3: API endpoint returns error

**Check API endpoint manually:**
```bash
# In another terminal, run:
curl http://localhost:3000/api/threat-feed

# Should return a JSON array, not an error
```

**If you get an error, check:**
1. MongoDB URI in `.env.local`
2. MongoDB cluster is active
3. IP whitelist allows your connection
4. Database user has correct password

### Issue 4: "MONGODB_URI is not defined"

**Symptoms:**
```
Error: MONGODB_URI is not defined
```

**Solutions:**

1. **Create `.env.local` file:**
   - Create file at project root: `.env.local`
   - Add: `MONGODB_URI=mongodb+srv://...`
   - Restart dev server

2. **Verify file is in correct location:**
   ```bash
   # Should exist at project root
   ls -la .env.local
   
   # Not in src/ or app/ directories
   ```

3. **Check for typos:**
   - Variable must be exactly: `MONGODB_URI`
   - Not `MONGODB_URL` or `MONGO_URI`

### Issue 5: "Connection refused" error

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**This means:**
- You're trying to use local MongoDB but it's not running

**Solutions:**

**If using local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux (Ubuntu)
sudo systemctl start mongod

# Windows
# Start MongoDB from Services or run mongod.exe

# Then check it's running
mongosh
```

**If using MongoDB Atlas (Recommended):**
- Use the connection string from Atlas
- Make sure it starts with `mongodb+srv://`
- Check your .env.local has the Atlas URI, not local

### Issue 6: RSS feeds return empty results

**Symptoms:**
- App loads but shows "No articles found"
- Number of articles is always 0

**Possible causes:**

1. **RSS sources are temporarily down:**
   - Wait a few minutes
   - Try clicking "Refresh"
   - Check if feeds are accessible in browser

2. **CORS proxy is failing:**
   ```bash
   # Test directly
   curl "https://corsproxy.io/?url=https://www.bleepingcomputer.com/feed/"
   ```

3. **MongoDB caching might be serving empty results:**
   - Delete the cache in MongoDB:
     - Go to MongoDB Atlas → Browse Collections
     - Find `threat_articles` collection
     - Delete the document with `_id: "cache"`
   - Restart dev server
   - Click Refresh

### Issue 7: Some feeds load, some don't

**Symptoms:**
- 5-10 feeds load successfully
- 5-10 feeds show 0 articles
- Different feeds fail on different refreshes

**Causes:**
- Some RSS feeds are unreliable
- Rate limiting on corsproxy
- Temporary network issues

**Solution:**
- This is normal for RSS feeds
- Click "Refresh" again
- Different feeds will succeed on retry
- The working feeds provide valuable intel

### Issue 8: Rules lookup (Σ / Y Rules) not working

**Symptoms:**
- Click "Σ / Y Rules" button → Modal opens but shows "No rules found"
- Or modal doesn't open at all

**Causes:**
1. **GitHub API rate limit:**
   - 60 requests/hour without authentication
   - 5000 requests/hour with token

2. **No matching keywords:**
   - Article doesn't have enough threat keywords
   - Try articles with "CVE", "exploit", "ransomware" in title

**Solutions:**

1. **Add GitHub token (optional but recommended):**
   ```bash
   # Generate token at https://github.com/settings/tokens
   # Create new token with 'public_repo' scope only
   
   # Add to .env.local
   echo "GITHUB_TOKEN=your_token_here" >> .env.local
   
   # Restart dev server
   npm run dev
   ```

2. **Wait for rate limit reset:**
   - 60-request limit resets every hour
   - Use different articles to test

## Performance Issues

### Issue 9: App is running slowly

**Check:**
1. MongoDB query time (check Atlas dashboard)
2. Browser DevTools (F12) → Network tab
3. Large number of articles being rendered

**Solutions:**
```bash
# Build for production testing
npm run build
npm start

# Should be much faster than development
```

## Development Issues

### Issue 10: Changes not reflecting

**Symptoms:**
- Edit code but changes don't appear
- Browser still shows old version

**Solutions:**
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Restart dev server
npm run dev

# 3. Hard refresh in browser (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)

# 4. Check browser console for errors (F12)
```

### Issue 11: TypeScript errors

**Symptoms:**
```
Type 'string' is not assignable to type 'never'
```

**Solution:**
```bash
# Restart dev server - Next.js will recompile
npm run dev

# If errors persist, check tsconfig.json is valid
```

### Issue 12: Module not found errors

**Symptoms:**
```
Module not found: Can't resolve '@/lib/db'
```

**Causes:**
- File doesn't exist
- Wrong path in import

**Solution:**
```bash
# Check file exists
ls app/components/ThreatFeed.tsx
ls lib/db.ts

# Verify paths use @/ prefix
# Imports should be: import connectDB from '@/lib/db'
```

## Network Issues

### Issue 13: "fetch failed" in console

**Causes:**
1. API endpoint is down
2. Network connectivity issue
3. MongoDB is unreachable

**Troubleshooting:**
```bash
# Check API endpoint
curl http://localhost:3000/api/threat-feed

# Check MongoDB
mongosh  # If using local
# Or use MongoDB Atlas dashboard

# Check internet connection
ping google.com
```

### Issue 14: Slow API responses (>2 seconds)

**Causes:**
1. MongoDB is slow
2. RSS feeds are slow to respond
3. Network latency

**Solutions:**
- Check MongoDB Atlas performance dashboard
- Some RSS feeds are naturally slow
- On subsequent requests, cache should be faster

## Database Issues

### Issue 15: MongoDB error messages

**"Authentication failed"**
```
Error: authentication failed
```
- Check username and password in connection string
- Verify database user exists in MongoDB Atlas
- Ensure password doesn't have special characters that need escaping

**"No suitable servers found"**
```
Error: no suitable servers found
```
- Check IP whitelist in MongoDB Atlas
- Allow "Anywhere" for development
- Check internet connection

**"Unauthorized"**
```
Error: Unauthorized
```
- Database user doesn't have permission
- Recreate user with correct permissions

## Getting More Help

### 1. Check Application Logs
```bash
# Terminal where npm run dev is running shows detailed errors
# Look for:
# - MongoDB connection errors
# - RSS fetch errors
# - API errors
```

### 2. Check Browser Console
```
F12 → Console tab
Look for:
- JavaScript errors
- Network errors
- API response errors
```

### 3. Check MongoDB Logs
- MongoDB Atlas Dashboard
- Deployment → Logs
- Look for connection errors

### 4. Use Debug Mode
Add this to a component to see data:
```typescript
console.log("[v0] Articles loaded:", articles);
console.log("[v0] API response:", data);
console.log("[v0] Error details:", error);
```

## Quick Diagnostic Checklist

When something isn't working, check in order:

- [ ] Dev server running? (`npm run dev`)
- [ ] `.env.local` exists with `MONGODB_URI`?
- [ ] MongoDB connection string correct?
- [ ] MongoDB cluster is "Active"?
- [ ] IP whitelist allows your address?
- [ ] Database user created with correct password?
- [ ] No typos in environment variable names?
- [ ] `node_modules` installed? (`npm install`)
- [ ] Port 3000 available? (or change in dev script)
- [ ] Browser DevTools console clear of errors?

If still stuck:
1. Delete `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Restart dev server: `npm run dev`
4. Check this guide again for similar issues

## Still Need Help?

- Review [SETUP.md](./SETUP.md)
- Check [README.md](./README.md)
- Open a [GitHub Issue](https://github.com/ashutpandey/Re101/issues)
- Review application console logs carefully

---

**Last Updated:** January 2025
**Framework:** Next.js 15 + MongoDB
