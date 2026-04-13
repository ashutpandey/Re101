# Setup Guide - RE101 Threat Intelligence Dashboard

## Step 1: Prerequisites

Ensure you have:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm, pnpm, or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Free account](https://www.mongodb.com/cloud/atlas)

## Step 2: Clone the Repository

```bash
git clone https://github.com/ashutpandey/Re101.git
cd Re101
```

## Step 3: Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (recommended for faster installations)
pnpm install

# Or using yarn
yarn install
```

## Step 4: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Sign Up" and create a free account
   - Verify your email

2. **Create a Cluster**
   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select your preferred region (closest to you)
   - Click "Create Deployment"
   - Wait for cluster to initialize (2-3 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password (save these!)
   - Click "Add User"

4. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Drivers"
   - Select Node.js and version 5.5
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Whitelist Your IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development only!)
   - Click "Confirm"

6. **Create Environment File**
   - Create `.env.local` in project root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/re101?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB (Development Only)

1. **Install MongoDB Community Edition**
   - [Download](https://www.mongodb.com/try/download/community)
   - Follow installation guide for your OS

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community

   # Linux (Ubuntu)
   sudo systemctl start mongod

   # Windows
   mongosh
   ```

3. **Create Environment File**
   - Create `.env.local` in project root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/re101
   ```

## Step 5: Run the Application

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Threat Feed

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click the "Refresh" button to load threat feeds
3. Feeds should start loading from RSS sources
4. Articles will be cached in MongoDB

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure `.env.local` file exists in the root directory
- Verify the variable name is exactly `MONGODB_URI`
- Restart the dev server after creating `.env.local`

### "connect ECONNREFUSED 127.0.0.1:27017"
- If using local MongoDB, ensure MongoDB is running
- If using Atlas, check your connection string and IP whitelist

### "Cannot find module 'mongodb'"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### "Feeds not loading"
- Check browser console (F12) for errors
- Verify MongoDB is connected: Check `.env.local`
- Try clicking "Refresh" button again
- Check if RSS sources are accessible

### "CORS errors when fetching rules"
- GitHub API might be rate limited (60 requests/hour without auth)
- Wait an hour or add GitHub token to environment:
  ```env
  GITHUB_TOKEN=your_github_personal_access_token
  ```

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string

### Optional
- `GITHUB_TOKEN` - GitHub personal access token for increased API rate limits

## Next Steps

1. **Explore the threat feeds** - Click on articles to see IOC extraction and threat scoring
2. **Look up detection rules** - Click "Σ / Y Rules" to find YARA/Sigma rules
3. **Customize threat keywords** - Edit `lib/constants.ts` to add more keywords
4. **Add more RSS feeds** - Edit feed list in `app/api/threat-feed/route.ts`
5. **Deploy to production** - See deployment guides

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
6. Click "Deploy"

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2
- Azure App Service

## Support

- Check [GitHub Issues](https://github.com/ashutpandey/Re101/issues)
- Review this setup guide again
- Check application console logs (terminal where `npm run dev` runs)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Threat Intelligence Guide](https://www.sans.org/white-papers/threat-intelligence-program/)
