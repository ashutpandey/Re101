import { useState, useEffect, useCallback } from "react";

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
  { name: "CrowdStrike Blog", url: "https://www.crowdstrike.com/blog/feed/", color: "#ef4444" },
  { name: "SentinelOne", url: "https://www.sentinelone.com/blog/feed/", color: "#8b5cf6" },
  { name: "Red Canary", url: "https://redcanary.com/feed/", color: "#f43f5e" },
  { name: "CISA Advisories", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", color: "#0ea5e9" },
  { name: "Huntress Labs", url: "https://www.huntress.com/blog/rss.xml", color: "#fb923c" },
  { name: "Secureworks CTU", url: "https://www.secureworks.com/rss?feed=research", color: "#c084fc" },
  { name: "NCC Group", url: "https://research.nccgroup.com/feed/", color: "#22d3ee" },
  { name: "WithSecure Labs", url: "https://labs.withsecure.com/feed", color: "#a3e635" },
];

// --- IOC REGEX PATTERNS ---
// IP: strict word-boundary check, avoids matching inside URLs/version strings
const RE_IP = /(?<![\/\.\w])(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?![\w\/\.])/g;
const RE_DOMAIN = /\b(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.){1,}(?:com|net|org|io|xyz|ru|cn|info|biz|co|gov|edu|mil|mobi|app|dev|ai)\b/gi;
const RE_MD5    = /\b[a-fA-F0-9]{32}\b/g;
const RE_SHA256 = /\b[a-fA-F0-9]{64}\b/g;
const RE_CVE    = /CVE-\d{4}-\d{4,7}/g;

const PRIVATE_IP_RE = /^(10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|255\.)/;

const DOMAIN_SKIPLIST = new Set([
  "google.com","microsoft.com","github.com","amazon.com","cloudflare.com",
  "apple.com","mozilla.org","wikipedia.org","twitter.com","linkedin.com",
  "youtube.com","facebook.com","w3.org","schema.org","example.com",
]);

const THREAT_KEYWORDS = [
  // Malware types
  "ransomware","wiper","trojan","backdoor","rootkit","bootkit","implant",
  "loader","dropper","downloader","stealer","infostealer","keylogger",
  "spyware","adware","formjacker","skimmer","web shell","webshell",
  "cryptominer","cryptojacking","banking trojan","rat","remote access trojan",
  // Named malware families / threat actors
  "lockbit","blackcat","alphv","cl0p","clop","akira","blackbasta","hive",
  "royal","play","cuba","lorenz","avoslocker","revil","darkside","conti",
  "lazarus","apt28","apt29","apt41","apt40","turla","fin7","fin8","fin12",
  "ta505","ta558","ta4903","scattered spider","lapsus","unc2452","cozy bear",
  "fancy bear","sandworm","equation group","hafnium","volt typhoon","salt typhoon",
  "cobalt strike","brute ratel","sliver","havoc","metasploit","covenant",
  "mimikatz","impacket","bloodhound","sharphound","rubeus","kerbrute",
  "nishang","powersploit","empire","crackmapexec","responder",
  // Vulnerability/exploit terms
  "zero-day","zeroday","exploit","exploit kit","exploit chain",
  "remote code execution","rce","arbitrary code execution","privilege escalation",
  "buffer overflow","use after free","heap spray","format string",
  "sql injection","sqli","xss","cross-site scripting",
  "ssrf","server-side request forgery","deserialization","xxe",
  "path traversal","lfi","rfi","log4shell","proxylogon","proxyshell",
  "follina","eternalblue","zerologon","printnightmare","spring4shell",
  "spectre","meltdown","dirty pipe","polkit","looney tunables",
  // MITRE ATT&CK tactics / techniques
  "initial access","execution","persistence","defense evasion",
  "credential access","discovery","lateral movement","collection","exfiltration",
  "command and control","impact","phishing","spearphishing","vishing","smishing",
  "living off the land","lolbas","lolbin","supply chain","typosquatting",
  "watering hole","drive-by download","dll sideloading","dll hijacking",
  "reflective dll","process injection","process hollowing","token impersonation",
  "uac bypass","kerberoasting","pass the hash","pass the ticket","dcsync",
  "credential dumping","lateral tool transfer","domain fronting","dns tunneling",
  "dns hijacking","man in the middle","mitm","arp spoofing","bitlocker abuse",
  // Infrastructure / ops
  "apt","threat actor","campaign","intrusion set","threat group",
  "c2","c&c","command and control","botnet","beacon","staging server",
  "cobalt strike beacon","meterpreter","stager","payload",
  "tor","onion","dark web","darknet","bulletproof hosting","fast flux","sinkhole",
  // IOC/intel terms
  "vulnerability","cve","patch tuesday","out-of-band patch",
  "ioc","indicator of compromise","ttps","tactics techniques procedures",
  "threat intelligence","attribution","malware","zero-day",
  // Data & impact
  "data breach","data leak","data theft","exfiltrated","exposed database",
  "double extortion","triple extortion","ransom","decryptor",
  "ics","scada","ot security","critical infrastructure",
  "healthcare","financial sector","government","energy sector",
];

// Normalize defanged IOCs and strip HTML
function defang(text) {
  return (text || "")
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, m => m.slice(9, -3))  // unwrap CDATA
    .replace(/<[^>]+>/g, " ")          // strip HTML tags
    .replace(/hxxps?:\/\//gi, "http://") // defanged URLs
    .replace(/\[\.\]/g, ".")            // [.] -> .
    .replace(/\(\.\)/g, ".")            // (.) -> .
    .replace(/\[dot\]/gi, ".")          // [dot] -> .
    .replace(/\(dot\)/gi, ".")          // (dot) -> .
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, " ");
}

// --- SCORING ---
function scoreArticle(title, description) {
  const text = defang((title || "") + " " + (description || "")).toLowerCase();
  let score = 0;
  for (const kw of THREAT_KEYWORDS) {
    if (text.includes(kw)) score += 7;
  }
  const cves = text.match(RE_CVE) || [];
  score += cves.length * 15;
  return Math.min(score, 100);
}

// --- IOC EXTRACTION ---
function extractIOCs(text) {
  if (!text || text.length < 10) return { ips: [], domains: [], hashes: [], cves: [] };
  // Truncate to 50k chars — regex on multi-MB descriptions can freeze the browser
  const clean = defang(text.slice(0, 50000));

  const ips = [...new Set((clean.match(RE_IP) || []).filter(ip => !PRIVATE_IP_RE.test(ip)))];

  const rawDomains = clean.match(new RegExp(RE_DOMAIN.source, RE_DOMAIN.flags)) || [];
  const domains = [...new Set(rawDomains.filter(d =>
    d.length >= 6 && !DOMAIN_SKIPLIST.has(d.toLowerCase())
  ))].slice(0, 5);

  const hashes = [...new Set([
    ...(clean.match(new RegExp(RE_MD5.source, RE_MD5.flags)) || []),
    ...(clean.match(new RegExp(RE_SHA256.source, RE_SHA256.flags)) || []),
  ])].slice(0, 3);

  const cves = [...new Set(clean.match(new RegExp(RE_CVE.source, RE_CVE.flags)) || [])];

  return { ips, domains, hashes, cves };
}

function extractKeywords(text) {
  const clean = defang(text).toLowerCase();
  return THREAT_KEYWORDS.filter(kw => clean.includes(kw));
}

function isWithinTimeframe(dateStr, days) {
  if (!dateStr) return true;
  const pub = new Date(dateStr);
  if (isNaN(pub.getTime())) return true;
  return (Date.now() - pub.getTime()) <= days * 86400000;
}

// --- RSS FETCH ---
// 5-proxy waterfall. Order is tuned for security blogs:
//   corsproxy > allorigins > fetchrss > rss2json > thingproxy
// corsproxy and allorigins handle Cloudflare-protected sites best.
// rss2json gets 422 on many security feeds (target blocks the rss2json server IP).
// thingproxy is a last resort — slow but different IP pool.

async function timedFetch(url, opts = {}, ms = 10000) {
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: ac.signal });
    clearTimeout(tid);
    return res;
  } catch (e) {
    clearTimeout(tid);
    throw e;
  }
}

// Returns true if response text looks like a real RSS/Atom feed
function looksLikeFeed(text) {
  const t = text.trim().slice(0, 200).toLowerCase();
  return t.startsWith("<?xml") || t.startsWith("<rss") || t.startsWith("<feed") || t.includes("<channel>");
}

// Strategy 1: corsproxy.io — best success rate for Cloudflare-protected security blogs
async function tryCorsproxy(feedUrl) {
  const url = `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`;
  const res = await timedFetch(url);
  if (!res.ok) throw new Error(`corsproxy HTTP ${res.status}`);
  const text = await res.text();
  if (!looksLikeFeed(text)) throw new Error("corsproxy returned non-feed content");
  return parseRSS(text);
}

// Strategy 2: allorigins.win — wraps raw XML in JSON envelope
// Handles many feeds but maintains a blocklist of high-traffic domains
async function tryAllOrigins(feedUrl) {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
  const res = await timedFetch(url);
  if (!res.ok) throw new Error(`allorigins HTTP ${res.status}`);
  const json = await res.json();
  // status_code 0 means blocked; contents may be empty or an HTML error page
  if (!json.contents || !looksLikeFeed(json.contents))
    throw new Error(`allorigins blocked (status_code=${json.status?.http_code ?? "?"})`);
  return parseRSS(json.contents);
}

// Strategy 3: fetchrss.app — dedicated RSS proxy, handles Cloudflare & paywalls better
async function tryFetchRss(feedUrl) {
  const url = `https://fetchrss.app/api/feed?url=${encodeURIComponent(feedUrl)}`;
  const res = await timedFetch(url, {}, 12000);
  if (!res.ok) throw new Error(`fetchrss HTTP ${res.status}`);
  const text = await res.text();
  if (!looksLikeFeed(text)) throw new Error("fetchrss returned non-feed content");
  return parseRSS(text);
}

// Strategy 4: rss2json.com — clean JSON output but many security sites return 422
// because the rss2json server IPs are blocked by Cloudflare WAFs on popular security blogs.
// Cache-buster prevents stale 422 responses being served from their cache.
async function tryRss2Json(feedUrl) {
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=50&_cb=${Date.now()}`;
  const res = await timedFetch(url);
  // 422 = target blocked rss2json's server; 403 = rate limited or blocked
  if (res.status === 422 || res.status === 403)
    throw new Error(`rss2json blocked by target (${res.status})`);
  if (!res.ok) throw new Error(`rss2json HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "ok") throw new Error(`rss2json: ${data.message || data.status}`);
  return (data.items || []).map(item => ({
    title: item.title || "",
    link: item.link || item.guid || "",
    description: item.description || item.content || "",
    pubDate: item.pubDate || "",
  }));
}

// Strategy 5: thingproxy — last resort, different IP pool, slower
async function tryThingProxy(feedUrl) {
  const url = `https://thingproxy.freeboard.io/fetch/${feedUrl}`;
  const res = await timedFetch(url, {}, 14000);
  if (!res.ok) throw new Error(`thingproxy HTTP ${res.status}`);
  const text = await res.text();
  if (!looksLikeFeed(text)) throw new Error("thingproxy returned non-feed content");
  return parseRSS(text);
}

async function fetchRSSviaProxy(feedUrl) {
  const strategies = [
    ["corsproxy",  () => tryCorsproxy(feedUrl)],
    ["allorigins", () => tryAllOrigins(feedUrl)],
    ["fetchrss",   () => tryFetchRss(feedUrl)],
    ["rss2json",   () => tryRss2Json(feedUrl)],
    ["thingproxy", () => tryThingProxy(feedUrl)],
  ];

  for (const [name, fn] of strategies) {
    try {
      const items = await fn();
      // Only accept if we got actual articles — empty could mean a silent block
      if (items && items.length > 0) {
        if (name !== "corsproxy") console.info(`[feed] ${new URL(feedUrl).hostname} resolved via ${name}`);
        return items;
      }
      console.warn(`[${name}] ${new URL(feedUrl).hostname}: returned 0 items, trying next`);
    } catch (e) {
      console.warn(`[${name}] ${new URL(feedUrl).hostname}: ${e.message}`);
      // Always continue — never let one strategy's exception abort the waterfall
    }
  }

  console.error(`[feed] all 5 strategies failed for ${feedUrl}`);
  return [];
}

function parseRSS(rawText) {
  try {
    if (!rawText || rawText.trim().toLowerCase().startsWith("<!doctype html")) return [];
    const parser = new DOMParser();
    const xml = parser.parseFromString(rawText, "text/xml");
    if (xml.querySelector("parsererror")) return [];

    return Array.from(xml.querySelectorAll("item, entry"))
      .map(el => {
        // <link> in Atom: empty element with href; in RSS: text content
        const linkEl = el.querySelector("link");
        const link = linkEl
          ? (linkEl.getAttribute("href") || linkEl.textContent || "").trim()
          : "";

        const description =
          el.querySelector("description")?.textContent ||
          el.querySelector("summary")?.textContent ||
          el.querySelector("content")?.textContent ||
          "";

        const pubDate =
          el.querySelector("pubDate")?.textContent ||
          el.querySelector("published")?.textContent ||
          el.querySelector("updated")?.textContent ||
          "";

        const title = el.querySelector("title")?.textContent?.trim() || "";
        return { title, link: link.trim(), description: description.trim(), pubDate: pubDate.trim() };
      })
      .filter(item => item.title.length > 0);
  } catch {
    return [];
  }
}

// --- GitHub rule search ---
// Key fix: build q param as a single encoded string (no + inside encodeURIComponent)
async function githubCodeSearch(keywords, repoAndExt) {
  const q = keywords.slice(0, 2).join(" ") + " " + repoAndExt;
  if (!q.trim()) return [];
  try {
    const url = "https://api.github.com/search/code?q=" + encodeURIComponent(q) + "&per_page=3";
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 403) return []; // rate limited
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

async function searchSigmaRules(keywords) {
  return githubCodeSearch(keywords, "repo:SigmaHQ/sigma extension:yml");
}

async function searchYARARules(keywords) {
  return githubCodeSearch(keywords, "repo:Yara-Rules/rules extension:yar");
}

async function fetchRuleContent(htmlUrl) {
  // github.com/user/repo/blob/main/path -> raw.githubusercontent.com/user/repo/main/path
  const raw = htmlUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");
  const res = await fetch(raw, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

// --- UI COMPONENTS (structure unchanged) ---

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
        searchSigmaRules(kws),
        searchYARARules(kws),
      ]);
      setSigmaRules(sigma);
      setYaraRules(yara);
      setLoading(false);
    }
    load();
  }, [article]);

  async function loadContent(item, type) {
    setLoadingContent(true);
    setSelectedRule({ ...item, type });
    try {
      const content = await fetchRuleContent(item.html_url);
      setRuleContent(content);
    } catch (e) {
      setRuleContent(`// Could not load — ${e.message}\n// Check GitHub rate limit or open directly:\n// ${item.html_url}`);
    }
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
  const cleanDesc = defang(article.description || "").slice(0, 220);

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

export default function ThreatFeedPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedFeeds, setLoadedFeeds] = useState(0);
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("week");
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
      } catch {
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
    .filter(a => isWithinTimeframe(a.pubDate, timeframe === "week" ? 7 : 30))
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
      {/* Sidebar */}
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
          <button onClick={() => setShowAllFeeds(p => !p)} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.06)", color: "#6e7681", borderRadius: 6, padding: "5px 0", cursor: "pointer", fontSize: 10, fontFamily: "Fira Code", marginTop: 4 }}>
            {showAllFeeds ? "▲ Show less" : `▼ +${FEEDS.length - 8} more`}
          </button>
        )}
        <div style={{ fontSize: 10, color: "#3d444d", textTransform: "uppercase", letterSpacing: 2, margin: "20px 0 12px", fontFamily: "Fira Code" }}>Stats</div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12 }}>
          {[
            { label: "Total", val: articles.length, color: "#e2e8f0" },
            { label: "High", val: articles.filter(a => a._score >= 70).length, color: "#ff4d6d" },
            { label: "Medium", val: articles.filter(a => a._score >= 40 && a._score < 70).length, color: "#fbbf24" },
            { label: "Sources", val: activeFeeds.length, color: "#00d4ff" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#3d444d", fontFamily: "Fira Code" }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 700, fontFamily: "Fira Code" }}>{s.val}</span>
            </div>
          ))}
          {lastRefresh && <div style={{ fontSize: 10, color: "#1e2d40", fontFamily: "Fira Code", marginTop: 4 }}>↺ {lastRefresh}</div>}
        </div>
      </div>

      {/* Main */}
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#c9d1d9", borderRadius: 8, padding: "8px 14px", fontSize: 12, outline: "none", fontFamily: "Fira Code" }} />
          <div style={{ display: "flex", gap: 4 }}>
            {["all","high","medium","low"].map(v => (
              <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? "rgba(255,77,109,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${filter === v ? "rgba(255,77,109,0.3)" : "rgba(255,255,255,0.06)"}`, color: filter === v ? "#ff4d6d" : "#6e7681", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code", textTransform: "capitalize" }}>{v}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["score","Score"],["date","Date"]].map(([v, label]) => (
              <button key={v} onClick={() => setSortBy(v)} style={{ background: sortBy === v ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${sortBy === v ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.06)"}`, color: sortBy === v ? "#00d4ff" : "#6e7681", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code" }}>{label}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["week","month"].map(v => (
              <button key={v} onClick={() => setTimeframe(v)} style={{ background: timeframe === v ? "rgba(0,153,255,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${timeframe === v ? "rgba(0,153,255,0.3)" : "rgba(255,255,255,0.06)"}`, color: timeframe === v ? "#0099ff" : "#6e7681", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code", textTransform: "capitalize" }}>{v}</button>
            ))}
          </div>
          <button onClick={loadFeeds} disabled={loading} style={{ background: loading ? "rgba(255,255,255,0.02)" : "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "Fira Code" }}>
            {loading ? `⟳ ${loadedFeeds}/${activeFeeds.length}` : "⟳ Refresh"}
          </button>
        </div>
        {loading && articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#3d444d", fontFamily: "Fira Code" }}>⟳ Loading Intel Feeds...</div>
        ) : filtered.length === 0 && !loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#3d444d", fontFamily: "Fira Code" }}>No articles match current filters</div>
        ) : (
          filtered.map((a, i) => <ArticleCard key={i} article={a} source={a._source} />)
        )}
      </div>
    </div>
  );
}
