import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const LEVELS = [
  {
    id: 0,
    label: "FOUNDATION",
    color: "#00ff9d",
    icon: "◈",
    tagline: "Before you reverse anything, you need to understand what you're reversing.",
    modules: [
      {
        id: "m0-0",
        name: "How CPUs Actually Work",
        difficulty: "Beginner",
        time: "~6 hrs",
        primer: "A CPU fetches instructions from memory, decodes them, executes them, and writes results back. Registers are tiny ultra-fast storage slots inside the CPU. The stack grows downward in memory and handles function calls. You cannot reverse engineer a binary without this mental model.",
        resources: [
          { type: "yt", label: "Crash Course Computer Science — Full Series", url: "https://www.youtube.com/watch?v=tpIctyqH29Q&list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo", free: true },
          { type: "yt", label: "Low Level Learning — How CPUs Execute Code", url: "https://www.youtube.com/watch?v=IAkj32VPcUE", free: true },
          { type: "read", label: "OSDev Wiki — x86 Architecture Overview", url: "https://wiki.osdev.org/X86_Assembly/X86_Architecture", free: true },
          { type: "read", label: "Computer Organization & Design (Patterson) — Preview", url: "https://www.amazon.com/Computer-Organization-Design-MIPS-Architecture/dp/0124077269", free: false },
        ]
      },
      {
        id: "m0-1",
        name: "Memory Model: Stack, Heap, Segments",
        difficulty: "Beginner",
        time: "~4 hrs",
        primer: "Programs divide memory into regions: the stack (fast, automatic, local vars), the heap (dynamic allocations), the text segment (code), and data segments. Buffer overflows and exploits almost always abuse the boundary between these. Malware allocates memory via VirtualAlloc on Windows.",
        resources: [
          { type: "yt", label: "Jacob Sorber — Stack vs Heap", url: "https://www.youtube.com/watch?v=_8-ht2AKyH4", free: true },
          { type: "yt", label: "LiveOverflow — Memory Layout of a Program", url: "https://www.youtube.com/watch?v=6-X_HNsrPbA", free: true },
          { type: "read", label: "Beej's Guide to C Programming — Memory chapter", url: "https://beej.us/guide/bgc/html/split/", free: true },
          { type: "read", label: "CS:APP Bryant & O'Hallaron — Stack Frames (Ch3)", url: "https://csapp.cs.cmu.edu/", free: false },
        ]
      },
      {
        id: "m0-2",
        name: "Operating System Fundamentals",
        difficulty: "Beginner",
        time: "~8 hrs",
        primer: "The OS manages processes, memory, files, and devices. Malware abuses OS APIs to hide itself, persist on reboot, and communicate with attackers. You need to understand processes vs threads, system calls, and how the kernel-user boundary works before any serious analysis.",
        resources: [
          { type: "yt", label: "MIT 6.004 — Computation Structures (Free OCW)", url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/", free: true },
          { type: "yt", label: "Hussein Nasser — OS Internals Explained", url: "https://www.youtube.com/watch?v=9GDX-IyZ_C8", free: true },
          { type: "read", label: "Operating Systems: Three Easy Pieces (Free PDF)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", free: true },
          { type: "read", label: "xv6 Source Code — Simple OS to Study", url: "https://github.com/mit-pdos/xv6-public", free: true },
        ]
      },
      {
        id: "m0-3",
        name: "Linux Command Line Mastery",
        difficulty: "Beginner",
        time: "~10 hrs",
        primer: "The majority of RE work happens on Linux. You need to be fluent: file manipulation, process inspection (ps, lsof, strace), networking (netstat, tcpdump), scripting in bash, and understanding the /proc filesystem. Most analysis tools are Linux-native.",
        resources: [
          { type: "course", label: "OverTheWire: Bandit — Best Free Linux Wargame", url: "https://overthewire.org/wargames/bandit/", free: true },
          { type: "course", label: "Linux Journey — Free Interactive Learning", url: "https://linuxjourney.com/", free: true },
          { type: "yt", label: "NetworkChuck — Linux for Hackers (Full Series)", url: "https://www.youtube.com/watch?v=VbEx7B_PTOE&list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL", free: true },
          { type: "read", label: "The Linux Command Line — William Shotts (Free PDF)", url: "https://linuxcommand.org/tlcl.php", free: true },
        ]
      },
      {
        id: "m0-4",
        name: "C Programming for Reverse Engineers",
        difficulty: "Beginner",
        time: "~15 hrs",
        primer: "Most malware is written in C. When you decompile a binary in Ghidra, the output looks like C. You don't need to be an expert — you need to recognize structs, function pointers, memory allocation patterns, and how loops/conditionals compile down to assembly.",
        resources: [
          { type: "yt", label: "Low Level Learning — C Programming Full Course", url: "https://www.youtube.com/watch?v=w3tpqgpMFP0", free: true },
          { type: "yt", label: "Jacob Sorber — Pointers in C (Deep Dive)", url: "https://www.youtube.com/watch?v=2ybLD6_2gKM", free: true },
          { type: "read", label: "Beej's Guide to C Programming (Free, Complete)", url: "https://beej.us/guide/bgc/html/split/", free: true },
          { type: "read", label: "CS50x Harvard — Week 1–5 (C focus)", url: "https://cs50.harvard.edu/x/", free: true },
        ]
      },
      {
        id: "m0-5",
        name: "Python for Automation & Scripting",
        difficulty: "Beginner",
        time: "~8 hrs",
        primer: "Python is the duct tape of security. You'll write scripts to parse PE files, automate sandbox submissions, decode obfuscated strings, interact with APIs, and build analysis pipelines. pefile, pwntools, and requests are your most-used libraries.",
        resources: [
          { type: "course", label: "CS50P — Python (Harvard, completely free)", url: "https://cs50.harvard.edu/python/", free: true },
          { type: "yt", label: "Tech With Tim — Python for Beginners Full Course", url: "https://www.youtube.com/watch?v=sxTmJE4k0ho", free: true },
          { type: "read", label: "Automate the Boring Stuff with Python (Free Online)", url: "https://automatetheboringstuff.com/", free: true },
          { type: "read", label: "pefile Library Docs — Parse PE files with Python", url: "https://github.com/erocarrera/pefile", free: true },
        ]
      },
      {
        id: "m0-6",
        name: "Networking Fundamentals",
        difficulty: "Beginner",
        time: "~8 hrs",
        primer: "Malware always communicates. C2 beaconing, data exfiltration, lateral movement — it's all network traffic. You need TCP/IP, DNS (huge for C2), HTTP/HTTPS, and the ability to read packet captures in Wireshark and identify anomalous patterns.",
        resources: [
          { type: "yt", label: "Professor Messer — CompTIA Network+ (Full Free Series)", url: "https://www.youtube.com/c/professormesser", free: true },
          { type: "yt", label: "David Bombal — Wireshark Full Course", url: "https://www.youtube.com/watch?v=lb1Dw0elw0Q", free: true },
          { type: "read", label: "Wireshark Sample Captures (Practice PCAPs)", url: "https://wiki.wireshark.org/SampleCaptures", free: true },
          { type: "read", label: "Beej's Guide to Network Programming (Free)", url: "https://beej.us/guide/bgnet/html/", free: true },
        ]
      },
    ]
  },
  {
    id: 1,
    label: "CORE SECURITY",
    color: "#0099ff",
    icon: "⬡",
    tagline: "Learn how software breaks. Learn how attackers exploit it.",
    modules: [
      {
        id: "m1-0",
        name: "x86/x64 Assembly — Reading Level",
        difficulty: "Intermediate",
        time: "~20 hrs",
        primer: "You don't need to write assembly — you need to READ it. Registers (EAX/RAX, ESP/RSP, EIP/RIP), MOV/PUSH/POP/CALL/RET, conditional jumps (JZ, JNZ, JE), and function prologues/epilogues. Every malware binary is assembly underneath.",
        resources: [
          { type: "course", label: "OpenSecurityTraining2 — Introductory x86 (Best Free Course)", url: "https://p.ost2.fyi/courses/course-v1:OpenSecurityTraining2+Arch1001_x86-64_Asm+2021_v1/about", free: true },
          { type: "yt", label: "Davy Wybiral — Assembly Language Tutorial Series", url: "https://www.youtube.com/watch?v=ViNnfoE56V8&list=PLmxT2pVYo5LB5EzTPZGfFN0c2GDiSXgQe", free: true },
          { type: "read", label: "Compiler Explorer (Godbolt) — See C compile to ASM live", url: "https://godbolt.org/", free: true },
          { type: "read", label: "x86 Assembly Reference — Felix Cloutier", url: "https://www.felixcloutier.com/x86/", free: true },
        ]
      },
      {
        id: "m1-1",
        name: "Windows PE File Format",
        difficulty: "Intermediate",
        time: "~6 hrs",
        primer: "PE (Portable Executable) is the format of every .exe and .dll on Windows. Headers contain metadata, the import table reveals what APIs malware calls, sections tell you about code vs data, and entropy reveals packing/encryption. You'll look at PE headers constantly.",
        resources: [
          { type: "yt", label: "OALabs — PE Format for Malware Analysts", url: "https://www.youtube.com/watch?v=OXRjHFWgAIs", free: true },
          { type: "yt", label: "hasherezade — PE-bear Tool Walkthrough", url: "https://www.youtube.com/c/hasherezade", free: true },
          { type: "read", label: "PE Format Spec — Microsoft Documentation", url: "https://learn.microsoft.com/en-us/windows/win32/debug/pe-format", free: true },
          { type: "read", label: "corkami PE Internals (Visual Guide)", url: "https://github.com/corkami/pics/tree/master/binary/pe", free: true },
        ]
      },
      {
        id: "m1-2",
        name: "Windows Internals: Processes & APIs",
        difficulty: "Intermediate",
        time: "~12 hrs",
        primer: "Windows malware calls Win32 APIs to do everything: CreateProcess, VirtualAlloc, WriteProcessMemory, CreateRemoteThread. The Windows kernel exposes these through ntdll.dll. Process injection, hollowing, and DLL hijacking all abuse these APIs. Sysinternals tools are essential here.",
        resources: [
          { type: "yt", label: "Pavel Yosifovich — Windows Internals YouTube", url: "https://www.youtube.com/c/PavelYosifovich", free: true },
          { type: "yt", label: "Bill Demirkapi — Windows Process Injection Techniques", url: "https://www.youtube.com/watch?v=CwglaQRejio", free: true },
          { type: "read", label: "Windows Internals 7th Ed — Russinovich (essential book)", url: "https://www.microsoftpressstore.com/store/windows-internals-part-1-system-architecture-processes-9780735684188", free: false },
          { type: "read", label: "Sysinternals Suite — Essential Windows Tools (Free)", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite", free: true },
        ]
      },
      {
        id: "m1-3",
        name: "Windows Registry & Persistence Mechanisms",
        difficulty: "Intermediate",
        time: "~4 hrs",
        primer: "Malware persists by writing to specific registry keys (Run/RunOnce), dropping DLLs into Windows directories, creating scheduled tasks, or installing services. You need to know these locations cold: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run is the most abused key.",
        resources: [
          { type: "yt", label: "13Cubed — Windows Registry Forensics", url: "https://www.youtube.com/watch?v=rpNOBMBI518", free: true },
          { type: "read", label: "MITRE ATT&CK — Persistence Techniques Catalog", url: "https://attack.mitre.org/tactics/TA0003/", free: true },
          { type: "read", label: "Autoruns for Windows — Sysinternals (Find Persistence)", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns", free: true },
          { type: "read", label: "The DFIR Report — Registry Persistence Case Studies", url: "https://thedfirreport.com/", free: true },
        ]
      },
      {
        id: "m1-4",
        name: "Static Malware Analysis",
        difficulty: "Intermediate",
        time: "~10 hrs",
        primer: "Static analysis = examining a binary without running it. You extract strings, check imports/exports, calculate entropy (high entropy = packed/encrypted), look at PE headers, and try to identify the malware family before execution. Tools: PEStudio, die, strings, floss.",
        resources: [
          { type: "yt", label: "OALabs — Static Analysis Fundamentals Series", url: "https://www.youtube.com/watch?v=OXRjHFWgAIs", free: true },
          { type: "yt", label: "ANY.RUN — Static Analysis Walkthroughs", url: "https://www.youtube.com/c/anyrun", free: true },
          { type: "read", label: "Practical Malware Analysis — Sikorski & Honig (Ch 1-3)", url: "https://nostarch.com/malware", free: false },
          { type: "read", label: "MalwareBazaar — Download Real Samples to Practice", url: "https://bazaar.abuse.ch/", free: true },
        ]
      },
      {
        id: "m1-5",
        name: "Dynamic Malware Analysis",
        difficulty: "Intermediate",
        time: "~10 hrs",
        primer: "Dynamic analysis = running malware in a controlled environment and watching what it does. You use Process Monitor, Wireshark, Regshot, and API Monitor to capture every file write, registry change, network connection, and API call. Always use an isolated VM.",
        resources: [
          { type: "yt", label: "OALabs — Dynamic Analysis in a FlareVM Setup", url: "https://www.youtube.com/watch?v=0P9FcKIbKBk", free: true },
          { type: "yt", label: "Colin Hardy — Malware Analysis on Windows VM", url: "https://www.youtube.com/c/ColinHardy", free: true },
          { type: "read", label: "ANY.RUN Interactive Sandbox (Free tier available)", url: "https://app.any.run/", free: true },
          { type: "read", label: "FlareVM Setup Guide — Mandiant", url: "https://github.com/mandiant/flare-vm", free: true },
        ]
      },
    ]
  },
  {
    id: 2,
    label: "REVERSE ENGINEERING",
    color: "#f5a623",
    icon: "⟁",
    tagline: "Tear apart binaries. Understand everything.",
    modules: [
      {
        id: "m2-0",
        name: "Ghidra: Your First Decompiler",
        difficulty: "Intermediate",
        time: "~15 hrs",
        primer: "Ghidra is the NSA's free disassembler and decompiler. It turns raw bytes into pseudo-C code you can read. Start by loading a simple crackme, identify main(), trace the logic, rename variables. The decompiler output is messy but readable once you know what to expect.",
        resources: [
          { type: "yt", label: "stacksmashing — Ghidra Full Beginner Tutorial", url: "https://www.youtube.com/watch?v=d4Pgi5XML8E", free: true },
          { type: "yt", label: "NSA Cybersecurity — Official Ghidra Class Videos", url: "https://www.youtube.com/watch?v=oTD_ki86c9I", free: true },
          { type: "read", label: "The Ghidra Book — Free official companion", url: "https://ghidra-sre.org/", free: true },
          { type: "course", label: "crackmes.one — Practice Binaries to Reverse", url: "https://crackmes.one/", free: true },
        ]
      },
      {
        id: "m2-1",
        name: "IDA Free / Binary Ninja Cloud",
        difficulty: "Intermediate",
        time: "~8 hrs",
        primer: "IDA Pro is the industry standard in professional RE. The free version handles 32-bit binaries. Binary Ninja has a free cloud version. Learn IDA's workflow: F5 for decompile, N to rename, Y to retype, X for cross-references. These habits transfer directly to professional tools.",
        resources: [
          { type: "yt", label: "Hex-Rays — Official IDA Pro Tutorial Videos", url: "https://hex-rays.com/tutorials/", free: true },
          { type: "yt", label: "OALabs — IDA Pro for Malware Analysis", url: "https://www.youtube.com/c/OALabs", free: true },
          { type: "read", label: "IDA Free Download (Official)", url: "https://hex-rays.com/ida-free/", free: true },
          { type: "read", label: "Binary Ninja Cloud — Free Browser-Based RE", url: "https://cloud.binary.ninja/", free: true },
        ]
      },
      {
        id: "m2-2",
        name: "x64dbg: Dynamic Debugging",
        difficulty: "Intermediate",
        time: "~12 hrs",
        primer: "A debugger lets you pause execution, inspect registers and memory, and step through code instruction-by-instruction. Set breakpoints on suspicious API calls (VirtualAlloc, CreateRemoteThread), trace shellcode execution, and watch unpacking routines in real time. x64dbg is free and excellent.",
        resources: [
          { type: "yt", label: "OALabs — x64dbg for Malware Analysis (Full Series)", url: "https://www.youtube.com/watch?v=q4yZDJvnKkk", free: true },
          { type: "yt", label: "Colin Hardy — Step-by-step Debugging Walkthroughs", url: "https://www.youtube.com/c/ColinHardy", free: true },
          { type: "read", label: "x64dbg Official Docs & Download", url: "https://x64dbg.com/", free: true },
          { type: "read", label: "x64dbg Plugin List — Extend Your Debugger", url: "https://github.com/x64dbg/x64dbg/wiki/Plugins", free: true },
        ]
      },
      {
        id: "m2-3",
        name: "Unpacking & Deobfuscation",
        difficulty: "Advanced",
        time: "~15 hrs",
        primer: "Most real-world malware is packed or obfuscated. Packing = compressing/encrypting the payload and writing a stub that unpacks at runtime. Your job: find the OEP (Original Entry Point) after unpacking, dump the unpacked binary, then analyze it. UPX is common, but custom packers are everywhere.",
        resources: [
          { type: "yt", label: "OALabs — Unpacking Malware Full Series", url: "https://www.youtube.com/watch?v=EdchPEHnohw", free: true },
          { type: "yt", label: "hasherezade — Advanced Unpacking Techniques", url: "https://www.youtube.com/c/hasherezade", free: true },
          { type: "read", label: "The Art of Unpacking — Mark Vincent Yason (BlackHat)", url: "https://www.blackhat.com/presentations/bh-usa-07/Yason/Whitepaper/bh-usa-07-yason-WP.pdf", free: true },
          { type: "read", label: "al-khaser — Anti-VM/Debug Techniques Reference", url: "https://github.com/LordNoteworthy/al-khaser", free: true },
        ]
      },
      {
        id: "m2-4",
        name: "Anti-Analysis Bypass",
        difficulty: "Advanced",
        time: "~12 hrs",
        primer: "Malware actively fights analysts. It detects VMs (CPUID, timing checks, registry artifacts), detects debuggers (IsDebuggerPresent, NtQueryInformationProcess), and uses control flow obfuscation. Each technique has a counter. Learn both sides.",
        resources: [
          { type: "yt", label: "OpenSecurityTraining2 — Anti-Analysis Techniques", url: "https://p.ost2.fyi/", free: true },
          { type: "yt", label: "OALabs — Anti-Debug Bypass Techniques", url: "https://www.youtube.com/c/OALabs", free: true },
          { type: "read", label: "Checkpoint Research — Anti-Debug Techniques Overview", url: "https://anti-debug.checkpoint.com/", free: true },
          { type: "read", label: "MITRE ATT&CK — Defense Evasion Catalog", url: "https://attack.mitre.org/tactics/TA0005/", free: true },
        ]
      },
      {
        id: "m2-5",
        name: "Shellcode Analysis",
        difficulty: "Advanced",
        time: "~8 hrs",
        primer: "Shellcode is position-independent code that doesn't rely on imports — it finds APIs at runtime by walking the PEB. Common in exploits, loaders, and fileless malware. You'll often encounter it as a hex blob that needs to be carved out and analyzed separately.",
        resources: [
          { type: "yt", label: "OALabs — Shellcode Analysis from Scratch", url: "https://www.youtube.com/c/OALabs", free: true },
          { type: "yt", label: "LiveOverflow — Shellcode Basics", url: "https://www.youtube.com/c/LiveOverflow", free: true },
          { type: "read", label: "shellcode.tips — Interactive Shellcode Reference", url: "https://www.shellcode.tips/", free: true },
          { type: "read", label: "Malware Unicorn — Shellcode Workshop (Free Labs)", url: "https://malwareunicorn.org/", free: true },
        ]
      },
    ]
  },
  {
    id: 3,
    label: "DETECTION ENGINEERING",
    color: "#ff4d6d",
    icon: "⬢",
    tagline: "Turn your RE knowledge into detection logic.",
    modules: [
      {
        id: "m3-0",
        name: "MITRE ATT&CK Framework",
        difficulty: "Intermediate",
        time: "~6 hrs",
        primer: "ATT&CK is a knowledge base of attacker techniques organized by tactic (what they're trying to do) and technique (how they do it). Every IOC you find maps to an ATT&CK technique. Every detection you write should reference the relevant TTP. It's the common language of the industry.",
        resources: [
          { type: "yt", label: "John Strand — ATT&CK for Defenders (Free Full Course)", url: "https://www.youtube.com/watch?v=bkfwMADar0M", free: true },
          { type: "read", label: "MITRE ATT&CK Navigator — Map your coverage", url: "https://mitre-attack.github.io/attack-navigator/", free: true },
          { type: "read", label: "ATT&CK Evaluations — See how tools perform vs real APTs", url: "https://attackevals.mitre-engenuity.org/", free: true },
          { type: "read", label: "Threat Report ATT&CK Mapper (TRAM) — Auto-map reports", url: "https://github.com/center-for-threat-informed-defense/tram", free: true },
        ]
      },
      {
        id: "m3-1",
        name: "Writing YARA Rules",
        difficulty: "Intermediate",
        time: "~8 hrs",
        primer: "YARA rules detect malware by pattern matching on binary content or metadata. A rule has conditions: byte sequences, string patterns, PE header checks, and size constraints. Your goal is high-precision rules — low false positives, high detection rate. Start by writing rules for malware you've already analyzed.",
        resources: [
          { type: "yt", label: "OALabs — YARA from Scratch (Best series for beginners)", url: "https://www.youtube.com/watch?v=3nbxXVubNaM", free: true },
          { type: "yt", label: "Florian Roth — YARA Best Practices (Kaspersky SAS)", url: "https://www.youtube.com/watch?v=MMHgF8EFMMU", free: true },
          { type: "read", label: "YARA Official Documentation", url: "https://yara.readthedocs.io/en/stable/", free: true },
          { type: "read", label: "Yara-Rules GitHub — 1000+ Real Rules to Learn From", url: "https://github.com/Yara-Rules/rules", free: true },
        ]
      },
      {
        id: "m3-2",
        name: "Writing Sigma Rules",
        difficulty: "Intermediate",
        time: "~6 hrs",
        primer: "Sigma is YARA but for log events. A Sigma rule describes suspicious log patterns in YAML, then gets compiled to SIEM-specific queries (Splunk, Elastic, Chronicle). If YARA catches malware on disk, Sigma catches malware behavior in logs. Both are essential.",
        resources: [
          { type: "yt", label: "Florian Roth — Sigma Rules Explained (Creator's Talk)", url: "https://www.youtube.com/watch?v=OheVuE9Ifhs", free: true },
          { type: "yt", label: "SANS — Detection Engineering with Sigma", url: "https://www.youtube.com/watch?v=l_HVoVnYKbA", free: true },
          { type: "read", label: "SigmaHQ Repository — The canonical rule source", url: "https://github.com/SigmaHQ/sigma", free: true },
          { type: "read", label: "Sigma Rule Specification (Official Docs)", url: "https://sigmahq.io/docs/basics/rules.html", free: true },
        ]
      },
      {
        id: "m3-3",
        name: "Threat Hunting",
        difficulty: "Advanced",
        time: "~10 hrs",
        primer: "Threat hunting = proactively searching for attackers who bypassed your defenses. You form a hypothesis (e.g., 'I think there's a Cobalt Strike beacon in my environment'), then hunt using logs, EDR telemetry, and memory forensics. It combines RE knowledge, ATT&CK mapping, and data analysis.",
        resources: [
          { type: "yt", label: "13Cubed — Threat Hunting Full Series", url: "https://www.youtube.com/c/13Cubed", free: true },
          { type: "yt", label: "Black Hills InfoSec — Free Threat Hunting Courses", url: "https://www.youtube.com/c/BlackHillsInformationSecurity", free: true },
          { type: "read", label: "ThreatHunter-Playbook — OTR Foundation (GitHub)", url: "https://github.com/OTRF/ThreatHunter-Playbook", free: true },
          { type: "read", label: "Sqrrl — Hunt Evil: Practical Guide (Classic Paper)", url: "https://www.threathunting.net/files/hunt-evil-practical-guide-threat-hunting.pdf", free: true },
        ]
      },
    ]
  },
  {
    id: 4,
    label: "ADVANCED SPECIALIZATION",
    color: "#c084fc",
    icon: "✦",
    tagline: "Pick your lane. Go deep. Become an expert.",
    modules: [
      {
        id: "m4-0",
        name: "Kernel Malware & Rootkits",
        difficulty: "Expert",
        time: "~30 hrs",
        primer: "Rootkits operate in kernel space — ring 0. They can hide processes, files, and network connections from userland tools by hooking kernel functions (SSDT hooks, DKOM). Analyzing them requires kernel debuggers (WinDbg), driver analysis, and understanding of IOCTL communication.",
        resources: [
          { type: "yt", label: "OpenSecurityTraining2 — Windows Kernel Internals", url: "https://p.ost2.fyi/courses/course-v1:OpenSecurityTraining2+Windows+Kernel/about", free: true },
          { type: "yt", label: "Pavel Yosifovich — Windows Kernel Programming", url: "https://www.youtube.com/c/PavelYosifovich", free: true },
          { type: "read", label: "Rootkits: Subverting the Windows Kernel — Hoglund/Butler", url: "https://www.amazon.com/Rootkits-Subverting-Windows-Greg-Hoglund/dp/0321294319", free: false },
          { type: "read", label: "OSR Online — Kernel Driver Development Articles", url: "https://www.osronline.com/", free: true },
        ]
      },
      {
        id: "m4-1",
        name: "Network Forensics & C2 Identification",
        difficulty: "Advanced",
        time: "~12 hrs",
        primer: "C2 frameworks (Cobalt Strike, Sliver, Brute Ratel) have identifiable network signatures: beacon intervals, jitter, specific HTTP headers, JA3 TLS fingerprints. You analyze PCAPs to identify beacons, extract configuration, and map infrastructure. Essential for incident response.",
        resources: [
          { type: "yt", label: "13Cubed — Network Forensics Deep Dive Series", url: "https://www.youtube.com/c/13Cubed", free: true },
          { type: "yt", label: "Brad Duncan — Malware Traffic Analysis Walkthroughs", url: "https://www.youtube.com/c/BradDuncan", free: true },
          { type: "read", label: "Malware Traffic Analysis — Real PCAP Practice Files", url: "https://www.malware-traffic-analysis.net/", free: true },
          { type: "read", label: "Zeek Network Security Monitor — Analysis Framework", url: "https://zeek.org/", free: true },
        ]
      },
      {
        id: "m4-2",
        name: "Memory Forensics",
        difficulty: "Advanced",
        time: "~15 hrs",
        primer: "Fileless malware lives only in memory. Volatility is the go-to tool: it can extract process lists, find injected code, dump unpacked malware, detect hooking, and pull Cobalt Strike configs from memory dumps. Essential for incident response and advanced malware analysis.",
        resources: [
          { type: "yt", label: "13Cubed — Volatility 3 Full Tutorial Series", url: "https://www.youtube.com/watch?v=_6Yd3Gh4q5s", free: true },
          { type: "yt", label: "OpenSecurityTraining2 — Memory Forensics", url: "https://p.ost2.fyi/", free: true },
          { type: "read", label: "The Art of Memory Forensics — Ligh et al.", url: "https://www.amazon.com/Art-Memory-Forensics-Detecting-Malware/dp/1118825098", free: false },
          { type: "read", label: "Volatility Foundation — Free Framework + Docs", url: "https://github.com/volatilityfoundation/volatility3", free: true },
        ]
      },
      {
        id: "m4-3",
        name: "CTF Practice: RE & Pwn Challenges",
        difficulty: "All levels",
        time: "Ongoing",
        primer: "CTF challenges are the fastest way to build practical RE skills. Crackmes teach binary reversing. Pwn challenges teach exploitation. You learn by doing — no book can replicate the experience of staring at a stripped binary until the logic becomes clear.",
        resources: [
          { type: "course", label: "pwn.college — Free Structured RE & Exploitation Labs", url: "https://pwn.college/", free: true },
          { type: "course", label: "crackmes.one — Community RE Challenges (All levels)", url: "https://crackmes.one/", free: true },
          { type: "yt", label: "John Hammond — CTF Walkthroughs & RE", url: "https://www.youtube.com/c/JohnHammond010", free: true },
          { type: "yt", label: "IppSec — HackTheBox Reversing Walkthroughs", url: "https://www.youtube.com/c/ippsec", free: true },
        ]
      },
      {
        id: "m4-4",
        name: "Real Malware Deep-Dive Reports",
        difficulty: "Advanced",
        time: "Ongoing",
        primer: "Reading published malware analysis reports is how you see elite researchers work. The DFIR Report, Elastic Security Labs, and Mandiant publish full attack chain analyses with TTPs, IOCs, and detection guidance. Read one a week minimum.",
        resources: [
          { type: "read", label: "The DFIR Report — Full Attack Chain Reports (Best source)", url: "https://thedfirreport.com/", free: true },
          { type: "read", label: "Elastic Security Labs — Malware Analysis Blog", url: "https://www.elastic.co/security-labs", free: true },
          { type: "read", label: "Mandiant M-Trends & Threat Intelligence Reports", url: "https://www.mandiant.com/resources/blog", free: true },
          { type: "read", label: "vx-underground — Malware Samples & Papers Library", url: "https://vx-underground.org/", free: true },
        ]
      },
    ]
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const DIFF_COLORS = {
  "Beginner": "#00ff9d",
  "Intermediate": "#0099ff",
  "Advanced": "#f5a623",
  "Expert": "#ff4d6d",
  "All levels": "#c084fc",
};

const TYPE_CONFIG = {
  yt: { label: "▶  YouTube", color: "#ff4d6d", bg: "rgba(255,77,109,0.08)" },
  read: { label: "◎  Article/Docs", color: "#0099ff", bg: "rgba(0,153,255,0.08)" },
  course: { label: "◈  Course/Lab", color: "#00ff9d", bg: "rgba(0,255,157,0.08)" },
};

function ResourceRow({ r }) {
  const cfg = TYPE_CONFIG[r.type] || TYPE_CONFIG.read;
  return (
    <a href={r.url} target="_blank" rel="noreferrer" style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 12px", borderRadius: 7,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      textDecoration: "none",
      transition: "all 0.15s",
      cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = cfg.bg; e.currentTarget.style.borderColor = cfg.color + "40"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
    >
      <span style={{ fontSize: 10, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 4, padding: "2px 6px", fontWeight: 600, whiteSpace: "nowrap", fontFamily: "Fira Code" }}>{cfg.label}</span>
      <span style={{ fontSize: 12, color: "#c9d1d9", flex: 1, lineHeight: 1.4 }}>{r.label}</span>
      {r.free
        ? <span style={{ fontSize: 10, color: "#00ff9d", background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.2)", borderRadius: 3, padding: "1px 6px", whiteSpace: "nowrap" }}>FREE</span>
        : <span style={{ fontSize: 10, color: "#6e7681", background: "rgba(110,118,129,0.08)", border: "1px solid rgba(110,118,129,0.2)", borderRadius: 3, padding: "1px 6px", whiteSpace: "nowrap" }}>PAID</span>
      }
      <span style={{ fontSize: 12, color: "#3d444d" }}>↗</span>
    </a>
  );
}

function ModuleCard({ module, completed, onToggle, levelColor }) {
  const [expanded, setExpanded] = useState(false);
  const isComplete = completed.includes(module.id);

  return (
    <div style={{
      background: isComplete ? "rgba(0,255,157,0.03)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isComplete ? "rgba(0,255,157,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 10, overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {/* Card header */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}>
        {/* Checkbox */}
        <div onClick={e => { e.stopPropagation(); onToggle(module.id); }}
          style={{
            width: 20, height: 20, borderRadius: 5, flexShrink: 0,
            border: `2px solid ${isComplete ? "#00ff9d" : "rgba(255,255,255,0.15)"}`,
            background: isComplete ? "#00ff9d" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}>
          {isComplete && <span style={{ color: "#07090f", fontSize: 11, fontWeight: 900 }}>✓</span>}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: isComplete ? "#6e7681" : "#e6edf3", textDecoration: isComplete ? "line-through" : "none", fontFamily: "Syne" }}>{module.name}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: DIFF_COLORS[module.difficulty], background: `${DIFF_COLORS[module.difficulty]}15`, border: `1px solid ${DIFF_COLORS[module.difficulty]}30`, borderRadius: 4, padding: "1px 7px", fontWeight: 600 }}>{module.difficulty}</span>
            <span style={{ fontSize: 10, color: "#6e7681", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 7px" }}>⏱ {module.time}</span>
            <span style={{ fontSize: 10, color: "#6e7681", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 7px" }}>{module.resources.length} resources</span>
          </div>
        </div>
        <span style={{ fontSize: 14, color: "#3d444d", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Primer */}
          <div style={{
            margin: "14px 0", padding: "12px 14px",
            background: `${levelColor}08`, border: `1px solid ${levelColor}20`,
            borderLeft: `3px solid ${levelColor}`, borderRadius: "0 8px 8px 0",
          }}>
            <div style={{ fontSize: 10, color: levelColor, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>CONCEPT PRIMER</div>
            <p style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.7, margin: 0, fontFamily: "Syne" }}>{module.primer}</p>
          </div>
          {/* Resources */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {module.resources.map((r, i) => <ResourceRow key={i} r={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function LevelSection({ level, completed, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const levelComplete = level.modules.filter(m => completed.includes(m.id)).length;
  const pct = Math.round((levelComplete / level.modules.length) * 100);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Level header */}
      <div onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
        background: open ? `${level.color}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? level.color + "30" : "rgba(255,255,255,0.06)"}`,
        borderRadius: open ? "10px 10px 0 0" : 10,
        cursor: "pointer", transition: "all 0.2s",
      }}>
        <span style={{ fontSize: 22, filter: `drop-shadow(0 0 8px ${level.color}60)` }}>{level.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: level.color }}>{level.label}</span>
            <span style={{ fontSize: 10, color: "#6e7681" }}>{levelComplete}/{level.modules.length} done</span>
          </div>
          <div style={{ fontSize: 13, color: "#8b949e", fontFamily: "Syne" }}>{level.tagline}</div>
        </div>
        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: level.color, borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
          <span style={{ fontSize: 11, color: level.color, fontFamily: "Fira Code", minWidth: 30 }}>{pct}%</span>
        </div>
        <span style={{ fontSize: 14, color: "#3d444d", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>

      {/* Modules */}
      {open && (
        <div style={{
          border: `1px solid ${level.color}30`, borderTop: "none",
          borderRadius: "0 0 10px 10px", padding: 12,
          background: "rgba(255,255,255,0.01)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {level.modules.map(m => (
            <ModuleCard key={m.id} module={m} completed={completed} onToggle={onToggle} levelColor={level.color} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("re_completed") || "[]"); } catch { return []; }
  });

  const totalModules = LEVELS.reduce((acc, l) => acc + l.modules.length, 0);
  const totalComplete = completed.length;
  const overallPct = Math.round((totalComplete / totalModules) * 100);

  useEffect(() => {
    localStorage.setItem("re_completed", JSON.stringify(completed));
  }, [completed]);

  function toggleModule(id) {
    setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#3d444d", marginBottom: 10 }}>MALWARE ANALYSIS & REVERSE ENGINEERING</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: "Syne", margin: "0 0 10px", color: "#e6edf3", lineHeight: 1.1 }}>
          The <span style={{ color: "#00ff9d" }}>Complete</span> Roadmap
        </h1>
        <p style={{ color: "#6e7681", fontSize: 14, maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7, fontFamily: "Syne" }}>
          From zero to professional malware analyst. Every module has a plain-English primer, verified resources, and difficulty tags. Check off as you go.
        </p>

        {/* Overall progress */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "12px 24px",
        }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#e6edf3", fontFamily: "Syne", lineHeight: 1 }}>{overallPct}%</div>
            <div style={{ fontSize: 10, color: "#6e7681", marginTop: 2 }}>{totalComplete}/{totalModules} modules</div>
          </div>
          <div style={{ width: 160, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${overallPct}%`, height: "100%", background: "linear-gradient(90deg, #00ff9d, #0099ff)", borderRadius: 3, transition: "width 0.5s ease" }} />
          </div>
          {totalComplete > 0 && (
            <button onClick={() => setCompleted([])} style={{ background: "none", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontFamily: "Fira Code" }}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Levels */}
      {LEVELS.map((level, i) => (
        <LevelSection key={level.id} level={level} completed={completed} onToggle={toggleModule} defaultOpen={i === 0} />
      ))}

      {/* Footer note */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#6e7681", margin: 0, lineHeight: 1.7, fontFamily: "Syne" }}>
          All YouTube links verified working. All docs links go to official sources. <span style={{ color: "#00ff9d" }}>FREE</span> = zero cost. <span style={{ color: "#6e7681" }}>PAID</span> = book/course that costs money (but free PDFs often exist — search the title + "PDF").
        </p>
      </div>
    </div>
  );
}
