import { useState } from "react";

const CATEGORIES = [
  {
    id: "static",
    label: "Static Analysis",
    color: "#f5a623",
    icon: "◎",
    desc: "Examine binaries without running them",
    tools: [
      { name: "Ghidra", desc: "NSA's free disassembler and decompiler. The gold standard for free RE. Handles x86, x64, ARM, MIPS.", url: "https://ghidra-sre.org/", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "IDA Free", desc: "The industry-standard disassembler. Free version handles 32-bit x86 and 64-bit x86. Limited but valuable for learning the workflow.", url: "https://hex-rays.com/ida-free/", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "Binary Ninja Cloud", desc: "Free browser-based binary analysis tool. Good decompiler output. No install needed.", url: "https://cloud.binary.ninja/", free: true, platform: "Browser", level: "Useful" },
      { name: "PE-bear", desc: "hasherezade's GUI PE inspector. Best tool for exploring PE headers, imports, sections. Essential companion to Ghidra.", url: "https://github.com/hasherezade/pe-bear", free: true, platform: "Windows", level: "Essential" },
      { name: "PEStudio", desc: "One-click PE analysis — strings, imports, entropy, IOCs. First tool you run on any Windows binary.", url: "https://www.winitor.com/", free: true, platform: "Windows", level: "Essential" },
      { name: "Detect-It-Easy (DIE)", desc: "Identifies packers, protectors, compilers, and linkers. Run it before anything else to understand what you're dealing with.", url: "https://github.com/horsicq/Detect-It-Easy", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "FLOSS", desc: "FLARE Obfuscated String Solver — automatically deobfuscates strings from malware. Mandiant's improved strings.exe.", url: "https://github.com/mandiant/flare-floss", free: true, platform: "Win/Linux", level: "Essential" },
      { name: "CAPA", desc: "Identifies malware capabilities automatically (e.g. 'Creates Registry Key', 'Spawns Process'). MITRE ATT&CK mapping built in.", url: "https://github.com/mandiant/capa", free: true, platform: "Win/Mac/Linux", level: "Essential" },
    ]
  },
  {
    id: "dynamic",
    label: "Dynamic Analysis",
    color: "#ff4d6d",
    icon: "▶",
    desc: "Analyze malware behavior at runtime",
    tools: [
      { name: "x64dbg", desc: "Free, open-source Windows debugger for 32/64-bit. The go-to for malware debugging. Excellent plugin ecosystem.", url: "https://x64dbg.com/", free: true, platform: "Windows", level: "Essential" },
      { name: "WinDbg Preview", desc: "Microsoft's kernel debugger. Required for rootkit analysis and kernel-level malware. Time Travel Debugging is game-changing.", url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/", free: true, platform: "Windows", level: "Advanced" },
      { name: "Process Monitor", desc: "Sysinternals tool. Captures every file, registry, network, and process activity in real time. First tool running in any dynamic analysis session.", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon", free: true, platform: "Windows", level: "Essential" },
      { name: "Process Hacker 2", desc: "Advanced process explorer. Shows memory maps, handles, DLLs, threads, and network connections per process. Essential for injection detection.", url: "https://processhacker.sourceforge.io/", free: true, platform: "Windows", level: "Essential" },
      { name: "Autoruns", desc: "Sysinternals. Shows every persistence mechanism on a Windows system. Run before and after malware execution to diff changes.", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns", free: true, platform: "Windows", level: "Essential" },
      { name: "Wireshark", desc: "The standard for network traffic capture and analysis. Captures C2 traffic, identifies protocols, extracts transferred files.", url: "https://www.wireshark.org/", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "ANY.RUN", desc: "Interactive online sandbox. Watch malware execute in real time. Free tier available. Excellent for quick triage.", url: "https://app.any.run/", free: true, platform: "Browser", level: "Essential" },
      { name: "FlareVM", desc: "Mandiant's Windows malware analysis VM setup script. Installs all the tools you need in one go.", url: "https://github.com/mandiant/flare-vm", free: true, platform: "Windows", level: "Setup" },
    ]
  },
  {
    id: "intel",
    label: "Threat Intelligence",
    color: "#0099ff",
    icon: "⬡",
    desc: "IOC lookup, intel gathering, attribution",
    tools: [
      { name: "VirusTotal", desc: "Multi-engine scan + IOC relationships. Pivoting from hash → domains → IPs → other samples is essential for attribution.", url: "https://www.virustotal.com/", free: true, platform: "Browser", level: "Essential" },
      { name: "MalwareBazaar", desc: "Free malware sample download with IOCs, tags, and YARA matches. Best place to get real samples to practice on.", url: "https://bazaar.abuse.ch/", free: true, platform: "Browser", level: "Essential" },
      { name: "URLScan.io", desc: "Scans URLs and captures screenshots, DOM, network requests. Great for phishing analysis and C2 infrastructure mapping.", url: "https://urlscan.io/", free: true, platform: "Browser", level: "Essential" },
      { name: "Shodan", desc: "Search engine for internet-connected devices. Pivoting on IP/banner to find C2 infrastructure. Free tier available.", url: "https://www.shodan.io/", free: true, platform: "Browser", level: "Useful" },
      { name: "MITRE ATT&CK Navigator", desc: "Map TTPs to the ATT&CK matrix. Visualize coverage, compare threat actors, build detection priority lists.", url: "https://mitre-attack.github.io/attack-navigator/", free: true, platform: "Browser", level: "Essential" },
      { name: "OTX AlienVault", desc: "Free threat intelligence platform. Community IOC sharing, threat actor profiles, and automated pulse feeds.", url: "https://otx.alienvault.com/", free: true, platform: "Browser", level: "Useful" },
      { name: "Malpedia", desc: "Malware family knowledge base. Searchable database of malware names, related samples, actors, and analysis references.", url: "https://malpedia.caad.fkie.fraunhofer.de/", free: true, platform: "Browser", level: "Useful" },
    ]
  },
  {
    id: "detection",
    label: "Detection & Hunting",
    color: "#00ff9d",
    icon: "◈",
    desc: "Write rules, hunt threats, detect malware",
    tools: [
      { name: "YARA", desc: "Pattern matching for malware detection. Write rules against byte patterns, strings, PE metadata. The foundation of file-based detection.", url: "https://github.com/VirusTotal/yara", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "Sigma CLI", desc: "Compile Sigma rules to Splunk, Elastic, Chronicle, and other SIEM queries. sigma-cli is the modern converter.", url: "https://github.com/SigmaHQ/sigma-cli", free: true, platform: "Win/Mac/Linux", level: "Essential" },
      { name: "Yara-Rules Repository", desc: "1000+ community YARA rules. Read and study these to learn how to write your own. Cover all major malware families.", url: "https://github.com/Yara-Rules/rules", free: true, platform: "GitHub", level: "Reference" },
      { name: "SigmaHQ Repository", desc: "The canonical Sigma rule repository. Reference implementation of detection logic for every major ATT&CK technique.", url: "https://github.com/SigmaHQ/sigma", free: true, platform: "GitHub", level: "Reference" },
      { name: "Volatility 3", desc: "Memory forensics framework. Extract artifacts from memory dumps: process lists, injected DLLs, Cobalt Strike configs, network connections.", url: "https://github.com/volatilityfoundation/volatility3", free: true, platform: "Win/Mac/Linux", level: "Advanced" },
      { name: "Zeek", desc: "Network security monitor. Converts packet captures into structured logs suitable for threat hunting and detection rule development.", url: "https://zeek.org/", free: true, platform: "Linux/Mac", level: "Advanced" },
    ]
  },
  {
    id: "practice",
    label: "Practice & Labs",
    color: "#c084fc",
    icon: "✦",
    desc: "Challenges, wargames, and training labs",
    tools: [
      { name: "crackmes.one", desc: "Community-maintained repository of RE challenges at all difficulty levels. Best place to practice reversing after learning Ghidra basics.", url: "https://crackmes.one/", free: true, platform: "Browser", level: "Beginner+" },
      { name: "pwn.college", desc: "ASU's free structured hacking education platform. RE and binary exploitation modules with progressive difficulty.", url: "https://pwn.college/", free: true, platform: "Browser", level: "Structured" },
      { name: "Malware Traffic Analysis", desc: "Brad Duncan's archive of real-world PCAP files from malware infections. Download and analyze with Wireshark and Zeek.", url: "https://www.malware-traffic-analysis.net/", free: true, platform: "Browser", level: "Intermediate+" },
      { name: "OpenSecurityTraining2", desc: "University-level security courses taught by practitioners. x86, kernel, RE, and more. Completely free.", url: "https://p.ost2.fyi/", free: true, platform: "Browser", level: "All levels" },
      { name: "HackTheBox", desc: "CTF-style machines and RE challenges. Free tier available. Reversing challenges are excellent for practicing Ghidra workflow.", url: "https://www.hackthebox.com/", free: true, platform: "Browser", level: "Intermediate+" },
      { name: "Malware Unicorn Workshops", desc: "Amanda Rousseau's free workshop materials from DEF CON and Black Hat. Downloadable slides, samples, and writeups.", url: "https://malwareunicorn.org/workshops.html", free: true, platform: "Browser", level: "Beginner+" },
    ]
  },
];

const LEVEL_COLORS = {
  "Essential": "#00ff9d",
  "Useful": "#0099ff",
  "Advanced": "#f5a623",
  "Setup": "#c084fc",
  "Reference": "#6e7681",
  "Beginner+": "#00ff9d",
  "Intermediate+": "#f5a623",
  "Structured": "#0099ff",
  "All levels": "#c084fc",
};

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("static");
  const [freeOnly, setFreeOnly] = useState(false);

  const cat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#3d444d", marginBottom: 8 }}>ANALYST TOOLKIT</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "Syne", margin: "0 0 10px", color: "#e6edf3" }}>
          The <span style={{ color: "#f5a623" }}>Tools Arsenal</span>
        </h1>
        <p style={{ color: "#6e7681", fontSize: 13, maxWidth: 560, lineHeight: 1.7, fontFamily: "Syne", margin: 0 }}>
          Every tool listed here is used by professional analysts. Essential tools are what you'll use daily. All are free.
        </p>
      </div>

      {/* Category tabs + filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
              background: activeCategory === c.id ? `${c.color}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeCategory === c.id ? c.color + "50" : "rgba(255,255,255,0.06)"}`,
              color: activeCategory === c.id ? c.color : "#6e7681",
              padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              fontSize: 11, fontWeight: 600, fontFamily: "Fira Code",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category description */}
      {cat && (
        <div style={{ marginBottom: 20, padding: "10px 14px", background: `${cat.color}08`, border: `1px solid ${cat.color}20`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, filter: `drop-shadow(0 0 6px ${cat.color})` }}>{cat.icon}</span>
          <span style={{ fontSize: 12, color: "#8b949e", fontFamily: "Syne" }}>{cat.desc}</span>
        </div>
      )}

      {/* Tools grid */}
      {cat && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {cat.tools.map((t, i) => (
            <a key={i} href={t.url} target="_blank" rel="noreferrer" style={{
              display: "flex", flexDirection: "column", gap: 10,
              padding: 16, background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}40`; e.currentTarget.style.background = `${cat.color}06`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", fontFamily: "Syne" }}>{t.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: LEVEL_COLORS[t.level] || "#6e7681",
                  background: `${LEVEL_COLORS[t.level] || "#6e7681"}15`,
                  border: `1px solid ${LEVEL_COLORS[t.level] || "#6e7681"}30`,
                  borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap",
                }}>{t.level}</span>
              </div>
              <p style={{ fontSize: 12, color: "#8b949e", margin: 0, lineHeight: 1.6, flex: 1, fontFamily: "Syne" }}>{t.desc}</p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#00ff9d", background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.2)", borderRadius: 3, padding: "1px 6px" }}>FREE</span>
                <span style={{ fontSize: 10, color: "#6e7681", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, padding: "1px 6px" }}>{t.platform}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: cat.color, fontFamily: "Fira Code" }}>↗</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Setup note */}
      <div style={{ marginTop: 32, padding: 20, background: "rgba(0,255,157,0.03)", border: "1px solid rgba(0,255,157,0.1)", borderRadius: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#00ff9d", marginBottom: 8, fontFamily: "Fira Code" }}>◈ SETUP RECOMMENDATION</div>
        <p style={{ fontSize: 12, color: "#6e7681", margin: "0 0 8px", lineHeight: 1.7, fontFamily: "Syne" }}>
          Don't install everything at once. Start with <strong style={{ color: "#e6edf3" }}>FlareVM</strong> to get a preconfigured Windows analysis environment, then add tools as you need them.
        </p>
        <p style={{ fontSize: 12, color: "#6e7681", margin: 0, lineHeight: 1.7, fontFamily: "Syne" }}>
          Your core toolkit for 90% of work: <strong style={{ color: "#e6edf3" }}>Ghidra + x64dbg + PEStudio + Process Monitor + Wireshark + ANY.RUN</strong>. Master these before adding more.
        </p>
      </div>
    </div>
  );
}
