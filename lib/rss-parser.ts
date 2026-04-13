import Parser from 'rss-parser';

interface ThreatArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  cached: boolean;
  cachedAt?: Date;
}

const parser = new Parser({
  customFields: {
    item: [['media:content', 'media']],
  },
});

const RSS_FEEDS = [
  {
    name: 'SecurityFocus',
    url: 'http://www.securityfocus.com/rss/vulnerabilities.xml',
  },
  {
    name: 'NIST NVD',
    url: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json',
  },
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
  },
];

export async function parseThreatFeeds(): Promise<ThreatArticle[]> {
  const articles: ThreatArticle[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      
      if (parsed.items) {
        parsed.items.forEach((item) => {
          if (item.title && item.link && item.pubDate) {
            articles.push({
              id: `${feed.name}-${item.link}`,
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              description: item.content || item.contentSnippet || '',
              source: feed.name,
              cached: true,
              cachedAt: new Date(),
            });
          }
        });
      }
    } catch (error) {
      console.error(`Error parsing feed ${feed.name}:`, error);
    }
  }

  return articles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
