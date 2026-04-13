# RE101 - Threat Intelligence Dashboard

A modern, real-time threat intelligence dashboard built with **Next.js 15** and **MongoDB**. Features real-time threat feeds from 16+ security sources with advanced IOC extraction, threat scoring, and YARA/Sigma rule lookup.

## ✨ Features

- **Real-time Threat Feed**: Aggregates security intelligence from 16+ industry-leading sources
- **Smart Threat Scoring**: Automatically scores articles based on threat keywords and CVE mentions
- **IOC Extraction**: Automatically extracts Indicators of Compromise (IPs, domains, hashes, CVEs)
- **YARA/Sigma Rules**: Search and view detection rules from SigmaHQ and Yara-Rules repositories
- **MongoDB Caching**: Efficient caching with 30-minute TTL to reduce API calls
- **Advanced Filtering**: Filter by threat level, timeframe (week/month), and keywords
- **Dark Theme**: Modern dark UI optimized for security analysts
- **Responsive Design**: Works seamlessly on desktop and tablet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/re101?retryWrites=true&w=majority
```

**To get a MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and get the connection string
4. Replace `username`, `password`, and `cluster` in the URI

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   └── threat-feed/
│   │       └── route.ts          # Threat feed API endpoint
│   ├── components/
│   │   └── ThreatFeed.tsx        # Main threat feed component
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── lib/
│   ├── db.ts                      # MongoDB connection
│   ├── rss-parser.ts              # RSS feed parser
│   └── constants.ts               # Constants and configurations
├── .env.local                     # Environment variables (local)
└── package.json
```

## 🔧 Configuration

### Threat Feed Sources

The dashboard aggregates from 16 security sources including:

- BleepingComputer
- The Hacker News
- Krebs on Security
- SANS ISC
- Unit 42 (Palo Alto)
- And 11 more industry leaders

### Threat Scoring Algorithm

Articles are scored (0-100) based on:
- **Threat keywords**: +10 points each
- **CVE mentions**: +15 points each
- **Maximum score**: 100 points

**Score Interpretation:**
- 🔴 **High (70+)**: Critical threats
- 🟡 **Medium (40-69)**: Important threats
- 🟢 **Low (<40)**: General information

## 📊 API Endpoints

### GET `/api/threat-feed`

Fetches all cached threat articles with MongoDB caching.

**Response:**
```json
[
  {
    "title": "Critical RCE Vulnerability",
    "link": "https://...",
    "description": "...",
    "pubDate": "2024-01-15T10:30:00Z",
    "source": "BleepingComputer",
    "sourceColor": "#a78bfa"
  }
]
```

**Cache**: 30-minute TTL

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add `MONGODB_URI` to Environment Variables
4. Deploy!

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env.local`
- Ensure MongoDB cluster is active
- Verify IP whitelist in MongoDB Atlas

### "Threat feed not loading"
- Check browser console for errors
- Verify API endpoint: `curl http://localhost:3000/api/threat-feed`
- Check server logs for detailed errors

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Fork, create a feature branch, and open a Pull Request.

---

Made with ❤️ for the security community
