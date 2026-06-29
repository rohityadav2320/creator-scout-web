"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  queued:    { bg: "#1a1a0f", color: "#fbbf24", dot: "#fbbf24" },
  running:   { bg: "#0f1a2a", color: "#60a5fa", dot: "#60a5fa" },
  done:      { bg: "#0f2a0f", color: "#a3e635", dot: "#a3e635" },
  error:     { bg: "#2a0f0f", color: "#f87171", dot: "#f87171" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function JobsPage() {
  type Job = { id: string; status: string; type: string; created_at: string; created_by: string; params: Record<string, unknown>; result_count?: number; error?: string };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) setJobs(data as Job[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Jobs</h1>
          <p style={{ color: "#6b6b8a", fontSize: 14 }}>Live view — refreshes every 5s</p>
        </div>
        <button onClick={load} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "8px 16px", color: "#9999bb", fontSize: 13, cursor: "pointer" }}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#6b6b8a", fontSize: 14 }}>Loading...</div>
      ) : jobs.length === 0 ? (
        <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ color: "#6b6b8a", fontSize: 14 }}>No jobs yet. Queue a scrape from New Scrape.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {jobs.map((job) => {
            const s = job.status;
            const style = STATUS_STYLE[s] || STATUS_STYLE.queued;
            const params = job.params || {};
            const hashtags = (params.hashtags as string[]) || [];
            const feedTags = (params.feed_hashtags as string[]) || [];

            return (
              <div key={job.id} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: style.dot, flexShrink: 0, boxShadow: s === "running" ? `0 0 8px ${style.dot}` : "none" }} />
                <div style={{ background: "#1a1a28", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#8888cc", fontWeight: 600, flexShrink: 0 }}>
                  {job.type === "hashtag" ? "# Hashtag" : job.type === "reference" ? "👤 Reference" : "🎯 Feed"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e2e2f0", fontWeight: 500 }}>
                    {hashtags.length > 0 && <span>#{hashtags.slice(0, 3).join(", #")}{hashtags.length > 3 ? ` +${hashtags.length - 3}` : ""}</span>}
                    {feedTags.length > 0 && <span>Filter: #{feedTags.join(", #")}</span>}
                    {hashtags.length === 0 && feedTags.length === 0 && <span style={{ color: "#6b6b8a" }}>Trained feed (no filter)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 3 }}>
                    by {job.created_by} · max {params.max as number} · {timeAgo(job.created_at)}
                  </div>
                </div>
                <div style={{ background: style.bg, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: style.color, fontWeight: 600, flexShrink: 0 }}>
                  {s}
                </div>
                {job.result_count != null && (
                  <div style={{ fontSize: 13, color: "#818cf8", fontWeight: 600, flexShrink: 0 }}>{job.result_count} found</div>
                )}
                {job.error && (
                  <div style={{ fontSize: 12, color: "#f87171", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.error}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
