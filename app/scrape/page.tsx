"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const HASHTAG_SUGGESTIONS = [
  "fashionreels", "ootd", "streetstyle", "skincare", "makeuptutorial",
  "fitnessmotivation", "gymlife", "foodie", "travelgram", "homecooking",
  "techreview", "gadgets", "studymotivation", "entrepreneur", "digitalmarketing",
];

function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, color: "#9999bb", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 8,
          padding: "10px 14px", color: "#e2e2f0", fontSize: 14, outline: "none",
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, color: "#9999bb", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 8,
          padding: "10px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", cursor: "pointer",
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ScrapePage() {
  const [agents, setAgents] = useState<{ label: string; last_seen: string; ig_account?: string }[]>([]);
  const [scrapeType, setScrapeType] = useState("hashtag");
  const [agent, setAgent] = useState("");
  const [igAccount, setIgAccount] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [feedHashtags, setFeedHashtags] = useState("");
  const [maxCreators, setMaxCreators] = useState("30");
  const [minFollowers, setMinFollowers] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onlineAgents = agents.filter((a) => a.last_seen && Date.now() - new Date(a.last_seen).getTime() < 40000);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("agents").select("label,last_seen,ig_account");
      if (data) setAgents(data);
    };
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!agent) { setError("Select an agent first."); return; }
    if (!igAccount) { setError("Enter an Instagram account."); return; }
    if (scrapeType === "hashtag" && !hashtags.trim()) { setError("Enter at least one hashtag."); return; }

    setSubmitting(true);
    const params: Record<string, unknown> = {
      max: parseInt(maxCreators) || 30,
      min_followers: parseInt(minFollowers) || 0,
      ig_account: igAccount,
    };

    if (scrapeType === "hashtag") {
      params.hashtags = hashtags.split(/[,\s]+/).map((h) => h.trim().replace(/^#/, "")).filter(Boolean);
    } else {
      const ft = feedHashtags.split(/[,\s]+/).map((h) => h.trim().replace(/^#/, "")).filter(Boolean);
      if (ft.length) params.feed_hashtags = ft;
    }

    const { error: err } = await supabase.from("jobs").insert({
      type: scrapeType,
      status: "queued",
      params,
      created_by: agent,
      created_at: new Date().toISOString(),
    });

    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess(`✅ Job queued! ${agent}'s agent will pick it up shortly.`);
    setHashtags(""); setFeedHashtags("");
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>New Scrape</h1>
        <p style={{ color: "#6b6b8a", fontSize: 14 }}>Queue a job — your agent picks it up automatically.</p>
      </div>

      {/* Agent status bar */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        {onlineAgents.length > 0 ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a3e635", boxShadow: "0 0 8px #a3e635", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "#a3e635", fontWeight: 500 }}>
              {onlineAgents.map((a) => a.label).join(", ")} online
            </span>
          </>
        ) : (
          <>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a3a5a", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "#6b6b8a" }}>No agents online — start the agent app first</span>
          </>
        )}
      </div>

      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: 28 }}>

        {/* Scrape type toggle */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#9999bb", fontWeight: 500, display: "block", marginBottom: 8 }}>Scrape Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { value: "hashtag", label: "# Hashtag Search" },
              { value: "trained_feed", label: "🎯 Trained Feed" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setScrapeType(t.value)}
                style={{
                  padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: scrapeType === t.value ? "#6366f1" : "#0d0d14",
                  border: `1px solid ${scrapeType === t.value ? "#6366f1" : "#1e1e2e"}`,
                  color: scrapeType === t.value ? "#fff" : "#6b6b8a",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agent */}
        <Select
          label="Run on (agent)"
          value={agent}
          onChange={setAgent}
          options={[
            { value: "", label: onlineAgents.length ? "Select agent..." : "(no agents online)" },
            ...onlineAgents.map((a) => ({ value: a.label, label: `🟢 ${a.label}` })),
          ]}
        />

        {/* IG Account */}
        <Input label="Instagram Account" value={igAccount} onChange={setIgAccount} placeholder="e.g. my_burner_account" />

        {/* Hashtag specific */}
        {scrapeType === "hashtag" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: "#9999bb", fontWeight: 500, display: "block", marginBottom: 6 }}>Hashtags</label>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="fashionreels, ootd, streetstyle"
                rows={3}
                style={{
                  width: "100%", background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 8,
                  padding: "10px 14px", color: "#e2e2f0", fontSize: 14, outline: "none", resize: "vertical",
                }}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {HASHTAG_SUGGESTIONS.map((h) => (
                  <span
                    key={h}
                    onClick={() => setHashtags((prev) => prev ? `${prev}, ${h}` : h)}
                    style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#1a1a28",
                      color: "#8888aa", cursor: "pointer", border: "1px solid #2a2a3a",
                    }}
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trained feed specific */}
        {scrapeType === "trained_feed" && (
          <Input
            label="Filter by Hashtags (optional)"
            value={feedHashtags}
            onChange={setFeedHashtags}
            placeholder="fashionreels, ootd (leave empty for all)"
          />
        )}

        {/* Max creators + min followers */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Input label="Max Creators" value={maxCreators} onChange={setMaxCreators} type="number" />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Min Followers" value={minFollowers} onChange={setMinFollowers} type="number" />
          </div>
        </div>

        {/* Error / success */}
        {error && (
          <div style={{ background: "#2a0f0f", border: "1px solid #5a1a1a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#0f2a0f", border: "1px solid #1a5a1a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#a3e635" }}>
            {success}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, fontSize: 15, fontWeight: 700,
            background: submitting ? "#3f3f6e" : "#6366f1", border: "none", color: "#fff",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Queuing..." : "🚀 Start Scrape"}
        </button>
      </div>
    </div>
  );
}
