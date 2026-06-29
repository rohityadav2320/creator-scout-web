"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: "24px 28px", flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || "#fff", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState({ creators: 0, jobs: 0, todayJobs: 0, agents: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: creators }, { count: jobs }, { data: agentData }, { count: todayJobs }] = await Promise.all([
        supabase.from("reels").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("agents").select("last_seen"),
        supabase.from("jobs").select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
      ]);
      const online = (agentData || []).filter((a: { last_seen: string }) =>
        a.last_seen && Date.now() - new Date(a.last_seen).getTime() < 40000
      ).length;
      setStats({ creators: creators || 0, jobs: jobs || 0, todayJobs: todayJobs || 0, agents: online });
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Welcome to Creator Scout 👋</h1>
        <p style={{ color: "#6b6b8a", fontSize: 15 }}>Discover Instagram creators for Vidrow — fast, automated, zero manual effort.</p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
        <StatCard label="Total Creators" value={stats.creators.toLocaleString()} color="#818cf8" />
        <StatCard label="Total Jobs" value={stats.jobs} />
        <StatCard label="Jobs Today" value={stats.todayJobs} />
        <StatCard label="Agents Online" value={stats.agents} color={stats.agents > 0 ? "#a3e635" : "#6b6b8a"} />
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { href: "/scrape", label: "＋ New Scrape", desc: "Queue a new scraping job", accent: true },
            { href: "/creators", label: "◫ View Creators", desc: "Browse & export creators", accent: false },
            { href: "/jobs", label: "≡ View Jobs", desc: "Check scraping progress", accent: false },
            { href: "/install", label: "↓ Install Agent", desc: "Set up on your laptop", accent: false },
          ].map(({ href, label, desc, accent }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                background: accent ? "#6366f1" : "#111118",
                border: `1px solid ${accent ? "#6366f1" : "#1e1e2e"}`,
                borderRadius: 10, padding: "16px 20px", cursor: "pointer", minWidth: 180,
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: accent ? "#c7d2fe" : "#6b6b8a" }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>How it works</h2>
        {[
          ["1", "Agent runs on your laptop", "Double-click the app — connects automatically"],
          ["2", "Queue a scrape", "Pick hashtags or trained feed, set count, click Scrape"],
          ["3", "Agent runs it", "Chrome opens, scrapes Instagram, saves creators to DB"],
          ["4", "Browse & export", "Filter creators, export to Excel, share with team"],
        ].map(([num, title, desc]) => (
          <div key={num} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid #1a1a28" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f115", border: "1px solid #6366f130", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#818cf8", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
              {num}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e2f0", marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#6b6b8a" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
