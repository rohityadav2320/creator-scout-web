"use client";

const MAC_LINK = "https://drive.google.com/file/d/1TdBpX70Ur-3ghphvsMspFm1tXm-1ge6F/view?usp=sharing";
const WIN_LINK = "https://drive.google.com/file/d/1qYL52UIHMxMK0EWF4zkoqwYmO-4n26nd/view?usp=sharing";

function Step({ num, title, desc, warn }: { num: string; title: string; desc: React.ReactNode; warn?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 20, paddingBottom: 32, borderBottom: "1px solid #1a1a28", marginBottom: 32 }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: "#6366f120",
        border: "2px solid #6366f150", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16, color: "#818cf8", fontWeight: 800, flexShrink: 0,
      }}>
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#9999bb", lineHeight: 1.8 }}>{desc}</div>
        {warn && (
          <div style={{ marginTop: 12, background: "#1a150a", border: "1px solid #5a3a0a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fbbf24", lineHeight: 1.7 }}>
            ⚠️ {warn}
          </div>
        )}
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 13, color: "#a3e635" }}>
      {children}
    </span>
  );
}

export default function InstallPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>📲 Install Agent</h1>
        <p style={{ color: "#6b6b8a", fontSize: 14 }}>Follow these steps once — then scraping is fully automatic from the dashboard.</p>
      </div>

      {/* Download buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 44 }}>
        <a href={MAC_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "2px solid #6366f150", borderRadius: 14, padding: "24px 20px",
            cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🍎</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Mac</div>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 14 }}>macOS · 66 MB</div>
            <div style={{ background: "#6366f1", borderRadius: 8, padding: "9px 0", fontSize: 14, color: "#fff", fontWeight: 700 }}>
              ⬇ Download
            </div>
          </div>
        </a>

        <a href={WIN_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "2px solid #6366f150", borderRadius: 14, padding: "24px 20px",
            cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🪟</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Windows</div>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 14 }}>Windows 10/11 · 65 MB</div>
            <div style={{ background: "#6366f1", borderRadius: 8, padding: "9px 0", fontSize: 14, color: "#fff", fontWeight: 700 }}>
              ⬇ Download
            </div>
          </div>
        </a>
      </div>

      {/* Steps */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "36px 32px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 32 }}>Setup Steps</h2>

        <Step
          num="1"
          title="Download the file for your laptop"
          desc={<span>Click the button above that matches your laptop (Mac or Windows).<br />Save the file to your <b style={{ color: "#e2e2f0" }}>Desktop</b> so you can find it easily.</span>}
        />

        <Step
          num="2"
          title="Open the file"
          desc={
            <span>
              <b style={{ color: "#e2e2f0" }}>On Mac:</b> Double-click the file.<br />
              If you see <i>&quot;cannot be opened because Apple cannot check it&quot;</i> →<br />
              &nbsp;&nbsp;→ <b style={{ color: "#e2e2f0" }}>Right-click</b> the file → click <b style={{ color: "#e2e2f0" }}>Open</b> → click <b style={{ color: "#e2e2f0" }}>Open</b> again in the popup.<br /><br />
              <b style={{ color: "#e2e2f0" }}>On Windows:</b> Double-click the file.<br />
              If you see a blue <i>&quot;Windows protected your PC&quot;</i> screen →<br />
              &nbsp;&nbsp;→ click <b style={{ color: "#e2e2f0" }}>More info</b> → then click <b style={{ color: "#e2e2f0" }}>Run anyway</b>.
            </span>
          }
          warn={<span>A black terminal window will open — <b>don&apos;t close it</b>. This is normal. Keep it running in the background.</span>}
        />

        <Step
          num="3"
          title="Type your name when asked"
          desc={
            <span>
              The terminal will say:<br />
              <Code>Enter your name (e.g. Priya):</Code><br /><br />
              Type your name and press <b style={{ color: "#e2e2f0" }}>Enter</b>.<br /><br />
              You&apos;ll then see: <Code>Agent &apos;YourName&apos; online. Watching for jobs…</Code><br /><br />
              ✅ You&apos;re done! Your name will be saved — next time it starts automatically.
            </span>
          }
        />

        <Step
          num="4"
          title="Log into Instagram (first scrape only)"
          desc={
            <span>
              When the first scrape job runs, a <b style={{ color: "#e2e2f0" }}>Chrome window</b> will open showing the Instagram login page.<br /><br />
              Log in with your Instagram account. After login, Chrome will close automatically.<br /><br />
              ✅ Your login is saved on your laptop — you won&apos;t need to log in again.
            </span>
          }
          warn={<span>This Chrome window is opened by the agent — it&apos;s safe. Just log in normally. Your password is never shared with anyone.</span>}
        />

        <div style={{ background: "#0d0d14", border: "1px solid #2a2a3a", borderRadius: 10, padding: "18px 22px", marginTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e2f0", marginBottom: 12 }}>📋 Important reminders</div>
          {[
            ["First run only", "downloads Chrome in the background (~2 min) — this is normal, just wait"],
            ["Keep terminal open", "while scraping — minimise it, but don't close it"],
            ["To stop", "click the terminal and press Ctrl + C  (or just close it)"],
            ["To restart", "double-click the file again — no setup, just opens and runs"],
            ["Session expires", "if you don't scrape for 2–3 weeks, Instagram will ask you to log in again"],
          ].map(([k, v]) => (
            <div key={k} style={{ fontSize: 13, color: "#9999bb", marginBottom: 8, display: "flex", gap: 10 }}>
              <span style={{ color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>›</span>
              <span><b style={{ color: "#c7d2fe" }}>{k}</b> — {v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
