"use client";
import { useState } from "react";

const MAC_LINK = "https://github.com/rohityadav2320/creator-scout-agent/releases/latest/download/CreatorScout-Agent-Mac";
const WIN_LINK = "https://github.com/rohityadav2320/creator-scout-agent/releases/latest/download/CreatorScout-Agent-Windows.exe";

const MAC_COMMANDS = `xattr -cr ~/Desktop/CreatorScout/CreatorScout-Agent-Mac
chmod +x ~/Desktop/CreatorScout/CreatorScout-Agent-Mac
cd ~/Desktop/CreatorScout && ./CreatorScout-Agent-Mac`;

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", background: "#0d0d14", border: "1px solid #2a2a3a", borderRadius: 8, padding: "14px 16px", marginTop: 12 }}>
      <pre style={{ margin: 0, fontSize: 13, color: "#a3e635", fontFamily: "monospace", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{text}</pre>
      <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        style={{ position: "absolute", top: 10, right: 10, background: copied ? "#166534" : "#1e1e2e", border: "1px solid #3a3a5a", borderRadius: 6, padding: "4px 10px", color: copied ? "#a3e635" : "#9999bb", fontSize: 12, cursor: "pointer" }}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function Step({ num, title, desc }: { num: number; title: string; desc: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 36 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#9999bb", lineHeight: 1.8 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function InstallPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>📲 Install Agent</h1>
        <p style={{ color: "#6b6b8a", fontSize: 14 }}>Follow these steps once. After setup, just double-click to start scraping.</p>
      </div>

      {/* Download buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 44 }}>
        <a href={MAC_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ background: "#1a1a2e", border: "2px solid #6366f150", borderRadius: 14, padding: "24px 20px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🍎</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Mac</div>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 14 }}>macOS · 66 MB</div>
            <div style={{ background: "#6366f1", borderRadius: 8, padding: "9px 0", fontSize: 14, color: "#fff", fontWeight: 700 }}>⬇ Download</div>
          </div>
        </a>
        <a href={WIN_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ background: "#1a1a2e", border: "2px solid #6366f150", borderRadius: 14, padding: "24px 20px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🪟</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Download for Windows</div>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 14 }}>Windows 10/11 · 65 MB</div>
            <div style={{ background: "#6366f1", borderRadius: 8, padding: "9px 0", fontSize: 14, color: "#fff", fontWeight: 700 }}>⬇ Download</div>
          </div>
        </a>
      </div>

      {/* Mac Steps */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "36px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 32 }}>🍎 Mac Setup</h2>

        <Step num={1} title="Download the agent" desc={
          <span>Click <b style={{ color: "#fff" }}>Download for Mac</b> above.<br />
          If Google warns "can&apos;t scan this file" — click <b style={{ color: "#fff" }}>Download anyway</b>. That&apos;s normal.</span>
        } />

        <Step num={2} title="Create a folder on your Desktop" desc={
          <span>On your Desktop, make a new folder called <b style={{ color: "#fff" }}>CreatorScout</b>.<br />
          Move the downloaded file <b style={{ color: "#fff" }}>CreatorScout-Agent-Mac</b> into that folder.</span>
        } />

        <Step num={3} title="Save your name in a file" desc={
          <span>Open <b style={{ color: "#fff" }}>TextEdit</b> → go to <b style={{ color: "#fff" }}>Format → Make Plain Text</b>.<br />
          Type just your name (e.g. <b style={{ color: "#fff" }}>Priya</b>) and save the file as <b style={{ color: "#fff" }}>agent_account.txt</b> inside the <b style={{ color: "#fff" }}>CreatorScout</b> folder.</span>
        } />

        <Step num={4} title="Unblock and run (Terminal)" desc={
          <span>
            Open <b style={{ color: "#fff" }}>Terminal</b> (Cmd+Space → type Terminal → Enter).<br />
            Copy all 3 lines below and paste into Terminal, then press Enter:
            <CopyBlock text={MAC_COMMANDS} />
            <br />
            The first two lines unblock the app (one-time only). The third line runs it.<br /><br />
            You&apos;ll see: <span style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 12, color: "#a3e635" }}>Agent &apos;YourName&apos; online. Watching for jobs…</span>
          </span>
        } />

        <Step num={5} title="First run downloads the browser" desc={
          <span>First time only — it downloads Chrome (~150 MB) automatically. Wait ~2 min. When you see <b style={{ color: "#fff" }}>"Watching for jobs…"</b> it&apos;s ready.<br /><br />
          Keep this Terminal window open while scraping. Minimise is fine, don&apos;t close it.</span>
        } />

        <Step num={6} title="Log into Instagram (first scrape only)" desc={
          <span>When the first scrape runs, a Chrome window opens — log in with your Instagram account. Login is saved on your laptop only, never shared.<br /><br />
          ✅ After this, everything is automatic. Next time just run line 3 from Terminal.</span>
        } />
      </div>

      {/* Windows Steps */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "36px 32px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 32 }}>🪟 Windows Setup</h2>

        <Step num={1} title="Download and run" desc={
          <span>Click <b style={{ color: "#fff" }}>Download for Windows</b> above and run the <b style={{ color: "#fff" }}>.exe</b> file.<br /><br />
          If a blue screen appears saying "Windows protected your PC" →<br />
          click <b style={{ color: "#fff" }}>More info</b> → then <b style={{ color: "#fff" }}>Run anyway</b>.</span>
        } />

        <Step num={2} title="Type your name" desc={
          <span>A black window opens and asks: <span style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 12, color: "#a3e635" }}>Enter your name:</span><br /><br />
          Type your name and press Enter. You&apos;ll see <b style={{ color: "#fff" }}>"Watching for jobs…"</b> — done!<br /><br />
          Keep this window open while scraping.</span>
        } />
      </div>
    </div>
  );
}
