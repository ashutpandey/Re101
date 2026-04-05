import { useState } from "react";

const PEOPLE = [
  {
    handle: "@vxunderground",
    name: "vx-underground",
    desc: "Largest public malware sample archive on the planet. First to publish threat actor statements, sample drops, and intelligence. Follow for raw, unfiltered threat news.",
    url: "https://x.com/vxunderground",
    tag: "Malware Intel",
    why: "They receive direct contact from ransomware groups. Indispensable.",
  },
  {
    handle: "@GossiTheDog",
    name: "Kevin Beaumont",
    desc: "Ex-Microsoft, runs DoubleParsar.com. First responder on almost every major CVE exploitation wave. Incredibly direct, technically deep, and zero tolerance for vendor spin.",
    url: "https://x.com/GossiTheDog",
    tag: "Threat Intel",
    why: "If something is being exploited in the wild right now, he'll say it first.",
  },
  {
    handle: "@hasherezade",
    name: "hasherezade",
    desc: "Malware researcher at Malwarebytes. Publishes detailed RE write-ups, builds free tools (PE-bear, hollows_hunter), and explains complex techniques clearly. One of the best educators in RE.",
    url: "https://x.com/hasherezade",
    tag: "Malware RE",
    why: "Her PE-bear tool and blog posts are used by thousands of analysts worldwide.",
  },
  {
    handle: "@OALabs",
    name: "OALabs",
    desc: "The best YouTube channel for practical malware analysis. Step-by-step walkthroughs of real malware using Ghidra, x64dbg, and custom Python scripts. Free and consistently excellent.",
    url: "https://x.com/OALabs",
    tag: "RE / Analysis",
    why: "Start here for hands-on RE learning. Watch them analyze real samples.",
  },
  {
    handle: "@DFIRReport",
    name: "The DFIR Report",
    desc: "Publishes full attack chain walkthroughs — from initial access through ransomware deployment — with IOCs, Sigma/YARA rules, and ATT&CK mapping. Every post is pure signal.",
    url: "https://x.com/TheDFIRReport",
    tag: "DFIR / Detection",
    why: "One DFIR Report post teaches you more than a week of reading books.",
  },
  {
    handle: "@cglyer",
    name: "Chris Glyer",
    desc: "Microsoft Threat Intel. Crimeware and ransomware specialist. Tracks ransomware group activity, affiliate infrastructure, and TTP evolution. Deep research, credible sources.",
    url: "https://x.com/cglyer",
    tag: "Ransomware",
    why: "Ransomware tracking and attribution at the highest level.",
  },
  {
    handle: "@0xdf",
    name: "0xdf",
    desc: "Publishes incredibly detailed HackTheBox walkthroughs and CTF write-ups. Each post teaches a specific technique — RE, forensics, web, binary exploitation — with clear explanations.",
    url: "https://x.com/0xdf_",
    tag: "CTF / RE",
    why: "His write-ups are a masterclass in methodical binary analysis.",
  },
  {
    handle: "@billyleonard",
    name: "Billy Leonard",
    desc: "Google Threat Analysis Group. Nation-state threat tracking — Russian, North Korean, Iranian APT campaigns. One of the most credible public APT analysts.",
    url: "https://x.com/billyleonard",
    tag: "APT / Nation State",
    why: "Primary source on state-sponsored cyber operations.",
  },
  {
    handle: "@malwrhunterteam",
    name: "MalwareHunterTeam",
    desc: "Dedicated to hunting and identifying new malware families. Tracks ransomware operations, publishes decryptors, and shares IOCs in real time. Active daily.",
    url: "https://x.com/malwrhunterteam",
    tag: "Malware Intel",
    why: "Fastest team to identify new ransomware variants and publish IOCs.",
  },
  {
    handle: "@FlorianRoth",
    name: "Florian Roth",
    desc: "Author of THOR scanner, creator of Sigma detection rules, prolific YARA rule writer. If you care about detection engineering, every post is worth reading.",
    url: "https://x.com/cyb3rops",
    tag: "Detection Eng",
    why: "The most prolific detection rule author alive. Learn from his methodology.",
  },
  {
    handle: "@briankrebs",
    name: "Brian Krebs",
    desc: "Investigative journalist. Uncovers cybercrime operations, ransomware gang finances, and breach details the industry ignores. No vendor agenda, follows the money.",
    url: "https://x.com/briankrebs",
    tag: "Threat News",
    why: "The best investigative journalism in cybersecurity, period.",
  },
  {
    handle: "@mikko",
    name: "Mikko Hyppönen",
    desc: "CRO at F-Secure. 30+ years of malware research. OG of the industry. Broad perspective on the threat landscape, nation-state malware, and the history of computer viruses.",
    url: "https://x.com/mikko",
    tag: "Threat Intel",
    why: "Rare combination of deep history + current relevance.",
  },
];

const BLOGS = [
  {
    name: "The DFIR Report",
    url: "https://thedfirreport.com/",
    color: "#ff4d6d",
    desc: "Full attack chain walkthroughs. Each post covers Initial Access → Impact with IOCs, screenshots, Sigma rules, and timeline. Essential weekly reading.",
    freq: "Weekly",
  },
  {
    name: "Elastic Security Labs",
    url: "https://www.elastic.co/security-labs",
    color: "#0099ff",
    desc: "Technical malware analysis from a team that sees enterprise telemetry. Deep dives on malware families, detections, and intrusion campaigns.",
    freq: "Bi-weekly",
  },
  {
    name: "Malware Traffic Analysis",
    url: "https://www.malware-traffic-analysis.net/",
    color: "#f5a623",
    desc: "Brad Duncan's archive of real-world PCAP files with writeups. Best free resource for network forensics practice. Download the PCAPs and analyze yourself.",
    freq: "Weekly",
  },
  {
    name: "vx-underground Papers",
    url: "https://vx-underground.org/",
    color: "#c084fc",
    desc: "Archive of malware source code, papers, and academic research. Overwhelming in scope — use it as a reference library, not a reading list.",
    freq: "Ongoing",
  },
  {
    name: "Malwarebytes Labs",
    url: "https://www.malwarebytes.com/blog/threat-intelligence",
    color: "#00ff9d",
    desc: "Threat intelligence blog from a major AV vendor. Good mix of technical depth and accessible writing. hasherezade publishes here.",
    freq: "Weekly",
  },
  {
    name: "Mandiant Blog",
    url: "https://www.mandiant.com/resources/blog",
    color: "#34d399",
    desc: "Nation-state APT research, incident response learnings, and malware analysis from the company that coined the term APT. High prestige, high quality.",
    freq: "Weekly",
  },
  {
    name: "Unit 42 (Palo Alto)",
    url: "https://unit42.paloaltonetworks.com/",
    color: "#ff6b35",
    desc: "Threat intel and malware analysis from Palo Alto Networks' research team. Strong on C2 infrastructure analysis and threat actor profiling.",
    freq: "Weekly",
  },
  {
    name: "Recorded Future Blog",
    url: "https://www.recordedfuture.com/research",
    color: "#6ee7b7",
    desc: "Strategic and technical threat intelligence. Good for understanding threat actor motivations, geopolitical context, and emerging campaigns.",
    freq: "Weekly",
  },
  {
    name: "SANS Internet Storm Center",
    url: "https://isc.sans.edu/",
    color: "#fbbf24",
    desc: "Daily diaries from security practitioners worldwide. Quick technical notes on emerging threats, unusual malware behavior, and network anomalies.",
    freq: "Daily",
  },
  {
    name: "Malware Unicorn",
    url: "https://malwareunicorn.org/",
    color: "#f87171",
    desc: "Amanda Rousseau's workshops and tutorials on malware analysis and RE. Free workshop materials used at DEF CON and Black Hat.",
    freq: "Occasional",
  },
];

const REDDITS = [
  { name: "r/ReverseEngineering", url: "https://reddit.com/r/ReverseEngineering", desc: "High quality posts on binary RE, tools, and research papers. Low noise.", tag: "RE", members: "~70k" },
  { name: "r/Malware", url: "https://reddit.com/r/Malware", desc: "Malware identification, reports, sandbox results, and IOC sharing.", tag: "Malware", members: "~60k" },
  { name: "r/blueteamsec", url: "https://reddit.com/r/blueteamsec", desc: "Technical detection engineering. High-quality curated links.", tag: "Detection", members: "~95k" },
  { name: "r/netsec", url: "https://reddit.com/r/netsec", desc: "Curated security research. Strict quality bar. No beginner questions.", tag: "Research", members: "~440k" },
  { name: "r/MalwareResearch", url: "https://reddit.com/r/MalwareResearch", desc: "Community specifically for malware researchers and analysts.", tag: "RE", members: "~15k" },
  { name: "r/threatintel", url: "https://reddit.com/r/threatintel", desc: "IOC sharing, strategic threat analysis, and intel community discussion.", tag: "Intel", members: "~30k" },
];

const DISCORD = [
  { name: "Malware Analysis & Reverse Engineering", desc: "OALabs community. Active channels for RE help, tool discussion, and sample sharing. Best beginner-friendly RE Discord.", url: "https://discord.gg/oalabs", tag: "RE" },
  { name: "The DFIR Report Community", desc: "DFIR practitioners sharing detection notes, playbooks, and incident response experience.", url: "https://discord.gg/dfirreport", tag: "DFIR" },
  { name: "Hack The Box", desc: "Active community around RE challenges, binary exploitation, and CTF coordination.", url: "https://discord.gg/hackthebox", tag: "CTF" },
  { name: "pwn.college Discord", desc: "Community for the pwn.college learning platform. Ask questions, get mentorship on RE labs.", url: "https://pwn.college/discord", tag: "Learning" },
  { name: "OpenSecurityTraining2", desc: "Community for OST2 courses. Get help on kernel internals, RE, and x86 assembly courses.", url: "https://discord.gg/ost2", tag: "RE" },
];

const TAG_COLORS = {
  "Malware Intel": "#ff4d6d", "Threat Intel": "#0099ff", "Detection Eng": "#00ff9d",
  "Ransomware": "#f5a623", "APT / Nation State": "#c084fc", "RE / Analysis": "#f5a623",
  "Malware RE": "#ff4d6d", "DFIR / Detection": "#0099ff", "Threat News": "#8b949e",
  "CTF / RE": "#00ff9d", "RE": "#f5a623", "Detection": "#00ff9d", "Malware": "#ff4d6d",
  "Research": "#6ee7b7", "Intel": "#0099ff", "DFIR": "#0099ff", "CTF": "#c084fc",
  "Learning": "#00ff9d",
};

function Tag({ label }) {
  const color = TAG_COLORS[label] || "#6e7681";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

const SECTIONS = ["People", "Blogs", "Reddit", "Discord"];

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState("People");

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#3d444d", marginBottom: 8 }}>COMMUNITY & RESOURCES</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "Syne", margin: "0 0 10px", color: "#e6edf3" }}>
          The <span style={{ color: "#0099ff" }}>Best People</span> & Places
        </h1>
        <p style={{ color: "#6e7681", fontSize: 13, maxWidth: 540, lineHeight: 1.7, fontFamily: "Syne", margin: 0 }}>
          Who to follow, what to read, where to ask questions. Curated by quality, not quantity.
        </p>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 0 }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)} style={{
            background: "none", border: "none",
            borderBottom: `2px solid ${activeSection === s ? "#0099ff" : "transparent"}`,
            color: activeSection === s ? "#0099ff" : "#6e7681",
            padding: "8px 18px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            fontFamily: "Fira Code", letterSpacing: 0.5, transition: "all 0.2s",
          }}>{s}</button>
        ))}
      </div>

      {/* People */}
      {activeSection === "People" && (
        <div>
          <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
            These are the researchers, analysts, and journalists doing the most important public work. Follow all of them on X/Twitter.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {PEOPLE.map((p, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${TAG_COLORS[p.tag] || "#6e7681"}40`; e.currentTarget.style.background = `${TAG_COLORS[p.tag] || "#6e7681"}06`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", fontFamily: "Syne", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#3d444d", fontFamily: "Fira Code" }}>{p.handle}</div>
                  </div>
                  <Tag label={p.tag} />
                </div>
                <p style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.6, margin: 0, fontFamily: "Syne" }}>{p.desc}</p>
                <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6 }}>
                  <span style={{ fontSize: 10, color: "#00ff9d", fontWeight: 700 }}>WHY FOLLOW: </span>
                  <span style={{ fontSize: 11, color: "#6e7681", fontFamily: "Syne" }}>{p.why}</span>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 11, color: "#0099ff", textDecoration: "none",
                  background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.2)",
                  borderRadius: 6, padding: "5px 10px", fontWeight: 600, fontFamily: "Fira Code",
                }}>
                  Follow on X ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blogs */}
      {activeSection === "Blogs" && (
        <div>
          <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
            These are the blogs worth reading regularly. Subscribe via RSS or check weekly. Quality over volume.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BLOGS.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 18px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${b.color}`,
                borderRadius: "0 10px 10px 0", textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${b.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: b.color, fontFamily: "Syne" }}>{b.name}</span>
                    <span style={{ fontSize: 10, color: "#6e7681", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 7px" }}>{b.freq}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#8b949e", margin: 0, lineHeight: 1.6, fontFamily: "Syne" }}>{b.desc}</p>
                </div>
                <span style={{ fontSize: 16, color: "#3d444d" }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Reddit */}
      {activeSection === "Reddit" && (
        <div>
          <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
            Best subreddits for the field. Use these for staying updated and asking questions once you have some foundation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {REDDITS.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{
                display: "block", padding: 16,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${TAG_COLORS[r.tag] || "#6e7681"}40`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", fontFamily: "Syne" }}>{r.name}</span>
                  <Tag label={r.tag} />
                </div>
                <p style={{ fontSize: 12, color: "#8b949e", margin: "0 0 8px", lineHeight: 1.6, fontFamily: "Syne" }}>{r.desc}</p>
                <div style={{ fontSize: 10, color: "#3d444d", fontFamily: "Fira Code" }}>{r.members} members</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Discord */}
      {activeSection === "Discord" && (
        <div>
          <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
            Discord is where the real-time community happens. These are the most useful servers for learning and getting help.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DISCORD.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 18px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(88,101,242,0.4)"; e.currentTarget.style.background = "rgba(88,101,242,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ width: 36, height: 36, background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  ⟁
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", fontFamily: "Syne" }}>{d.name}</span>
                    <Tag label={d.tag} />
                  </div>
                  <p style={{ fontSize: 12, color: "#8b949e", margin: 0, lineHeight: 1.5, fontFamily: "Syne" }}>{d.desc}</p>
                </div>
                <span style={{ fontSize: 12, color: "#5865f2", fontWeight: 600, fontFamily: "Fira Code", whiteSpace: "nowrap" }}>Join ↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
