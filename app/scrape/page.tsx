"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const HASHTAG_LIBRARY: Record<string, string[]> = {
  "😂 Hindi Comedy / Skits": ["hindicomedy","skitreels","hindifunny","comedyreels","funnyvideo","skitcomedy","comedyskit","hindicomedyreels","desicomedy","indiancomedy"],
  "🎤 English Comedy / Standup": ["standupcomedy","comedyvideo","englishcomedy","standupreels","comedyclips","funnycomedy","comedyshorts","humorreels","wittyreels","satire"],
  "💰 Personal Finance / Investing": ["personalfinanceindia","financereels","moneytalksindia","financetips","investingindia","stockmarketindia","wealthbuilding","financialfreedom","moneymanagement","mutualfunds"],
  "💪 Fitness / Gym / Workout": ["fitnessindia","gymreels","workoutreels","fitnessreels","gymlife","fitindia","bodybuilding","homeworkout","fitnessmotivation","indiafit"],
  "🧘 Yoga / Wellness": ["yogaindia","yogareels","yogavideo","yogalifestyle","meditationindia","wellnessreels","mindfulness","healthylifestyle","ayurveda","mentalhealth"],
  "👗 Fashion / OOTD": ["indianfashion","ootdindia","fashionreels","streetstyleindia","mensfashionindia","womensfashion","ethnicwear","indianstyle","fashionbloggerindia","lookoftheday"],
  "💄 Beauty / Makeup / Skincare": ["makeupindia","skincareindia","makeuptutorial","beautyhacks","skincareroutine","makeuplooks","beautybloggerindia","glowup","naturalskincare","hairtutorial"],
  "🍛 Food / Cooking / Recipes": ["foodieindia","indianfood","cookingvideo","recipevideo","homemaderecipes","streetfoodindia","foodreels","cookingtips","indianrecipes","quickrecipes"],
  "✈️ Travel / Vlog": ["travelvlog","travelindia","indiatravel","travelreels","incredibleindia","travelblogger","roadtrip","hillstation","backpacking","traveldiary"],
  "🔥 Motivation / Mindset": ["motivationinhindi","motivationreels","successmindset","selfimprovement","growthmindset","motivationalhindiquotes","lifelessons","positivity","personaldevelopment","hustle"],
  "🎙️ Podcast / Interview / Talk": ["podcastindia","podcastreels","indianpodcast","podcastclips","podcastinhindi","hindiinterview","talkshow","interviewreels","conversationreels","longformcontent"],
  "📚 Education / Facts / Tutorial": ["educationalreels","factsinhindi","educationindia","learnwithme","howtovideo","tipsandtricks","hacksinhindi","educationalcontent","didyouknow","sciencefacts"],
  "💃 Dance": ["dancereels","indiandance","bollywooddance","dancecover","danceindia","choreographyreels","danceperformance","classicaldance","folkdance","hindisongreels"],
  "🎵 Music / Singing / Cover": ["musicreels","singingreels","musicindia","originalmusic","unplugged","acousticcover","singersindia","hindicovers","musiccover","indiemusicindia"],
  "🎮 Gaming": ["gamingreels","indiagaming","mobilegaming","bgmiindia","freefireindia","gaminginhindi","gamingcreator","indgamer","gamingcommunity","gamertips"],
  "📱 Tech / Gadgets / Reviews": ["techindia","gadgetreview","techtips","techreels","mobiletech","technologyinhindi","techvlogger","gadgetsinhindi","smartphones","laptopreviews"],
  "🌅 Lifestyle / Day in My Life": ["lifestylevlog","dayinmylife","morningroutine","indialifestyle","dailyvlog","lifestyleblogger","routinevlog","collegelife","productivityvlog","mumbailife"],
  "❤️ Relationship / Couple Content": ["couplereels","relationshipgoals","couplegoals","couplesindia","hindilove","romancereels","datingadvice","marriedlife","couplelife","hindishayari"],
  "🔥 Roast / Reaction / Commentary": ["roastreels","reactionvideo","roastingcomedy","desiroast","roastinhindi","reactvideo","hindicommentary","roastvideos","trollvideo","commentaryreels"],
  "💼 Business / Startup / Entrepreneur": ["entrepreneurindia","startupindia","businesstips","entrepreneurshipreels","businessmindset","startuplife","founderlife","businessinhindi","sidehustle","digitalmarketing"],
  "👻 Storytelling / Horror / Mystery": ["hindihorror","storytellingreels","horrorstories","historyinhindi","mythologyinhindi","crimestories","hindistorytelling","mysterystories","thrillerreels","truestories"],
  "🧑‍🍳 DIY / Life Hacks": ["diyhacks","lifehacks","jugaad","diyindia","homehacks","kitchenhacks","moneysavingtips","smartliving","hacksvideo","diyproject"],
  "🎬 Direct to Camera / Talking Head": ["dtc","talkinghead","directtocamera","vloggerindia","storytime","myopinion","realtalk","talkingvideo","monologue","facecam"],
};

const CATEGORIES = Object.keys(HASHTAG_LIBRARY);

export default function ScrapePage() {
  const [agents, setAgents] = useState<{ label: string; last_seen: string }[]>([]);
  const [scrapeType, setScrapeType] = useState<"hashtag"|"reference"|"trained_feed">("hashtag");
  const [agent, setAgent] = useState("");
  const [igAccount, setIgAccount] = useState("");
  const [yourName, setYourName] = useState("");

  // Hashtag search
  const [category, setCategory] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [enrich, setEnrich] = useState(true);

  // Reference creator
  const [seeds, setSeeds] = useState("");
  const [depth, setDepth] = useState(1);

  // Trained feed
  const [feedHashtags, setFeedHashtags] = useState("");

  // Common
  const [maxCreators, setMaxCreators] = useState("50");
  const [minFollowers, setMinFollowers] = useState("10000");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onlineAgents = agents.filter((a) => a.last_seen && Date.now() - new Date(a.last_seen).getTime() < 40000);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("agents").select("label,last_seen");
      if (data) setAgents(data);
    };
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  // Auto-fill hashtags when category changes
  useEffect(() => {
    if (category && HASHTAG_LIBRARY[category]) {
      setHashtags(HASHTAG_LIBRARY[category].slice(0, 6).join(", "));
    }
  }, [category]);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!agent) { setError("Select an agent first."); return; }
    if (!igAccount.trim()) { setError("Enter an Instagram account."); return; }
    if (scrapeType === "hashtag" && !hashtags.trim()) { setError("Enter at least one hashtag."); return; }
    if (scrapeType === "reference" && !seeds.trim()) { setError("Enter at least one seed creator username."); return; }

    setSubmitting(true);
    const ig = igAccount.trim().replace(/^@/, "");
    let params: Record<string, unknown> = { ig_account: ig };

    if (scrapeType === "hashtag") {
      params = {
        ...params,
        hashtags: hashtags.split(/[,\s]+/).map(h => h.trim().replace(/^#/, "")).filter(Boolean),
        max: parseInt(maxCreators) || 50,
        min_followers: parseInt(minFollowers) || 0,
        enrich: enrich,
      };
    } else if (scrapeType === "reference") {
      params = {
        ...params,
        seeds: seeds.split(/[,\s]+/).map(s => s.trim().replace(/^@/, "")).filter(Boolean),
        max: parseInt(maxCreators) || 100,
        depth: depth,
      };
    } else {
      const ft = feedHashtags.split(/[,\s]+/).map(h => h.trim().replace(/^#/, "")).filter(Boolean);
      params = {
        ...params,
        max: parseInt(maxCreators) || 50,
        min_followers: parseInt(minFollowers) || 0,
        ...(ft.length ? { feed_hashtags: ft } : {}),
      };
    }

    const { error: err } = await supabase.from("jobs").insert({
      type: scrapeType,
      status: "queued",
      params,
      created_by: yourName || agent,
      account_label: agent,
      created_at: new Date().toISOString(),
    });

    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess(`✅ Job queued! ${agent}'s agent will pick it up shortly.`);
    setHashtags(""); setFeedHashtags(""); setSeeds(""); setCategory("");
  };

  const inputStyle = {
    width: "100%", background: "#0d0d14", border: "1px solid #1e1e2e",
    borderRadius: 8, padding: "10px 14px", color: "#e2e2f0", fontSize: 14, outline: "none",
  };
  const labelStyle = { fontSize: 13, color: "#9999bb", fontWeight: 500, display: "block" as const, marginBottom: 6 };

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>New Scrape</h1>
        <p style={{ color: "#6b6b8a", fontSize: 14 }}>Queue a job — your agent picks it up automatically.</p>
      </div>

      {/* Agent status */}
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        {onlineAgents.length > 0 ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a3e635", boxShadow: "0 0 8px #a3e635", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "#a3e635", fontWeight: 500 }}>{onlineAgents.map(a => a.label).join(", ")} online</span>
          </>
        ) : (
          <>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a3a5a", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "#6b6b8a" }}>No agents online — start the agent app first</span>
          </>
        )}
      </div>

      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12, padding: 28 }}>

        {/* Scrape type */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Scrape Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {([
              { value: "hashtag" as const, label: "# Hashtag Search" },
              { value: "reference" as const, label: "👤 Reference Creator" },
              { value: "trained_feed" as const, label: "🎯 Trained Feed" },
            ]).map(t => (
              <button key={t.value} onClick={() => setScrapeType(t.value)} style={{
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: scrapeType === t.value ? "#6366f1" : "#0d0d14",
                border: `1px solid ${scrapeType === t.value ? "#6366f1" : "#1e1e2e"}`,
                color: scrapeType === t.value ? "#fff" : "#6b6b8a",
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* HASHTAG SEARCH */}
        {scrapeType === "hashtag" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Category (optional — auto-fills hashtags)</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">— pick a category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Keywords / Hashtags</label>
              <textarea value={hashtags} onChange={e => setHashtags(e.target.value)}
                placeholder="comedy, funnyreels, skit" rows={3}
                style={{ ...inputStyle, resize: "vertical" as const }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>How many to find</label>
                <input type="number" value={maxCreators} onChange={e => setMaxCreators(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Min followers</label>
                <input type="number" value={minFollowers} onChange={e => setMinFollowers(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setEnrich(!enrich)}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: `2px solid ${enrich ? "#6366f1" : "#3a3a5a"}`,
                background: enrich ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {enrich && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: "#9999bb" }}>Fetch followers + email (enrichment)</span>
            </div>
          </>
        )}

        {/* REFERENCE CREATOR */}
        {scrapeType === "reference" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Seed creator username(s)</label>
              <input value={seeds} onChange={e => setSeeds(e.target.value)}
                placeholder="e.g. some_creator, another_creator" style={inputStyle} />
              <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 6 }}>Comma-separated. Agent finds creators similar to these.</div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>How many to find</label>
                <input type="number" value={maxCreators} onChange={e => setMaxCreators(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Similar-creator depth</label>
                <select value={depth} onChange={e => setDepth(parseInt(e.target.value))} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value={0}>0 — seed only</option>
                  <option value={1}>1 — one hop (recommended)</option>
                  <option value={2}>2 — two hops (slower)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* TRAINED FEED */}
        {scrapeType === "trained_feed" && (
          <>
            <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#9999bb", lineHeight: 1.6 }}>
              Opens your trained Instagram account&apos;s feed in the browser and scrolls to collect creators.
              Train your account on your phone by watching niche reels — the algorithm remembers.
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Filter by hashtags (optional)</label>
              <input value={feedHashtags} onChange={e => setFeedHashtags(e.target.value)}
                placeholder="fashionreels, ootd (leave empty for all)" style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Max reels to scan</label>
                <input type="number" value={maxCreators} onChange={e => setMaxCreators(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Min followers</label>
                <input type="number" value={minFollowers} onChange={e => setMinFollowers(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </>
        )}

        <div style={{ height: 1, background: "#1e1e2e", margin: "4px 0 20px" }} />

        {/* Agent + IG account + Your name */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Run on (agent laptop)</label>
            <select value={agent} onChange={e => setAgent(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">{onlineAgents.length ? "Select agent..." : "(no agents online)"}</option>
              {onlineAgents.map(a => <option key={a.label} value={a.label}>🟢 {a.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Your name</label>
            <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="e.g. Priya" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Instagram account to scrape with</label>
          <input value={igAccount} onChange={e => setIgAccount(e.target.value)}
            placeholder="e.g. my_burner_account" style={inputStyle} />
          <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 6 }}>First time with a new account — Chrome opens to log in once, then login is saved.</div>
        </div>

        {/* Error / success */}
        {error && <div style={{ background: "#2a0f0f", border: "1px solid #5a1a1a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{error}</div>}
        {success && <div style={{ background: "#0f2a0f", border: "1px solid #1a5a1a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#a3e635" }}>{success}</div>}

        <button onClick={handleSubmit} disabled={submitting} style={{
          width: "100%", padding: "12px", borderRadius: 8, fontSize: 15, fontWeight: 700,
          background: submitting ? "#3f3f6e" : "#6366f1", border: "none", color: "#fff",
          cursor: submitting ? "not-allowed" : "pointer",
        }}>
          {submitting ? "Queuing..." : "▶ Start Scrape"}
        </button>
      </div>
    </div>
  );
}
