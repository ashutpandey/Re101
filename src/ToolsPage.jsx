import { useState, useEffect } from "react";
import { toolsAPI } from "./services/api";

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
  const [selectedTool, setSelectedTool] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await toolsAPI.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tools data');
        console.error('Error fetching tools:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const cat = categories.find(c => c._id === activeCategory);

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

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6e7681" }}>
          Loading tools...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "40px", color: "#ff4d6d" }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category tabs + filter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c._id} onClick={() => setActiveCategory(c._id)} style={{
                  background: activeCategory === c._id ? `${c.categoryColor}15` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeCategory === c._id ? c.categoryColor + "50" : "rgba(255,255,255,0.06)"}`,
                  color: activeCategory === c._id ? c.categoryColor : "#6e7681",
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  fontSize: 11, fontWeight: 600, fontFamily: "Fira Code",
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>{c.categoryIcon}</span> {c.categoryLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Category description */}
          {cat && (
            <div style={{ marginBottom: 20, padding: "10px 14px", background: `${cat.categoryColor}08`, border: `1px solid ${cat.categoryColor}20`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, filter: `drop-shadow(0 0 6px ${cat.categoryColor})` }}>{cat.categoryIcon}</span>
              <span style={{ fontSize: 12, color: "#8b949e", fontFamily: "Syne" }}>{cat.categoryDesc}</span>
            </div>
          )}

          {/* Tools grid */}
          {cat && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {cat.tools.map((t, i) => (
                <div key={t._id || i} style={{
                  display: "flex", flexDirection: "column", gap: 10,
                  padding: 16, background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.categoryColor}40`; e.currentTarget.style.background = `${cat.categoryColor}06`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onClick={() => setSelectedTool(t)}
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
                    <span style={{ marginLeft: "auto", fontSize: 11, color: cat.categoryColor, fontFamily: "Fira Code" }}>Details</span>
                  </div>
                </div>
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
        </>
      )}

      {/* Tool Details Modal */}
      {selectedTool && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20,
        }} onClick={() => setSelectedTool(null)}>
          <div style={{
            background: "rgba(13,17,23,0.95)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: 24, maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#e6edf3", margin: "0 0 4px", fontFamily: "Syne" }}>{selectedTool.name}</h2>
                <div style={{ fontSize: 12, color: "#6e7681", fontFamily: "Fira Code" }}>{selectedTool.platform} • {selectedTool.level}</div>
              </div>
              <button onClick={() => setSelectedTool(null)} style={{
                background: "none", border: "none", color: "#6e7681", cursor: "pointer", fontSize: 18,
              }}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: "#8b949e", margin: "0 0 20px", lineHeight: 1.6, fontFamily: "Syne" }}>{selectedTool.desc}</p>
            
            {selectedTool.commonCommands && selectedTool.commonCommands !== "N/A" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#00ff9d", marginBottom: 8, fontFamily: "Fira Code" }}>COMMON COMMANDS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Array.isArray(selectedTool.commonCommands) ? 
                    selectedTool.commonCommands.map((cmd, idx) => (
                      <span key={idx} style={{
                        fontSize: 11, color: "#e6edf3", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 8px",
                        fontFamily: "Fira Code",
                      }}>{cmd}</span>
                    )) : (
                      <span style={{
                        fontSize: 11, color: "#e6edf3", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 8px",
                        fontFamily: "Fira Code",
                      }}>{selectedTool.commonCommands}</span>
                    )
                  }
                </div>
              </div>
            )}
            
            {selectedTool.automationScripts && selectedTool.automationScripts !== "N/A" && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f5a623", marginBottom: 8, fontFamily: "Fira Code" }}>AUTOMATION SCRIPTS</div>
                <p style={{ fontSize: 12, color: "#8b949e", margin: 0, lineHeight: 1.6, fontFamily: "Syne" }}>{selectedTool.automationScripts}</p>
              </div>
            )}
            
            <a href={selectedTool.url} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, color: "#0099ff", textDecoration: "none",
              background: "rgba(0,153,255,0.06)", border: "1px solid rgba(0,153,255,0.2)",
              borderRadius: 6, padding: "8px 12px", fontWeight: 600, fontFamily: "Fira Code",
            }}>
              Visit Website ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
