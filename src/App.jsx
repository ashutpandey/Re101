import { useState } from "react";
import RoadmapPage from "./RoadmapPage";
import ThreatFeedPage from "./ThreatFeedPage";
import CommunityPage from "./CommunityPage";
import ToolsPage from "./ToolsPage";

const NAV = [
  { id: "roadmap", label: "Roadmap", icon: "◈", desc: "Your learning path" },
  { id: "feed", label: "Threat Feed", icon: "⟁", desc: "Live intel" },
  { id: "community", label: "Community", icon: "⬡", desc: "People & places" },
  { id: "tools", label: "Tools", icon: "✦", desc: "Arsenal" },
];

export default function App() {
  const [page, setPage] = useState("roadmap");

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Fira Code', 'JetBrains Mono', monospace", color: "#c9d1d9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Top nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(7,9,15,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", padding: "0 28px", height: 56,
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 40, cursor: "pointer" }} onClick={() => setPage("roadmap")}>
          <div style={{
            width: 28, height: 28, background: "linear-gradient(135deg, #00ff9d, #0099ff)",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#07090f"
          }}>R</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", fontFamily: "Syne", letterSpacing: -0.3 }}>
            RE<span style={{ color: "#00ff9d" }}>verse</span>
          </span>
        </div>

        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: page === n.id ? "rgba(0,255,157,0.08)" : "none",
            border: "none",
            borderBottom: `2px solid ${page === n.id ? "#00ff9d" : "transparent"}`,
            color: page === n.id ? "#00ff9d" : "#6e7681",
            padding: "0 18px", height: 56, cursor: "pointer",
            fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 7,
            fontFamily: "Fira Code",
          }}>
            <span style={{ fontSize: 14 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}

        <div style={{ marginLeft: "auto", fontSize: 10, color: "#3d444d", letterSpacing: 1 }}>
          REVERSING ROADMAP v2.0
        </div>
      </nav>

      {/* Page content */}
      <div>
        {page === "roadmap" && <RoadmapPage />}
        {page === "feed" && <ThreatFeedPage />}
        {page === "community" && <CommunityPage />}
        {page === "tools" && <ToolsPage />}
      </div>
    </div>
  );
}
