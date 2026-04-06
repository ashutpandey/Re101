import { useState, useEffect } from "react";
import { peopleAPI, blogsAPI } from "./services/api";

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
  "Learning": "#00ff9d", "Exploit Research": "#f87171",
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
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [people, setPeople] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [peopleData, blogsData] = await Promise.all([
          peopleAPI.getAll(),
          blogsAPI.getAll()
        ]);
        setPeople(peopleData);
        setBlogs(blogsData);
        setError(null);
      } catch (err) {
        setError('Failed to load community data');
        console.error('Error fetching community data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6e7681" }}>
              Loading community...
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "40px", color: "#ff4d6d" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
                These are the researchers, analysts, and journalists doing the most important public work. Follow all of them on X/Twitter.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
                {people.map((p) => (
                  <div key={p._id} style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10,
                    transition: "all 0.2s", cursor: "pointer",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${TAG_COLORS[p.tag] || "#6e7681"}40`; e.currentTarget.style.background = `${TAG_COLORS[p.tag] || "#6e7681"}06`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onClick={() => setSelectedPerson(p)}
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
                    <div style={{ fontSize: 11, color: "#0099ff", fontFamily: "Fira Code", textAlign: "center" }}>Click for About</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Blogs */}
      {activeSection === "Blogs" && (
        <div>
          <p style={{ fontSize: 12, color: "#6e7681", marginBottom: 20, fontFamily: "Syne", lineHeight: 1.7 }}>
            These are the blogs worth reading regularly. Subscribe via RSS or check weekly. Quality over volume.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(showAllBlogs ? blogs : blogs.slice(0, 5)).map((b) => (
              <a key={b._id} href={b.url} target="_blank" rel="noreferrer" style={{
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
          {!showAllBlogs && blogs.length > 5 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => setShowAllBlogs(true)} style={{
                background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.2)",
                color: "#0099ff", padding: "8px 16px", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "Fira Code",
              }}>
                Show All Blogs ({blogs.length})
              </button>
            </div>
          )}
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

      {/* Person About Modal */}
      {selectedPerson && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20,
        }} onClick={() => setSelectedPerson(null)}>
          <div style={{
            background: "rgba(13,17,23,0.95)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: 24, maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#e6edf3", margin: "0 0 4px", fontFamily: "Syne" }}>{selectedPerson.name}</h2>
                <div style={{ fontSize: 12, color: "#6e7681", fontFamily: "Fira Code" }}>{selectedPerson.handle}</div>
              </div>
              <button onClick={() => setSelectedPerson(null)} style={{
                background: "none", border: "none", color: "#6e7681", cursor: "pointer", fontSize: 18,
              }}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: "#8b949e", margin: "0 0 20px", lineHeight: 1.6, fontFamily: "Syne" }}>{selectedPerson.desc}</p>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00ff9d", marginBottom: 8, fontFamily: "Fira Code" }}>BLOGS & WORK</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedPerson.blogs.map((blog, idx) => (
                  <span key={idx} style={{
                    fontSize: 11, color: "#e6edf3", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 8px",
                    fontFamily: "Fira Code",
                  }}>{blog}</span>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f5a623", marginBottom: 8, fontFamily: "Fira Code" }}>BEST WORK</div>
              <p style={{ fontSize: 12, color: "#8b949e", margin: 0, lineHeight: 1.6, fontFamily: "Syne" }}>{selectedPerson.bestWork}</p>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0099ff", marginBottom: 8, fontFamily: "Fira Code" }}>WHY FOLLOW</div>
              <p style={{ fontSize: 12, color: "#6e7681", margin: 0, lineHeight: 1.6, fontFamily: "Syne" }}>{selectedPerson.why}</p>
            </div>
            
            <a href={selectedPerson.url} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, color: "#0099ff", textDecoration: "none",
              background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.2)",
              borderRadius: 6, padding: "8px 12px", fontWeight: 600, fontFamily: "Fira Code",
            }}>
              Follow on X ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
