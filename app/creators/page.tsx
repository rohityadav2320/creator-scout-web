"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Creator = {
  username: string;
  followers: number;
  bio: string;
  category: string;
  engagement_rate: number;
  contact_email: string;
  external_url: string;
  scraped_by: string;
  reel_url: string;
};

function fmt(n: number) {
  if (!n) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function CreatorsPage() {
  const [all, setAll] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
  const [minFol, setMinFol] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("reels")
        .select("username,followers,bio,category,engagement_rate,contact_email,external_url,scraped_by,reel_url")
        .order("followers", { ascending: false });
      if (data) {
        // Dedupe by username
        const seen = new Set<string>();
        const unique = (data as Creator[]).filter((c) => { if (seen.has(c.username)) return false; seen.add(c.username); return true; });
        setAll(unique);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = all.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.username?.toLowerCase().includes(q) || c.bio?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const matchFol = !minFol || (c.followers || 0) >= parseInt(minFol);
    return matchSearch && matchFol;
  });

  const downloadCSV = () => {
    const headers = ["username", "followers", "engagement_rate", "bio", "category", "contact_email", "external_url", "reel_url"];
    const rows = filtered.map((c) => headers.map((h) => JSON.stringify((c as Record<string, unknown>)[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "creators.csv"; a.click();
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Creators</h1>
          <p style={{ color: "#6b6b8a", fontSize: 14 }}>{filtered.length} of {all.length} creators</p>
        </div>
        <button
          onClick={downloadCSV}
          style={{ background: "#6366f1", border: "none", borderRadius: 8, padding: "9px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username, bio, category..."
          style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "9px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", flex: 1, minWidth: 220 }}
        />
        <input
          value={minFol}
          onChange={(e) => setMinFol(e.target.value)}
          placeholder="Min followers"
          type="number"
          style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "9px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", width: 150 }}
        />
      </div>

      {loading ? (
        <div style={{ color: "#6b6b8a", fontSize: 14 }}>Loading creators...</div>
      ) : (
        <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                {["Username", "Followers", "Eng. Rate", "Category", "Email", "Bio", "Reel"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#6b6b8a", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#6b6b8a", fontSize: 14 }}>No creators found.</td></tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.username} style={{ borderBottom: "1px solid #15151f", background: i % 2 === 0 ? "transparent" : "#0d0d14" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={`https://instagram.com/${c.username}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#818cf8", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                        @{c.username}
                      </a>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#e2e2f0", fontWeight: 500 }}>{fmt(c.followers)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: c.engagement_rate > 3 ? "#a3e635" : "#e2e2f0" }}>
                      {c.engagement_rate ? `${c.engagement_rate.toFixed(1)}%` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12 }}>
                      {c.category ? (
                        <span style={{ background: "#1a1a28", borderRadius: 6, padding: "2px 8px", color: "#8888cc" }}>{c.category}</span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6b8a" }}>{c.contact_email || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9999bb", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.bio || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {c.reel_url ? (
                        <a href={c.reel_url} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", fontSize: 12 }}>View ↗</a>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
