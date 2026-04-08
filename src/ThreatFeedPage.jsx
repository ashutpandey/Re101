mport { useState, useEffect, useCallback } from "react";

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

const IOC_PATTERNS = {
  ips: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  domains: /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|xyz|ru|cn|info|biz)\b/gi,
  hashes_md5: /\b[a-fA-F0-9]{32}\b/g,
  hashes_sha256: /\b[a-fA-F0-9]{64}\b/g,
  cves: /CVE-\d{4}-\d{4,7}/gi,
};

const THREAT_KEYWORDS = [
  "ransomware","zero-day","zeroday","exploit","backdoor","trojan","malware",
  "apt","threat actor","campaign","vulnerability","CVE","botnet","c2","command and control",
  "phishing","lateral movement","privilege escalation","persistence","exfiltration",
  "cobalt strike","shellcode","rootkit","loader","stealer","infostealer",
];

// --- LOGIC FUNCTIONS ---

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

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

function isWithinTimeframe(dateStr, days = 7) {
  if (!dateStr) return true;
  const pub = new Date(dateStr);
  if (isNaN(pub.getTime())) return true;
  const diff = Date.now() - pub.getTime();
  return diff <= (days * 24 * 60 * 60 * 1000);
}

// --- RELIABLE FETCH (Uses CORS Proxy + XML Parsing) ---
async function fetchRSSviaProxy(feedUrl) {
  try {
    // Swapping to corsproxy.io as it's more stable for 2026
    const proxy = `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(proxy);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    
    // Convert XML to JSON structure compatible with your original code
    const items = Array.from(xml.querySelectorAll("item, entry")).map(el => ({
      title: el.querySelector("title")?.textContent || "",
      link: el.querySelector("link")?.textContent || el.querySelector("link")?.getAttribute("href") || "",
      description: el.querySelector("description")?.textContent || el.querySelector("summary")?.textContent || "",
      pubDate: el.querySelector("pubDate")?.textContent || el.querySelector("published")?.textContent || "",
    }));

    return items;
  } catch (e) {
    console.error("Fetch error", e);
    return [];
  }
}

async function searchSigmaRules(keywords) {
  const query = keywords.slice(0, 2).join("+");
  if (!query) return null;
  const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:SigmaHQ/sigma+extension:yml&per_page=3`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  const data = await res.json();
  return data.items || [];
}

async function searchYARARules(keywords) {
  const query = keywords.slice(0, 2).join("+");
  if (!query) return null;
  const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:Yara-Rules/rules+extension:yar&per_page=3`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  const data = await res.json();
  return data.items || [];
}

async function fetchRuleContent(rawUrl) {
  const res = await fetch(rawUrl);
  return await res.text();
}

// --- ORIGINAL UI COMPONENTS ---

function ScoreBar({ score }) {
  const color = score >= 70 ? "#f87171" : score >= 40 ? "#fbbf24" : "#34d399";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 10, color, fontFamily: "Fira Code", minWidth: 30 }}>{score}%</span>
    </div>
  );
}

function IOCTag({ label, items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{label}: </span>
      {items.slice(0, 3).map((v, i) => (
        <span key={i} style={{ fontSize: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 3, padding: "1px 5px", marginRight: 4, fontFamily: "Fira Code" }}>{v}</span>
      ))}
    </div>
  );
}

function RuleModal({ article, onClose }) {
  const [sigmaRules, setSigmaRules] = useState(null);
  const [yaraRules, setYaraRules] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleContent, setRuleContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    async function load() {
      const kws = extractKeywords(article.title + " " + article.description);
      const [sigma, yara] = await Promise.all([
        searchSigmaRules(kws).catch(() => []),
        searchYARARules(kws).catch(() => []),
      ]);
      setSigmaRules(sigma || []);
      setYaraRules(yara || []);
      setLoading(false);
    }
    load();
  }, [article]);

  async function loadContent(item, type) {
    setLoadingContent(true);
    setSelectedRule({ ...item, type });
    const raw = item.html_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    const content = await fetchRuleContent(raw).catch(() => "// Could not load content");
    setRuleContent(content);
    setLoadingContent(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, width: "100%", maxWidth: 800, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Rule Lookup</div>
            <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, fontFamily: "Syne" }}>{article.title.slice(0, 60)}...</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20, display: "grid", gridTemplateColumns: selectedRule ? "1fr 1.4fr" : "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#00d4ff", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: "Fira Code" }}>Σ Sigma Rules</div>
            {loading ? <div style={{ color: "#475569", fontSize: 12 }}>Searching SigmaHQ...</div> :
              !sigmaRules?.length ? <div style={{ color: "#f87171", fontSize: 12, padding: "8px 0", lineHeight: 1.6 }}>⚠ No Sigma rules found</div> :
              sigmaRules.map((r, i) => (
                <div key={i} onClick={() => loadContent(r, "sigma")} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${selectedRule?.html_url === r.html_url ? "#00d4ff" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: 10, marginBottom: 8, cursor: "pointer", transition: "border-color 0.2s" }}>
                  <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "Syne" }}>{r.name}</div>
                  <div style={{ color: "#475569", fontSize: 10, fontFamily: "Fira Code" }}>{r.path}</div>
                </div>
              ))
            }
            <div style={{ fontSize: 11, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 10px", fontFamily: "Fira Code" }}>YARA Rules</div>
            {loading ? <div style={{ color: "#475569", fontSize: 12 }}>Searching Yara-Rules...</div> :
              !yaraRules?.length ? <div style={{ color: "#f87171", fontSize: 12, padding: "8px 0", lineHeight: 1.6 }}>⚠ No YARA rules found</div> :
              yaraRules.map((r, i) => (
                <div key={i} onClick={() => loadContent(r, "yara")} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${selectedRule?.html_url === r.html_url ? "#a78bfa" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: 10, marginBottom: 8, cursor: "pointer" }}>
                  <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "Syne" }}>{r.name}</div>
                  <div style={{ color: "#475569", fontSize: 10, fontFamily: "Fira Code" }}>{r.path}</div>
                </div>
              ))
            }
          </div>
          {selectedRule && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, color: selectedRule.type === "sigma" ? "#00d4ff" : "#a78bfa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: "Fira Code" }}>
                {selectedRule.type === "sigma" ? "Σ" : "Y"} {selectedRule.name}
              </div>
              <a href={selectedRule.html_url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#475569", marginBottom: 10, wordBreak: "break-all" }}>{selectedRule.html_url}</a>
              <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12, overflow: "auto" }}>
                {loadingContent ? <div style={{ color: "#475569", fontSize: 12 }}>Loading content...</div> :
                  <pre style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontFamily: "Fira Code", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{ruleContent}</pre>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, source }) {
  const [expanded, setExpanded] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const iocs = extractIOCs(article.description || "");
  const keywords = extractKeywords(article.title + " " + (article.description || ""));
  const score = scoreArticle(article.title, article.description || "");
  const cleanDesc = (article.description || "").replace(/<[^>]+>/g, "").slice(0, 220);

  return (
    <>
      {showRules && <RuleModal article={article} onClose={() => setShowRules(false)} />}
      <div style={{ background: "#07090f", border: `1px solid ${score >= 70 ? "rgba(248,77,109,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: 16, marginBottom: 10, position: "relative", overflow: "hidden", transition: "border-color 0.3s" }}>
        {score >= 70 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #ff4d6d, #f5a623)" }} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: source.color, background: `${source.color}15`, border: `1px solid ${source.color}30`, borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>{source.name}</span>
              {keywords.slice(0, 3).map((kw, i) => (
                <span key={i} style={{ fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "2px 6px", fontFamily: "Fira Code" }}>{kw}</span>
              ))}
            </div>
            <a href={article.link} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 13, fontWeight: 600, lineHeight: 1.5, display: "block", marginBottom: 8, fontFamily: "Syne" }}>
              {article.title}
            </a>
            <ScoreBar score={score} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <button onClick={() => setShowRules(true)} style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "Fira Code" }}>Σ / Y Rules</button>
            <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "#6e7681", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code" }}>{expanded ? "Less ↑" : "IOCs ↓"}</button>
          </div>
        </div>
        {expanded && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 10px", lineHeight: 1.6, fontFamily: "Syne" }}>{cleanDesc}...</p>
            <IOCTag label="CVEs" items={iocs.cves} />
            <IOCTag label="IPs" items={iocs.ips} />
            <IOCTag label="Domains" items={iocs.domains} />
            <IOCTag label="Hashes" items={iocs.hashes} />
          </div>
        )}
      </div>
    </>
  );
}

// --- MAIN PAGE (PARALLEL LOADING FIXED) ---

export default function ThreatFeedPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedFeeds, setLoadedFeeds] = useState(0);
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("week"); // Toggle for Week vs Month
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [activeFeeds, setActiveFeeds] = useState(FEEDS.map(f => f.name));
  const [showAllFeeds, setShowAllFeeds] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    setArticles([]);
    setLoadedFeeds(0);
    
    const activeSources = FEEDS.filter(f => activeFeeds.includes(f.name));

    // Fast parallel fetch
    const results = await Promise.all(activeSources.map(async (feed) => {
      try {
        const items = await fetchRSSviaProxy(feed.url);
        const processed = items.map(item => ({
          ...item,
          _source: feed,
          _score: scoreArticle(item.title, item.description),
          _keywords: extractKeywords(item.title + " " + item.description),
        }));
        setLoadedFeeds(prev => prev + 1);
        return processed;
      } catch (e) {
        setLoadedFeeds(prev => prev + 1);
        return [];
      }
    }));

    setArticles(results.flat());
    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  }, [activeFeeds]);

  useEffect(() => { loadFeeds(); }, []);

  const filtered = articles
    .filter(a => timeframe === "week" ? isWithinTimeframe(a.pubDate, 7) : isWithinTimeframe(a.pubDate, 30))
    .filter(a => {
      if (filter === "high") return a._score >= 70;
      if (filter === "medium") return a._score >= 40 && a._score < 70;
      if (filter === "low") return a._score < 40;
      return true;
    })
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a._keywords.some(k => k.includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "score" ? b._score - a._score : new Date(b.pubDate) - new Date(a.pubDate));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 56px)", background: "#0d1117" }}>
      {/* Sidebar (ORIGINAL UI) */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: 16 }}>
        <div style={{ fontSize: 10, color: "#3d444d", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontFamily: "Fira Code" }}>Sources</div>
        {(showAllFeeds ? FEEDS : FEEDS.slice(0, 8)).map(feed => (
          <div key={feed.name} onClick={() => setActiveFeeds(prev => prev.includes(feed.name) ? prev.filter(f => f !== feed.name) : [...prev, feed.name])}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 3, background: activeFeeds.includes(feed.name) ? "rgba(255,255,255,0.03)" : "transparent", border: `1px solid ${activeFeeds.includes(feed.name) ? feed.color + "30" : "transparent"}`, transition: "all 0.15s" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: activeFeeds.includes(feed.name) ? feed.color : "#1e2d40", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: activeFeeds.includes(feed.name) ? feed.color : "#3d444d", fontFamily: "Fira Code" }}>{feed.name}</span>
          </div>
        ))}
        {FEEDS.length > 8 && (
          <button onClick={() => setShowAllFeeds(p => !p)} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.06)", color: "#6e7681", borderRadius: 6, padding: "5px 0", cursor: "pointer", fontSize: 10, fontFamily: "Fira Code", marginTop: 4 }}>{showAllFeeds ? "▲ Show less" : `▼ +${FEEDS.length - 8} more`}</button>
        )}
        <div style={{ fontSize: 10, color: "#3d444d", textTransform: "uppercase", letterSpacing: 2, margin: "20px 0 12px", fontFamily: "Fira Code" }}>Stats</div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12 }}>
          {[{ label: "Total", val: articles.length, color: "#e2e8f0" }, { label: "High", val: articles.filter(a => a._score >= 70).length, color: "#ff4d6d" }].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#3d444d", fontFamily: "Fira Code" }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 700, fontFamily: "Fira Code" }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (ORIGINAL UI) */}
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", borderRadius: 8, padding: "8px 14px", fontSize: 12, outline: "none", fontFamily: "Fira Code" }} />
          
          {/* Week/Month Toggle */}
          <div style={{ display: "flex", gap: 4 }}>
            {["week", "month"].map(v => (
              <button key={v} onClick={() => setTimeframe(v)} style={{ background: timeframe === v ? "rgba(0,153,255,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${timeframe === v ? "rgba(0,153,255,0.3)" : "rgba(255,255,255,0.06)"}`, color: timeframe === v ? "#0099ff" : "#6e7681", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code", textTransform: "capitalize" }}>{v}</button>
            ))}
          </div>

          <button onClick={loadFeeds} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.02)" : "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "Fira Code" }}>
            {loading ? `Loading ${loadedFeeds}...` : "⟳ Refresh"}
          </button>
        </div>

        {loading && articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#3d444d", fontFamily: "Fira Code" }}>⟳ Loading Intel Feeds...</div>
        ) : (
          filtered.map((a, i) => <ArticleCard key={i} article={a} source={a._source} />)
        )}
      </div>
    </div>
  );
}
