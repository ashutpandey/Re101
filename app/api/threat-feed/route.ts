import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { parseThreatFeeds } from '@/lib/rss-parser';
import { CACHE_TTL } from '@/lib/constants';

const FEEDS = [
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", color: "#a78bfa" },
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", color: "#f87171" },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", color: "#fbbf24" },
  { name: "SANS ISC", url: "https://isc.sans.edu/rssfeed_full.xml", color: "#00d4ff" },
  { name: "Unit 42", url: "https://unit42.paloaltonetworks.com/feed/", color: "#ff6b35" },
  { name: "Elastic Sec Labs", url: "https://www.elastic.co/security-labs/rss/feed.xml", color: "#00ff9d" },
  { name: "DFIR Report", url: "https://thedfirreport.com/feed/", color: "#ff4d6d" },
  { name: "Mandiant", url: "https://www.mandiant.com/resources/blog/rss.xml", color: "#34d399" },
  { name: "Cisco Talos", url: "https://blog.talosintelligence.com/rss/", color: "#1d9bf0" },
  { name: "Securelist (KL)", url: "https://securelist.com/feed/", color: "#e11d48" },
  { name: "Microsoft MSRC", url: "https://msrc.microsoft.com/blog/feed", color: "#0078d4" },
  { name: "Recorded Future", url: "https://www.recordedfuture.com/feed", color: "#6ee7b7" },
  { name: "Malwarebytes Labs", url: "https://www.malwarebytes.com/blog/feed/", color: "#4ade80" },
  { name: "Checkpoint Research", url: "https://research.checkpoint.com/feed/", color: "#e879f9" },
  { name: "Trend Micro", url: "https://www.trendmicro.com/en_us/research.rss", color: "#f97316" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml", color: "#94a3b8" },
];

async function fetchRSSviaProxy(feedUrl: string) {
  try {
    const proxy = `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(proxy, { next: { revalidate: 1800 } });
    const text = await res.text();
    
    // Simple XML parsing for RSS feeds
    const parser = new DOMParser ? undefined : null;
    
    // Fallback parsing using regex for server-side
    const items = [];
    const itemRegex = /<item>[\s\S]*?<\/item>|<entry>[\s\S]*?<\/entry>/g;
    const matches = text.match(itemRegex) || [];
    
    for (const match of matches) {
      const titleMatch = match.match(/<title[^>]*>([^<]+)<\/title>/);
      const linkMatch = match.match(/<link[^>]*>([^<]+)<\/link>/);
      const descMatch = match.match(/<description[^>]*>([^<]+)<\/description>/);
      const pubMatch = match.match(/<pubDate[^>]*>([^<]+)<\/pubDate>/);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1] || '',
          link: linkMatch[1] || '',
          description: descMatch ? descMatch[1] : '',
          pubDate: pubMatch ? pubMatch[1] : new Date().toISOString(),
        });
      }
    }
    
    return items;
  } catch (e) {
    console.error(`Error fetching ${feedUrl}:`, e);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    const threatsCollection = db.collection('threat_articles');
    
    // Check cache
    const cached = await threatsCollection.findOne({ _id: 'cache' });
    const now = new Date();
    
    if (cached && cached.cachedAt && (now.getTime() - cached.cachedAt.getTime()) < CACHE_TTL) {
      return NextResponse.json(cached.articles || []);
    }
    
    // Fetch fresh articles
    const results = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const items = await fetchRSSviaProxy(feed.url);
          return items.map((item: any) => ({
            ...item,
            source: feed.name,
            sourceColor: feed.color,
          }));
        } catch (e) {
          console.error(`Failed to fetch ${feed.name}:`, e);
          return [];
        }
      })
    );
    
    const allArticles = results.flat();
    
    // Cache in MongoDB
    await threatsCollection.updateOne(
      { _id: 'cache' },
      {
        $set: {
          articles: allArticles,
          cachedAt: now,
        },
      },
      { upsert: true }
    );
    
    return NextResponse.json(allArticles);
  } catch (error: any) {
    console.error('Threat feed API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threat feed', details: error.message },
      { status: 500 }
    );
  }
}
