import { useState, useEffect, useCallback } from "react";

const FEEDS = [
  { name: "BleepingComputer", query: "site:bleepingcomputer.com security threat malware", color: "#a78bfa" },
  { name: "The Hacker News", query: "site:thehackernews.com malware vulnerability exploit", color: "#f87171" },
  { name: "Krebs on Security", query: "site:krebsonsecurity.com cybersecurity breach", color: "#fbbf24" },
  { name: "SANS ISC", query: "site:isc.sans.edu threat advisory handler", color: "#00d4ff" },
  { name: "Unit 42", query: "site:unit42.paloaltonetworks.com threat research malware", color: "#ff6b35" },
  { name: "Elastic Sec Labs", query: "site:elastic.co security-labs malware analysis", color: "#00ff9d" },
  { name: "DFIR Report", query: "site:thedfirreport.com ransomware incident", color: "#ff4d6d" },
  { name: "Cisco Talos", query: "site:blog.talosintelligence.com threat intelligence", color: "#1d9bf0" },
  { name: "Securelist", query: "site:securelist.com APT malware campaign", color: "#e11d48" },
  { name: "Microsoft MSRC", query: "site:msrc.microsoft.com vulnerability advisory", color: "#0078d4" },
  { name: "Mandiant", query: "site:mandiant.com threat actor campaign", color: "#34d399" },
  { name: "Dark Reading", query: "site:darkreading.com cybersecurity attack breach", color: "#94a3b8" },
];

const THREAT_KEYWORDS = [
  "ransomware","zero-day","zeroday","exploit","backdoor","trojan","malware",
  "apt","threat actor","campaign","vulnerability","CVE","botnet","c2","command and control",
  "phishing","lateral movement","privilege escalation","persistence","exfiltration",
  "cobalt strike","shellcode","rootkit","loader","stealer","infostealer",
];

const IOC_PATTERNS = {
  ips: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  domains: /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|xyz|ru|cn|info|biz)\b/gi,
  hashes_md5: /\b[a-fA-F0-9]{32}\b/g,
  hashes_sha256: /\b[a-fA-F0-9]{64}\b/g,
  cves: /CVE-\d{4}-\d{4,7}/gi,
};

function scoreArticle(title, description) {
  const text = (title + " " + (description || "")).toLowerCase();
  let score = 0;
  THREAT_KEYWORDS.forEach(kw => { if (text.includes(kw.toLowerCase())) score += 10; });
  const cves = text.match(IOC_PATTERNS.cves) || [];
  score += cves.length * 15;
  return Math.min(score, 100);
}

function extractIOCs(text) {
  const clean = (text || "").replace(/<[^>]+>/g, " ");
  return {
    ips: [...new Set((clean.match(IOC_PATTERNS.ips) || []).filter(ip => !ip.startsWith("10.") && !ip.startsWith("192.168") && !ip.startsWith("127.")))],
    domains: [...new Set((clean.match(IOC_PATTERNS.domains) || []).slice(0, 5))],
    hashes: [...new Set([...(clean.match(IOC_PATTERNS.hashes_md5) || []), ...(clean.match(IOC_PATTERNS.hashes_sha256) || [])])].slice(0, 3),
    cves: [...new Set(clean.match(IOC_PATTERNS.cves) || [])],
  };
}

function extractKeywords(text) {
  const clean = (text || "").replace(/<[^>]+>/g, " ").toLowerCase();
  return THREAT_KEYWORDS.filter(kw => clean.includes(kw.toLowerCase()));
}

function isWithinTimeframe(dateStr, days = 30) {
  if (!dateStr) return true;
  const pub = new Date(dateStr);
  if (isNaN(pub.getTime())) return true;
  return Date.now() - pub.getTime() <= days * 24 * 60 * 60 * 1000;
}

async function fetchFeedViaAPI(feed) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search for recent cybersecurity articles from ${feed.name} using this query: ${feed.query}

Return ONLY a raw JSON array with no markdown formatting, no backticks, no explanation. Just the array:
[{"title":"...","link":"https://...","description":"2-3 sentence summary mentioning CVEs malware names threat actors","pubDate":"YYYY-MM-DD"}]

Find 4-5 articles. All links must be real URLs from ${feed.name}.`
        }],
      })
    });

    const data = await response.json();
    if (!data.content) return [];
    
    const text = data.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("");

    // Aggressively strip markdown
    let clean = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();
    
    // Find JSON array
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]");
    if (start === -1 || end === -1) return [];
    
    const jsonStr = clean.slice(start, end + 1);
    const items = JSON.parse(jsonStr);
    
    return items.filter(item => item.title && item.link).map(item => ({
      ...item,
      _source: feed,
      _score: scoreArticle(item.title, item.description),
      _keywords: extractKeywords(item.title + " " + (item.description || "")),
    }));
  } catch (e) {
    console.error(`Error fetching ${feed.name}:`, e);
    return [];
  }
}

function ScoreBar({ score }) {
  const color = score >= 70 ? "#f87171" : score >= 40 ? "#fbbf24" : "#34d399";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 10, color, fontFamily: "monospace", minWidth: 30 }}>{score}%</span>
    </div>
  );
}

function IOCTag({ label, items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}: </span>
      {items.slice(0, 3).map((v, i) => (
        <span key={i} style={{ fontSize: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 3, padding: "1px 5px", marginRight: 4, fontFamily: "monospace" }}>{v}</span>
      ))}
    </div>
  );
}

function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false);
  const source = article._source;
  const iocs = extractIOCs(article.description || "");
  const keywords = article._keywords || [];
  const score = article._score || 0;
  const cleanDesc = (article.description || "").replace(/<[^>]+>/g, "").slice(0, 300);

  return (
    <div style={{ background: "#07090f", border: `1px solid ${score >= 70 ? "rgba(248,77,109,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: 16, marginBottom: 10, position: "relative", overflow: "hidden" }}>
      {score >= 70 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #ff4d6d, #f5a623)" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: source.color, background: `${source.color}15`, border: `1px solid ${source.color}30`, borderRadius: 4, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" }}>{source.name}</span>
            {keywords.slice(0, 3).map((kw, i) => (
              <span key={i} style={{ fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "2px 6px", fontFamily: "monospace" }}>{kw}</span>
            ))}
            {article.pubDate && <span style={{ fontSize: 10, color: "#3d444d", fontFamily: "monospace", marginLeft: "auto" }}>{article.pubDate}</span>}
          </div>
          <a href={article.link} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 13, fontWeight: 600, lineHeight: 1.5, display: "block", marginBottom: 8 }}>
            {article.title}
          </a>
          <ScoreBar score={score} />
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "#6e7681", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", flexShrink: 0 }}>
          {expanded ? "Less ↑" : "IOCs ↓"}
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 10px", lineHeight: 1.6 }}>{cleanDesc}</p>
          <IOCTag label="CVEs" items={iocs.cves} />
          <IOCTag label="IPs" items={iocs.ips} />
          <IOCTag label="Domains" items={iocs.domains} />
          <IOCTag label="Hashes" items={iocs.hashes} />
        </div>
      )}
    </div>
  );
}

export default function ThreatFeedPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedStatuses, setFeedStatuses] = useState({});
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("month");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [activeFeeds, setActiveFeeds] = useState(FEEDS.map(f => f.name));
  const [showAllFeeds, setShowAllFeeds] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    setArticles([]);
    
    const activeSources = FEEDS.filter(f => activeFeeds.includes(f.name));
    const initStatus = {};
    activeSources.forEach(f => { initStatus[f.name] = "loading"; });
    setFeedStatuses(initStatus);

    // Batch 3 at a time to avoid rate limits
    for (let i = 0; i < activeSources.length; i += 3) {
      const batch = activeSources.slice(i, i + 3);
      await Promise.all(batch.map(async (feed) => {
        const items = await fetchFeedViaAPI(feed);
        setFeedStatuses(prev => ({ ...prev, [feed.name]: items.length > 0 ? "done" : "error" }));
        if (items.length > 0) {
          setArticles(prev => [...prev, ...items]);
        }
      }));
    }

    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
    setHasLoaded(true);
  }, [activeFeeds]);

  const filtered = articles
    .filter(a => isWithinTimeframe(a.pubDate, timeframe === "week" ? 7 : 30))
    .filter(a => {
      if (filter === "high") return a._score >= 70;
      if (filter === "medium") return a._score >= 40 && a._score < 70;
      if (filter === "low") return a._score < 40;
      return true;
    })
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a._keywords || []).some(k => k.includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "score" ? b._score - a._score : new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  const doneCount = Object.values(feedStatuses).filter(s => s !== "loading").length;
  const totalActive = activeFeeds.length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh", background: "#0d1117", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: 16, overflowY: "auto" }}>
        <div style={{ fontSize: 12, color: "#00d4ff", fontWeight: 700, marginBottom: 20, letterSpacing: 2, fontFamily: "monospace" }}>⬡ THREATFEED</div>
        
        <div style={{ fontSize: 10, color: "#3d444d", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>Sources</div>
        {(showAllFeeds ? FEEDS : FEEDS.slice(0, 8)).map(feed => {
          const status = feedStatuses[feed.name];
          const dotColor = status === "done" ? feed.color : status === "loading" ? "#fbbf24" : status === "error" ? "#f87171" : activeFeeds.includes(feed.name) ? feed.color + "60" : "#1e2d40";
          return (
            <div key={feed.name}
              onClick={() => setActiveFeeds(prev => prev.includes(feed.name) ? prev.filter(f => f !== feed.name) : [...prev, feed.name])}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, cursor: "pointer", marginBottom: 2, background: activeFeeds.includes(feed.name) ? "rgba(255,255,255,0.03)" : "transparent", border: `1px solid ${activeFeeds.includes(feed.name) ? feed.color + "30" : "transparent"}` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0, transition: "background 0.3s" }} />
              <span style={{ fontSize: 11, color: activeFeeds.includes(feed.name) ? feed.color : "#3d444d", fontFamily: "monospace" }}>{feed.name}</span>
            </div>
          );
        })}
        {FEEDS.length > 8 && (
          <button onClick={() => setShowAllFeeds(p => !p)} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.06)", color: "#6e7681", borderRadius: 6, padding: "5px 0", cursor: "pointer", fontSize: 10, fontFamily: "monospace", marginTop: 4 }}>
            {showAllFeeds ? "▲ Show less" : `▼ +${FEEDS.length - 8} more`}
          </button>
        )}

        <div style={{ fontSize: 10, color: "#3d444d", textTransform: "uppercase", letterSpacing: 2, margin: "20px 0 8px", fontFamily: "monospace" }}>Stats</div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12 }}>
          {[
            { label: "Loaded", val: articles.length, color: "#e2e8f0" },
            { label: "High", val: articles.filter(a => a._score >= 70).length, color: "#ff4d6d" },
            { label: "Medium", val: articles.filter(a => a._score >= 40 && a._score < 70).length, color: "#fbbf24" },
            { label: "Showing", val: filtered.length, color: "#00d4ff" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#3d444d", fontFamily: "monospace" }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 700, fontFamily: "monospace" }}>{s.val}</span>
            </div>
          ))}
        </div>

        {lastRefresh && <div style={{ marginTop: 12, fontSize: 10, color: "#3d444d", fontFamily: "monospace" }}>Refreshed: {lastRefresh}</div>}
      </div>

      {/* Main */}
      <div style={{ padding: 20, overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles, keywords..." style={{ flex: 1, minWidth: 180, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", borderRadius: 8, padding: "8px 14px", fontSize: 12, outline: "none", fontFamily: "monospace" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {["week","month"].map(v => (
                <button key={v} onClick={() => setTimeframe(v)} style={{ background: timeframe===v ? "rgba(0,153,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${timeframe===v ? "rgba(0,153,255,0.3)" : "rgba(255,255,255,0.06)"}`, color: timeframe===v ? "#0099ff" : "#6e7681", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", textTransform: "capitalize" }}>{v}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[["all","All"],["high","High"],["medium","Med"],["low","Low"]].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{ background: filter===v ? "rgba(255,255,255,0.05)" : "none", border: `1px solid ${filter===v ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`, color: filter===v ? "#e2e8f0" : "#6e7681", borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[["score","Score"],["date","Date"]].map(([v,l]) => (
                <button key={v} onClick={() => setSortBy(v)} style={{ background: sortBy===v ? "rgba(0,212,255,0.06)" : "none", border: `1px solid ${sortBy===v ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.06)"}`, color: sortBy===v ? "#00d4ff" : "#6e7681", borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>{l}</button>
              ))}
            </div>
            <button onClick={loadFeeds} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.02)" : "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", borderRadius: 8, padding: "8px 16px", cursor: loading ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap" }}>
              {loading ? `⟳ ${doneCount}/${totalActive}` : "⟳ Load Feeds"}
            </button>
          </div>

          {loading && (
            <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#00d4ff", fontFamily: "monospace" }}>🔍 AI searching threat feeds...</span>
                <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{doneCount}/{totalActive} complete · {articles.length} articles found</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${totalActive ? (doneCount / totalActive) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #00d4ff, #a78bfa)", borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
          )}
        </div>

        {!hasLoaded && !loading && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⬡</div>
            <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Threat Intelligence Feed</div>
            <div style={{ color: "#475569", fontSize: 13, marginBottom: 28, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px" }}>
              Aggregates real-time security intelligence from {FEEDS.length} sources using AI-powered web search. No CORS issues — articles fetched fresh each time.
            </div>
            <button onClick={loadFeeds} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>
              ⟳ Load Threat Feeds
            </button>
          </div>
        )}

        {filtered.map((a, i) => <ArticleCard key={`${a._source.name}-${i}`} article={a} />)}

        {hasLoaded && !loading && filtered.length === 0 && articles.length > 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#475569", fontFamily: "monospace" }}>
            No articles match your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
