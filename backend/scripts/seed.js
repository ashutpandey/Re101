const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const Person = require('../models/Person');
const Blog = require('../models/Blog');
const Community = require('../models/Community');
require('dotenv').config();

const toolsData = [
  // Static Analysis Tools
  {
    name: "Ghidra",
    desc: "NSA's free disassembler and decompiler. The gold standard for free RE. Handles x86, x64, ARM, MIPS.",
    url: "https://ghidra-sre.org/",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["analyzeHeadless", "ghidraRun"],
    automationScripts: "Ghidra scripts for automated analysis",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "IDA Free",
    desc: "The industry-standard disassembler. Free version handles 32-bit x86 and 64-bit x86. Limited but valuable for learning the workflow.",
    url: "https://hex-rays.com/ida-free/",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["ida64", "idat64"],
    automationScripts: "IDAPython scripts",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "Binary Ninja Cloud",
    desc: "Free browser-based binary analysis tool. Good decompiler output. No install needed.",
    url: "https://cloud.binary.ninja/",
    free: true,
    platform: "Browser",
    level: "Useful",
    commonCommands: ["N/A"],
    automationScripts: "Python API for automation",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "PE-bear",
    desc: "hasherezade's GUI PE inspector. Best tool for exploring PE headers, imports, sections. Essential companion to Ghidra.",
    url: "https://github.com/hasherezade/pe-bear",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["pebear.exe"],
    automationScripts: "N/A",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "PEStudio",
    desc: "One-click PE analysis — strings, imports, entropy, IOCs. First tool you run on any Windows binary.",
    url: "https://www.winitor.com/",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["pestudio.exe"],
    automationScripts: "N/A",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "Detect-It-Easy (DIE)",
    desc: "Identifies packers, protectors, compilers, and linkers. Run it before anything else to understand what you're dealing with.",
    url: "https://github.com/horsicq/Detect-It-Easy",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["die.exe"],
    automationScripts: "N/A",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "FLOSS",
    desc: "FLARE Obfuscated String Solver — automatically deobfuscates strings from malware. Mandiant's improved strings.exe.",
    url: "https://github.com/mandiant/flare-floss",
    free: true,
    platform: "Win/Linux",
    level: "Essential",
    commonCommands: ["floss"],
    automationScripts: "Python API",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "CAPA",
    desc: "Identifies malware capabilities automatically (e.g. 'Creates Registry Key', 'Spawns Process'). MITRE ATT&CK mapping built in.",
    url: "https://github.com/mandiant/capa",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["capa"],
    automationScripts: "Python scripts for rule matching",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "Cutter",
    desc: "GUI for radare2. Modern interface for reverse engineering with graph view, hex editor, and scripting support.",
    url: "https://cutter.re/",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["cutter"],
    automationScripts: "r2pipe for Python automation",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  {
    name: "Radare2",
    desc: "Command-line reverse engineering framework. Extremely powerful but steep learning curve. Cutter provides GUI.",
    url: "https://rada.re/r/",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Advanced",
    commonCommands: ["r2", "rabin2", "ragg2"],
    automationScripts: "r2pipe, r2frida for instrumentation",
    category: "static",
    categoryLabel: "Static Analysis",
    categoryColor: "#f5a623",
    categoryIcon: "◎",
    categoryDesc: "Examine binaries without running them"
  },
  // Dynamic Analysis Tools
  {
    name: "x64dbg",
    desc: "Free, open-source Windows debugger for 32/64-bit. The go-to for malware debugging. Excellent plugin ecosystem.",
    url: "https://x64dbg.com/",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["x64dbg.exe", "x32dbg.exe"],
    automationScripts: "x64dbgpy for Python scripting",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "WinDbg Preview",
    desc: "Microsoft's kernel debugger. Required for rootkit analysis and kernel-level malware. Time Travel Debugging is game-changing.",
    url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/",
    free: true,
    platform: "Windows",
    level: "Advanced",
    commonCommands: ["windbg.exe"],
    automationScripts: "WinDbg scripting language",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "Process Monitor",
    desc: "Sysinternals tool. Captures every file, registry, network, and process activity in real time. First tool running in any dynamic analysis session.",
    url: "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["procmon.exe"],
    automationScripts: "N/A",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "Process Hacker 2",
    desc: "Advanced process explorer. Shows memory maps, handles, DLLs, threads, and network connections per process. Essential for injection detection.",
    url: "https://processhacker.sourceforge.io/",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["ProcessHacker.exe"],
    automationScripts: "N/A",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "Autoruns",
    desc: "Sysinternals. Shows every persistence mechanism on a Windows system. Run before and after malware execution to diff changes.",
    url: "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["autoruns.exe"],
    automationScripts: "N/A",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "Wireshark",
    desc: "The standard for network traffic capture and analysis. Captures C2 traffic, identifies protocols, extracts transferred files.",
    url: "https://www.wireshark.org/",
    free: true,
    platform: "Win/Mac/Linux",
    level: "Essential",
    commonCommands: ["wireshark", "tshark"],
    automationScripts: "tshark for automated capture, pyshark for Python",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "ANY.RUN",
    desc: "Interactive online sandbox. Watch malware execute in real time. Free tier available. Excellent for quick triage.",
    url: "https://app.any.run/",
    free: true,
    platform: "Browser",
    level: "Essential",
    commonCommands: ["N/A"],
    automationScripts: "API for automated submissions",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "FlareVM",
    desc: "Mandiant's Windows malware analysis VM setup script. Installs all the tools you need in one go.",
    url: "https://github.com/mandiant/flare-vm",
    free: true,
    platform: "Windows",
    level: "Setup",
    commonCommands: ["flarevm.installer.exe"],
    automationScripts: "PowerShell scripts",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "Noriben",
    desc: "Sandbox automation script. Runs malware in isolated environment, captures all activity (processes, files, network). Generates comprehensive report.",
    url: "https://github.com/Rurik/Noriben",
    free: true,
    platform: "Windows",
    level: "Essential",
    commonCommands: ["noriben.py"],
    automationScripts: "Python script for automated sandboxing",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  },
  {
    name: "FakeNet-NG",
    desc: "Network simulation tool for malware analysis. Responds to all network requests with fake data to trick malware into revealing behavior.",
    url: "https://github.com/mandiant/flare-fakenet-ng",
    free: true,
    platform: "Windows",
    level: "Useful",
    commonCommands: ["fakenet.exe"],
    automationScripts: "Python for custom listeners",
    category: "dynamic",
    categoryLabel: "Dynamic Analysis",
    categoryColor: "#ff4d6d",
    categoryIcon: "▶",
    categoryDesc: "Analyze malware behavior at runtime"
  }
];

const peopleData = [
  {
    handle: "@vxunderground",
    name: "vx-underground",
    desc: "Largest public malware sample archive on the planet. First to publish threat actor statements, sample drops, and intelligence. Follow for raw, unfiltered threat news.",
    url: "https://x.com/vxunderground",
    tag: "Malware Intel",
    why: "They receive direct contact from ransomware groups. Indispensable.",
    blogs: ["vx-underground.org"],
    bestWork: "Malware sample archive and threat actor communications"
  },
  {
    handle: "@GossiTheDog",
    name: "Kevin Beaumont",
    desc: "Ex-Microsoft, runs DoubleParsar.com. First responder on almost every major CVE exploitation wave. Incredibly direct, technically deep, and zero tolerance for vendor spin.",
    url: "https://x.com/GossiTheDog",
    tag: "Threat Intel",
    why: "If something is being exploited in the wild right now, he'll say it first.",
    blogs: ["doublepulsar.com"],
    bestWork: "Real-time CVE exploitation tracking and analysis"
  },
  {
    handle: "@hasherezade",
    name: "hasherezade",
    desc: "Malware researcher at Malwarebytes. Publishes detailed RE write-ups, builds free tools (PE-bear, hollows_hunter), and explains complex techniques clearly. One of the best educators in RE.",
    url: "https://x.com/hasherezade",
    tag: "Malware RE",
    why: "Her PE-bear tool and blog posts are used by thousands of analysts worldwide.",
    blogs: ["hshrzd.wordpress.com"],
    bestWork: "PE-bear tool and malware unpacking tutorials"
  },
  {
    handle: "@OALabs",
    name: "OALabs",
    desc: "The best YouTube channel for practical malware analysis. Step-by-step walkthroughs of real malware using Ghidra, x64dbg, and custom Python scripts. Free and consistently excellent.",
    url: "https://x.com/OALabs",
    tag: "RE / Analysis",
    why: "Start here for hands-on RE learning. Watch them analyze real samples.",
    blogs: ["www.youtube.com/c/OALabs"],
    bestWork: "Malware analysis video tutorials and Ghidra scripts"
  },
  {
    handle: "@DFIRReport",
    name: "The DFIR Report",
    desc: "Publishes full attack chain walkthroughs — from initial access through ransomware deployment — with IOCs, Sigma/YARA rules, and ATT&CK mapping. Every post is pure signal.",
    url: "https://x.com/TheDFIRReport",
    tag: "DFIR / Detection",
    why: "One DFIR Report post teaches you more than a week of reading books.",
    blogs: ["thedfirreport.com"],
    bestWork: "Comprehensive ransomware attack chain analyses"
  },
  {
    handle: "@cglyer",
    name: "Chris Glyer",
    desc: "Microsoft Threat Intel. Crimeware and ransomware specialist. Tracks ransomware group activity, affiliate infrastructure, and TTP evolution. Deep research, credible sources.",
    url: "https://x.com/cglyer",
    tag: "Ransomware",
    why: "Ransomware tracking and attribution at the highest level.",
    blogs: ["Microsoft Security Blog"],
    bestWork: "Ransomware group infrastructure mapping"
  },
  {
    handle: "@0xdf",
    name: "0xdf",
    desc: "Publishes incredibly detailed HackTheBox walkthroughs and CTF write-ups. Each post teaches a specific technique — RE, forensics, web, binary exploitation — with clear explanations.",
    url: "https://x.com/0xdf_",
    tag: "CTF / RE",
    why: "His write-ups are a masterclass in methodical binary analysis.",
    blogs: ["0xdf.gitlab.io"],
    bestWork: "HackTheBox challenge write-ups and binary exploitation guides"
  },
  {
    handle: "@billyleonard",
    name: "Billy Leonard",
    desc: "Google Threat Analysis Group. Nation-state threat tracking — Russian, North Korean, Iranian APT campaigns. One of the most credible public APT analysts.",
    url: "https://x.com/billyleonard",
    tag: "APT / Nation State",
    why: "Primary source on state-sponsored cyber operations.",
    blogs: ["Google Security Blog"],
    bestWork: "APT campaign analysis and nation-state attribution"
  },
  {
    handle: "@malwrhunterteam",
    name: "MalwareHunterTeam",
    desc: "Dedicated to hunting and identifying new malware families. Tracks ransomware operations, publishes decryptors, and shares IOCs in real time. Active daily.",
    url: "https://x.com/malwrhunterteam",
    tag: "Malware Intel",
    why: "Fastest team to identify new ransomware variants and publish IOCs.",
    blogs: ["malwarehunterteam.com"],
    bestWork: "Ransomware decryptors and real-time IOC sharing"
  },
  {
    handle: "@FlorianRoth",
    name: "Florian Roth",
    desc: "Author of THOR scanner, creator of Sigma detection rules, prolific YARA rule writer. If you care about detection engineering, every post is worth reading.",
    url: "https://x.com/cyb3rops",
    tag: "Detection Eng",
    why: "The most prolific detection rule author alive. Learn from his methodology.",
    blogs: ["github.com/SigmaHQ/sigma"],
    bestWork: "Sigma detection rules and THOR scanner"
  },
  {
    handle: "@briankrebs",
    name: "Brian Krebs",
    desc: "Investigative journalist. Uncovers cybercrime operations, ransomware gang finances, and breach details the industry ignores. No vendor agenda, follows the money.",
    url: "https://x.com/briankrebs",
    tag: "Threat News",
    why: "The best investigative journalism in cybersecurity, period.",
    blogs: ["krebsonsecurity.com"],
    bestWork: "Cybercrime financial investigations"
  },
  {
    handle: "@mikko",
    name: "Mikko Hyppönen",
    desc: "CRO at F-Secure. 30+ years of malware research. OG of the industry. Broad perspective on the threat landscape, nation-state malware, and the history of computer viruses.",
    url: "https://x.com/mikko",
    tag: "Threat Intel",
    why: "Rare combination of deep history + current relevance.",
    blogs: ["blog.f-secure.com"],
    bestWork: "Historical malware analysis and threat landscape overview"
  },
  {
    handle: "@VK_Intel",
    name: "Vasile Kinds (VK Intel)",
    desc: "Independent threat researcher. Tracks crimeware, phishing infrastructure, and dark web actor activity. Fast, accurate, and always sourced.",
    url: "https://x.com/VK_Intel",
    tag: "Malware Intel",
    why: "One of the fastest independent IOC publishers. Essential for crimeware tracking.",
    blogs: ["vk-intel.com"],
    bestWork: "Crimeware infrastructure tracking"
  },
  {
    handle: "@AltShiftPrtScn",
    name: "Greg Lesnewich",
    desc: "Threat researcher at Recorded Future. Focuses on North Korean APT activity (Lazarus, Kimsuky) and DPRK intrusion campaigns. Publishes detailed technical threads.",
    url: "https://x.com/AltShiftPrtScn",
    tag: "APT / Nation State",
    why: "Best public analyst for DPRK/Lazarus Group activity.",
    blogs: ["recordedfuture.com"],
    bestWork: "North Korean APT campaign analysis"
  },
  {
    handle: "@ryankingsbury",
    name: "Ryan Kingsbury",
    desc: "Malware researcher with focus on obfuscation, packers, and evasion techniques. Publishes detailed unpacking guides and RE methodology walkthroughs.",
    url: "https://x.com/ryankingsbury",
    tag: "Malware RE",
    why: "Deep technical posts on packer analysis and anti-evasion research.",
    blogs: ["ryankingsbury.com"],
    bestWork: "Malware unpacking and obfuscation analysis"
  },
  {
    handle: "@nicolasf_",
    name: "Nicolas Falliere",
    desc: "Co-author of the Stuxnet analysis at Symantec. One of the most respected names in the history of malware analysis. Now at independent research.",
    url: "https://x.com/nicolasf_",
    tag: "Malware RE",
    why: "OG Stuxnet researcher — historical credibility meets active posting.",
    blogs: ["securelist.com"],
    bestWork: "Stuxnet analysis and advanced malware research"
  },
  {
    handle: "@SecurityJoes",
    name: "Security Joes",
    desc: "Incident response firm publishing detailed intrusion reports. Strong on fileless malware, living-off-the-land techniques, and lateral movement analysis.",
    url: "https://x.com/SecurityJoes",
    tag: "DFIR / Detection",
    why: "Consistently detailed IR reports with IOCs and detection logic.",
    blogs: ["securityjoes.com"],
    bestWork: "Fileless malware and living-off-the-land analysis"
  },
  {
    handle: "@Unit42_Intel",
    name: "Unit 42 Intel",
    desc: "Palo Alto Networks threat intelligence team. Tracks ransomware groups, C2 infrastructure, and publishes detailed threat actor profiles with MITRE mapping.",
    url: "https://x.com/Unit42_Intel",
    tag: "Threat Intel",
    why: "High-volume, high-quality threat intel from a top-tier team.",
    blogs: ["unit42.paloaltonetworks.com"],
    bestWork: "Ransomware group profiling and C2 analysis"
  },
  {
    handle: "@threatprofiling",
    name: "Threat Profiling",
    desc: "Daily curation of the most important threat intelligence, malware reports, and security research from across the community. Great signal aggregator.",
    url: "https://x.com/threatprofiling",
    tag: "Threat Intel",
    why: "Best signal-to-noise ratio for daily threat intel curation.",
    blogs: ["threatprofiling.com"],
    bestWork: "Threat intelligence curation and aggregation"
  },
  {
    handle: "@reverseame",
    name: "Jose Miguel Esparza",
    desc: "Malware researcher at Blueliv. Specializes in crimeware, banking trojans, and botnet analysis. Writes detailed malware family teardowns.",
    url: "https://x.com/reverseame",
    tag: "Malware RE",
    why: "Banking trojan and crimeware analysis at a deep technical level.",
    blogs: ["blueliv.com"],
    bestWork: "Banking trojan analysis and botnet research"
  },
  {
    handle: "@TalosSecurity",
    name: "Cisco Talos",
    desc: "One of the largest threat intelligence teams in the world. Broad coverage: network threats, malware campaigns, vulnerability research, and incident response.",
    url: "https://x.com/TalosSecurity",
    tag: "Threat Intel",
    why: "Cisco Talos sees internet-scale threat telemetry. Follow for volume + quality.",
    blogs: ["blog.talosintelligence.com"],
    bestWork: "Internet-scale threat telemetry analysis"
  },
  {
    handle: "@SentinelOne",
    name: "SentinelLabs",
    desc: "Research team at SentinelOne. Publishes APT analysis, malware deep dives, and supply chain attack research. Strong on nation-state actors.",
    url: "https://x.com/SentinelOne",
    tag: "APT / Nation State",
    why: "SentinelLabs consistently breaks new APT research and publishes the details.",
    blogs: ["www.sentinelone.com/labs"],
    bestWork: "APT analysis and supply chain attack research"
  },
  {
    handle: "@JohnLaTwC",
    name: "John Lambert",
    desc: "VP at Microsoft Threat Intelligence. Philosophical, insightful posts about attacker mindset, defender strategy, and why certain detection approaches fail.",
    url: "https://x.com/JohnLaTwC",
    tag: "Threat Intel",
    why: "His 'attacker perspective' threads change how you think about detection.",
    blogs: ["www.microsoft.com/en-us/security/blog"],
    bestWork: "Attacker mindset analysis and detection philosophy"
  }
];

const blogsData = [
  {
    name: "The DFIR Report",
    url: "https://thedfirreport.com/",
    color: "#ff4d6d",
    desc: "Full attack chain walkthroughs. Each post covers Initial Access → Impact with IOCs, screenshots, Sigma rules, and timeline. Essential weekly reading.",
    freq: "Weekly"
  },
  {
    name: "Elastic Security Labs",
    url: "https://www.elastic.co/security-labs",
    color: "#0099ff",
    desc: "Technical malware analysis from a team that sees enterprise telemetry. Deep dives on malware families, detections, and intrusion campaigns.",
    freq: "Bi-weekly"
  },
  {
    name: "Malware Traffic Analysis",
    url: "https://www.malware-traffic-analysis.net/",
    color: "#f5a623",
    desc: "Brad Duncan's archive of real-world PCAP files with writeups. Best free resource for network forensics practice. Download the PCAPs and analyze yourself.",
    freq: "Weekly"
  },
  {
    name: "vx-underground Papers",
    url: "https://vx-underground.org/",
    color: "#c084fc",
    desc: "Archive of malware source code, papers, and academic research. Overwhelming in scope — use it as a reference library, not a reading list.",
    freq: "Ongoing"
  },
  {
    name: "Malwarebytes Labs",
    url: "https://www.malwarebytes.com/blog/threat-intelligence",
    color: "#00ff9d",
    desc: "Threat intelligence blog from a major AV vendor. Good mix of technical depth and accessible writing. hasherezade publishes here.",
    freq: "Weekly"
  },
  {
    name: "Mandiant Blog",
    url: "https://www.mandiant.com/resources/blog",
    color: "#34d399",
    desc: "Nation-state APT research, incident response learnings, and malware analysis from the company that coined the term APT. High prestige, high quality.",
    freq: "Weekly"
  },
  {
    name: "Unit 42 (Palo Alto)",
    url: "https://unit42.paloaltonetworks.com/",
    color: "#ff6b35",
    desc: "Threat intel and malware analysis from Palo Alto Networks' research team. Strong on C2 infrastructure analysis and threat actor profiling.",
    freq: "Weekly"
  },
  {
    name: "Recorded Future Blog",
    url: "https://www.recordedfuture.com/research",
    color: "#6ee7b7",
    desc: "Strategic and technical threat intelligence. Good for understanding threat actor motivations, geopolitical context, and emerging campaigns.",
    freq: "Weekly"
  },
  {
    name: "SANS Internet Storm Center",
    url: "https://isc.sans.edu/",
    color: "#fbbf24",
    desc: "Daily diaries from security practitioners worldwide. Quick technical notes on emerging threats, unusual malware behavior, and network anomalies.",
    freq: "Daily"
  },
  {
    name: "Malware Unicorn",
    url: "https://malwareunicorn.org/",
    color: "#f87171",
    desc: "Amanda Rousseau's workshops and tutorials on malware analysis and RE. Free workshop materials used at DEF CON and Black Hat.",
    freq: "Occasional"
  },
  {
    name: "Cisco Talos Blog",
    url: "https://blog.talosintelligence.com/",
    color: "#1d9bf0",
    desc: "One of the highest-volume threat intel blogs. Covers network threats, malware campaigns, vulnerability disclosures, and incident response findings from a team that sees internet-scale data.",
    freq: "Daily"
  },
  {
    name: "Securelist (Kaspersky)",
    url: "https://securelist.com/",
    color: "#e11d48",
    desc: "Kaspersky's research blog. Known for groundbreaking APT analysis — Equation Group, Flame, MiniDuke. Deep technical write-ups, sometimes the only public analysis of a given nation-state tool.",
    freq: "Weekly"
  },
  {
    name: "SentinelLabs",
    url: "https://www.sentinelone.com/labs/",
    color: "#6366f1",
    desc: "SentinelOne's research team publishes high-quality APT analysis, supply chain attack research, and malware family teardowns with indicators. Strong on DPRK and Chinese actors.",
    freq: "Bi-weekly"
  },
  {
    name: "Checkpoint Research",
    url: "https://research.checkpoint.com/",
    color: "#e879f9",
    desc: "Check Point's threat research team. Known for exposing major campaigns before others. Strong on mobile malware, phishing infrastructure, and crimeware ecosystems.",
    freq: "Weekly"
  },
  {
    name: "Microsoft Security Blog",
    url: "https://www.microsoft.com/en-us/security/blog/",
    color: "#0078d4",
    desc: "Microsoft's main security research blog. Covers nation-state activity (MSTIC), vulnerability research, identity attacks, and threat actor profiles with direct access to Azure/Windows telemetry.",
    freq: "Weekly"
  },
  {
    name: "Google Project Zero",
    url: "https://googleprojectzero.blogspot.com/",
    color: "#4285f4",
    desc: "Elite vulnerability research from Google's bug hunting team. If you care about how exploits actually work at the lowest level — memory corruption, browser exploits, 0-days — this is essential reading.",
    freq: "Monthly"
  },
  {
    name: "hasherezade's Blog",
    url: "https://hshrzd.wordpress.com/",
    color: "#f87171",
    desc: "hasherezade's personal malware analysis blog. Detailed, technical, accessible. PE format deep dives, malware family analysis, and tool development walkthroughs.",
    freq: "Monthly"
  },
  {
    name: "0xdf Hacks Stuff",
    url: "https://0xdf.gitlab.io/",
    color: "#f5a623",
    desc: "Exhaustive CTF write-ups and binary analysis walk-throughs. Every post is a masterclass in methodical RE and exploitation. Essential for learning the analyst's thought process.",
    freq: "Weekly"
  },
  {
    name: "Objective-See (macOS)",
    url: "https://objective-see.org/blog.html",
    color: "#a78bfa",
    desc: "Patrick Wardle's macOS-focused security research. If you care about macOS malware, this is the definitive public source. Builds free Mac security tools and analyzes every major macOS threat.",
    freq: "Monthly"
  },
  {
    name: "SecureList / GReAT Blog",
    url: "https://securelist.com/category/research/",
    color: "#fb923c",
    desc: "Kaspersky's Global Research and Analysis Team. Home of the Equation Group, Carbanak, and Lazarus disclosures. When they publish, it's almost always a major discovery.",
    freq: "Monthly"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecurity-roadmap');

    console.log('Connected to MongoDB');

    // Clear existing data
    await Tool.deleteMany({});
    await Person.deleteMany({});
    await Blog.deleteMany({});
    await Community.deleteMany({});

    console.log('Cleared existing data');

    // Seed tools
    await Tool.insertMany(toolsData);
    console.log(`Seeded ${toolsData.length} tools`);

    // Seed people
    await Person.insertMany(peopleData);
    console.log(`Seeded ${peopleData.length} people`);

    // Seed blogs
    await Blog.insertMany(blogsData);
    console.log(`Seeded ${blogsData.length} blogs`);

    // Seed community data
    const communityData = {
      reddits: [
        { name: "r/ReverseEngineering", url: "https://reddit.com/r/ReverseEngineering", desc: "High quality posts on binary RE, tools, and research papers. Low noise.", tag: "RE", members: "~70k" },
        { name: "r/Malware", url: "https://reddit.com/r/Malware", desc: "Malware identification, reports, sandbox results, and IOC sharing.", tag: "Malware", members: "~60k" },
        { name: "r/blueteamsec", url: "https://reddit.com/r/blueteamsec", desc: "Technical detection engineering. High-quality curated links.", tag: "Detection", members: "~95k" },
        { name: "r/netsec", url: "https://reddit.com/r/netsec", desc: "Curated security research. Strict quality bar. No beginner questions.", tag: "Research", members: "~440k" },
        { name: "r/MalwareResearch", url: "https://reddit.com/r/MalwareResearch", desc: "Community specifically for malware researchers and analysts.", tag: "RE", members: "~15k" },
        { name: "r/threatintel", url: "https://reddit.com/r/threatintel", desc: "IOC sharing, strategic threat analysis, and intel community discussion.", tag: "Intel", members: "~30k" },
      ],
      discords: [
        { name: "Malware Analysis & Reverse Engineering", desc: "OALabs community. Active channels for RE help, tool discussion, and sample sharing. Best beginner-friendly RE Discord.", url: "https://discord.gg/oalabs", tag: "RE" },
        { name: "The DFIR Report Community", desc: "DFIR practitioners sharing detection notes, playbooks, and incident response experience.", url: "https://discord.gg/dfirreport", tag: "DFIR" },
        { name: "Hack The Box", desc: "Active community around RE challenges, binary exploitation, and CTF coordination.", url: "https://discord.gg/hackthebox", tag: "CTF" },
        { name: "pwn.college Discord", desc: "Community for the pwn.college learning platform. Ask questions, get mentorship on RE labs.", url: "https://pwn.college/discord", tag: "Learning" },
        { name: "OpenSecurityTraining2", desc: "Community for OST2 courses. Get help on kernel internals, RE, and x86 assembly courses.", url: "https://discord.gg/ost2", tag: "RE" },
      ]
    };

    await Community.create(communityData);
    console.log('Seeded community data');

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();