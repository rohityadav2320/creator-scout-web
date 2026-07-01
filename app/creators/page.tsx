"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Creator = {
  reel_url: string;
  username: string;
  followers: number;
  engagement_rate: number;
  contact_email: string;
  bio: string;
  category: string;
  notes: string;
  scraped_by: string;
  scraped_from: string;
};

function fmt(n: number) {
  if (!n) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function CreatorsPage() {
  const [all, setAll] = useState<Creator[]>([]);
  const [edited, setEdited] = useState<Record<string, { notes?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [sheetMsg, setSheetMsg] = useState("");
  const [search, setSearch] = useState("");
  const [minFol, setMinFol] = useState("");
  const [maxFol, setMaxFol] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = async () => {
    const { data } = await supabase
      .from("reels")
      .select("reel_url,username,followers,engagement_rate,contact_email,bio,category,notes,scraped_by,scraped_from")
      .order("first_scraped", { ascending: false })
      .limit(5000);
    if (data) {
      const seen = new Set<string>();
      const unique = (data as Creator[]).filter(c => {
        if (seen.has(c.username)) return false;
        seen.add(c.username); return true;
      });
      setAll(unique.map(c => ({ ...c, notes: c.notes || "" })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = all.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.username?.toLowerCase().includes(q) || c.bio?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const matchFol = (!minFol || (c.followers || 0) >= parseInt(minFol)) &&
                     (!maxFol || (c.followers || 0) <= parseInt(maxFol));
    return matchSearch && matchFol;
  });

  const getVal = (c: Creator, field: "notes") => edited[c.reel_url]?.[field] ?? c[field];

  const handleEdit = (reel_url: string, field: "notes", value: string) => {
    setEdited(prev => ({ ...prev, [reel_url]: { ...prev[reel_url], [field]: value } }));
  };

  const saveChanges = async () => {
    const changes = Object.entries(edited).map(([reel_url, vals]) => ({ reel_url, ...vals }));
    if (!changes.length) { setSaveMsg("No changes to save."); return; }
    setSaving(true);
    for (const c of changes) {
      await supabase.from("reels").update({ notes: c.notes }).eq("reel_url", c.reel_url);
    }
    setSaving(false);
    setEdited({});
    setSaveMsg(`✅ Saved ${changes.length} update(s).`);
    setTimeout(() => setSaveMsg(""), 3000);
    load();
  };

  const pushToSheet = async () => {
    const toSend = filtered.filter(c => selected.has(c.reel_url));
    if (!toSend.length) return;
    try {
      const r = await fetch("/api/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creators: toSend.map(c => ({ name: c.username, username: c.username, email: c.contact_email || "", language: "" })) }),
      });
      const data = await r.json();
      if (r.ok) {
        const added = data.added ?? toSend.length;
        setSheetMsg(`✅ Sent ${added} to sheet.`);
        setSelected(new Set());
      } else {
        setSheetMsg("❌ Sheet responded with error.");
      }
    } catch { setSheetMsg("❌ Could not reach sheet."); }
    setTimeout(() => setSheetMsg(""), 4000);
  };

  const downloadCSV = () => {
    const headers = ["username", "followers", "engagement_rate", "notes", "bio", "category", "contact_email", "reel_url"];
    const rows = filtered.map(c => headers.map(h => JSON.stringify((c as Record<string, unknown>)[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "creators.csv"; a.click();
  };

  const toggleSelect = (reel_url: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(reel_url) ? n.delete(reel_url) : n.add(reel_url); return n; });
  };

  const inputStyle = { background: "transparent", border: "none", outline: "none", color: "#e2e2f0", fontSize: 13, width: "100%", fontFamily: "inherit" };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Creators</h1>
          <p style={{ color: "#6b6b8a", fontSize: 14 }}>{filtered.length} of {all.length} creators</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={load} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "8px 14px", color: "#9999bb", fontSize: 13, cursor: "pointer" }}>↻ Refresh</button>
          <button onClick={saveChanges} disabled={saving || !Object.keys(edited).length} style={{ background: Object.keys(edited).length ? "#6366f1" : "#1e1e2e", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving..." : `💾 Save Changes${Object.keys(edited).length ? ` (${Object.keys(edited).length})` : ""}`}
          </button>
          <button onClick={pushToSheet} disabled={selected.size === 0} style={{ background: selected.size ? "#0f2a1a" : "#111118", border: `1px solid ${selected.size ? "#166534" : "#1e1e2e"}`, borderRadius: 8, padding: "8px 16px", color: selected.size ? "#a3e635" : "#6b6b8a", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            📤 Send {selected.size > 0 ? selected.size : ""} → Sheet
          </button>
          <button onClick={downloadCSV} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "8px 16px", color: "#9999bb", fontSize: 13, cursor: "pointer" }}>⬇ CSV</button>
        </div>
      </div>

      {/* Messages */}
      {saveMsg && <div style={{ background: saveMsg.startsWith("✅") ? "#0f2a0f" : "#2a0f0f", border: `1px solid ${saveMsg.startsWith("✅") ? "#166534" : "#7f1d1d"}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: saveMsg.startsWith("✅") ? "#a3e635" : "#f87171" }}>{saveMsg}</div>}
      {sheetMsg && <div style={{ background: sheetMsg.startsWith("✅") ? "#0f2a0f" : "#2a0f0f", border: `1px solid ${sheetMsg.startsWith("✅") ? "#166534" : "#7f1d1d"}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: sheetMsg.startsWith("✅") ? "#a3e635" : "#f87171" }}>{sheetMsg}</div>}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔎 Search username, bio, category..."
          style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "9px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", flex: 1, minWidth: 220 }} />
        <input value={minFol} onChange={e => setMinFol(e.target.value)} placeholder="Min followers" type="number"
          style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "9px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", width: 140 }} />
        <input value={maxFol} onChange={e => setMaxFol(e.target.value)} placeholder="Max followers" type="number"
          style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "9px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", width: 140 }} />
      </div>

      {loading ? (
        <div style={{ color: "#6b6b8a", fontSize: 14 }}>Loading creators...</div>
      ) : all.length === 0 ? (
        <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
          <div style={{ color: "#6b6b8a", fontSize: 14 }}>No creators yet. Queue a scrape and let an agent run it.</div>
        </div>
      ) : (
        <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                <th style={{ padding: "12px 14px", width: 32 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(c => c.reel_url)) : new Set())}
                    checked={selected.size === filtered.length && filtered.length > 0} style={{ cursor: "pointer" }} />
                </th>
                {["Username", "Profile", "Reel", "Followers", "ER %", "Email", "Category", "Notes", "Agent", "IG Account"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#6b6b8a", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: 32, textAlign: "center", color: "#6b6b8a", fontSize: 14 }}>No creators match filters.</td></tr>
              ) : filtered.map((c, i) => {
                const notes = getVal(c, "notes");
                return (
                  <tr key={c.reel_url} style={{ borderBottom: "1px solid #15151f", background: i % 2 === 0 ? "transparent" : "#0d0d14" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <input type="checkbox" checked={selected.has(c.reel_url)} onChange={() => toggleSelect(c.reel_url)} style={{ cursor: "pointer" }} />
                    </td>
                    {/* Username */}
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ color: "#818cf8", fontWeight: 600, fontSize: 13 }}>@{c.username}</span>
                    </td>
                    {/* Profile & Reel — right next to username */}
                    <td style={{ padding: "10px 14px" }}>
                      <a href={`https://instagram.com/${c.username}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#6366f1", fontSize: 12 }}>Profile ↗</a>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      {c.reel_url ? <a href={c.reel_url} target="_blank" rel="noopener noreferrer" style={{ color: "#6b6b8a", fontSize: 12 }}>Reel ↗</a> : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#e2e2f0", fontWeight: 500 }}>{fmt(c.followers)}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: c.engagement_rate > 3 ? "#a3e635" : "#e2e2f0" }}>
                      {c.engagement_rate ? `${c.engagement_rate.toFixed(1)}%` : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#9999bb" }}>{c.contact_email || "—"}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12 }}>
                      {c.category ? <span style={{ background: "#1a1a28", borderRadius: 6, padding: "2px 8px", color: "#8888cc" }}>{c.category}</span> : "—"}
                    </td>
                    {/* Notes — editable */}
                    <td style={{ padding: "6px 14px", minWidth: 160 }}>
                      <input value={notes} onChange={e => handleEdit(c.reel_url, "notes", e.target.value)}
                        placeholder="Add note..." style={{ ...inputStyle, background: notes ? "#1a1a28" : "transparent", border: "1px solid transparent", borderRadius: 6, padding: "4px 8px" }}
                        onFocus={e => (e.target.style.borderColor = "#3a3a5a")}
                        onBlur={e => (e.target.style.borderColor = "transparent")} />
                    </td>
                    {/* Agent */}
                    <td style={{ padding: "10px 14px" }}>
                      {c.scraped_by ? (
                        <span style={{ background: "#1a1528", border: "1px solid #3a2a5a", borderRadius: 6, padding: "2px 8px", color: "#c084fc", fontSize: 12, fontWeight: 600 }}>{c.scraped_by}</span>
                      ) : <span style={{ color: "#3a3a5a", fontSize: 12 }}>—</span>}
                    </td>
                    {/* IG Account */}
                    <td style={{ padding: "10px 14px" }}>
                      {c.scraped_from ? (
                        <span style={{ background: "#0f1a2a", border: "1px solid #1e3a5a", borderRadius: 6, padding: "2px 8px", color: "#60a5fa", fontSize: 12 }}>@{c.scraped_from}</span>
                      ) : <span style={{ color: "#3a3a5a", fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
