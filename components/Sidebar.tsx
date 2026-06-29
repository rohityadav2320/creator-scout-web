"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/", icon: "⬡", label: "Home" },
  { href: "/scrape", icon: "＋", label: "New Scrape" },
  { href: "/jobs", icon: "≡", label: "Jobs" },
  { href: "/creators", icon: "◫", label: "Creators" },
  { href: "/install", icon: "↓", label: "Install Agent" },
];

function isOnline(last_seen: string) {
  if (!last_seen) return false;
  return (Date.now() - new Date(last_seen).getTime()) < 40000;
}

export default function Sidebar() {
  const path = usePathname();
  const [agents, setAgents] = useState<{ label: string; last_seen: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("agents").select("label,last_seen");
      if (data) setAgents(data);
    };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const online = agents.filter((a) => isOnline(a.last_seen));

  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "#0d0d14",
      borderRight: "1px solid #1e1e2e",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
          🎬 Creator Scout
        </div>
        <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          by Vidrow
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
        {NAV.map(({ href, icon, label }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                background: active ? "#6366f115" : "transparent",
                color: active ? "#818cf8" : "#8888aa",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s",
                border: active ? "1px solid #6366f130" : "1px solid transparent",
              }}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Agents status */}
      <div style={{ padding: "16px 20px 0", borderTop: "1px solid #1e1e2e", marginTop: 16 }}>
        <div style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>
          Agents
        </div>
        {online.length === 0 ? (
          <div style={{ fontSize: 13, color: "#4a4a6a", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3a3a5a", display: "inline-block" }} />
            No agents online
          </div>
        ) : (
          online.map((a) => (
            <div key={a.label} style={{ fontSize: 13, color: "#a3e635", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a3e635", display: "inline-block", boxShadow: "0 0 6px #a3e635" }} />
              {a.label}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
