"use client";

const MAC_LINK = "https://drive.google.com/file/d/1TdBpX70Ur-3ghphvsMspFm1tXm-1ge6F/view?usp=sharing";
const WIN_LINK = "https://drive.google.com/file/d/1qYL52UIHMxMK0EWF4zkoqwYmO-4n26nd/view?usp=sharing";

function Step({ num, title, desc }: { num: string; title: string; desc: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 20, paddingBottom: 28, borderBottom: "1px solid #1a1a28", marginBottom: 28 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: "#6366f115",
        border: "1px solid #6366f140", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 14, color: "#818cf8", fontWeight: 700, flexShrink: 0,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e2f0", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#9999bb", lineHeight: 1.7 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function InstallPage() {
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>📲 Install Agent</h1>
        <p style={{ color: "#6b6b8a", fontSize: 14 }}>Run scrapes from your laptop. One-time download — just double-click to start.</p>
      </div>

      {/* Download buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
        <a href={MAC_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "1px solid #6366f140", borderRadius: 14, padding: "24px 20px",
            cursor: "pointer", textAlign: "center", transition: "border-color 0.2s",
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🍎</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Mac</div>
            <div style={{ fontSize: 12, color: "#6b6b8a" }}>macOS · 66 MB</div>
            <div style={{ marginTop: 14, background: "#6366f1", borderRadius: 8, padding: "8px 0", fontSize: 13, color: "#fff", fontWeight: 600 }}>
              ⬇ Download
            </div>
          </div>
        </a>

        <a href={WIN_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "1px solid #6366f140", borderRadius: 14, padding: "24px 20px",
            cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🪟</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Windows</div>
            <div style={{ fontSize: 12, color: "#6b6b8a" }}>Windows 10/11 · 65 MB</div>
            <div style={{ marginTop: 14, background: "#6366f1", borderRadius: 8, padding: "8px 0", fontSize: 13, color: "#fff", fontWeight: 600 }}>
              ⬇ Download
            </div>
          </div>
        </a>
      </div>

      {/* Steps */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "32px 28px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 28 }}>Setup — 3 steps only</h2>

        <Step
          num="1"
          title="Download for your OS"
          desc="Click the button above. Save the file anywhere (Desktop is fine)."
        />

        <Step
          num="2"
          title="Double-click to open"
          desc={
            <span>
              <b style={{ color: "#e2e2f0" }}>Mac:</b> If you see "cannot be opened" → Right-click → <b style={{ color: "#e2e2f0" }}>Open</b> → Open again.<br />
              <b style={{ color: "#e2e2f0" }}>Windows:</b> If SmartScreen appears → <b style={{ color: "#e2e2f0" }}>More info</b> → <b style={{ color: "#e2e2f0" }}>Run anyway</b>.
            </span>
          }
        />

        <Step
          num="3"
          title="Type your name → Done! 🚀"
          desc={
            <span>
              A terminal opens. On first run, type your name → press Enter.<br />
              You'll see: <span style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 13, color: "#a3e635" }}>Agent &apos;YourName&apos; online. Watching for jobs…</span><br /><br />
              Go to <b style={{ color: "#818cf8" }}>New Scrape</b>, queue a job — it runs on your laptop automatically.
            </span>
          }
        />

        <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e2f0", marginBottom: 10 }}>📋 Good to know</div>
          {[
            ["First run", "downloads Chrome (~150 MB) — takes ~2 min, once only"],
            ["Keep terminal open", "while scraping (minimise is fine, don't close)"],
            ["Stop agent", "press Ctrl + C in the terminal"],
            ["Restart", "double-click the file again — no setup needed"],
            ["Instagram login", "saved on your machine only, never shared"],
          ].map(([k, v]) => (
            <div key={k} style={{ fontSize: 13, color: "#9999bb", marginBottom: 6, display: "flex", gap: 8 }}>
              <span style={{ color: "#6366f1", fontWeight: 600, flexShrink: 0 }}>•</span>
              <span><b style={{ color: "#c7d2fe" }}>{k}</b> — {v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
