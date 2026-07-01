import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = "llama-3.3-70b-versatile";

type Set = { label: string; tags: string[] };

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "AI is not configured yet." }, { status: 503 });
  }
  try {
    const { description } = await req.json();
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Describe the creators you want." }, { status: 400 });
    }

    const prompt =
      `For Instagram creators who make this kind of content: "${description.trim()}", ` +
      `suggest 4 different sets of hashtags to find them.\n\n` +
      `Return ONLY valid JSON in exactly this shape:\n` +
      `{"sets":[` +
      `{"label":"Best mix","tags":["tag1","tag2"]},` +
      `{"label":"Broad reach","tags":[]},` +
      `{"label":"Niche & specific","tags":[]},` +
      `{"label":"India-focused","tags":[]}` +
      `]}\n\n` +
      `Rules:\n` +
      `- Each set has 8-10 hashtags.\n` +
      `- No "#" symbol in tags.\n` +
      `- Real hashtags creators actually use on Instagram.\n` +
      `- "Best mix" = your top recommendation blending broad + niche.\n` +
      `- "Broad reach" = high-volume general tags.\n` +
      `- "Niche & specific" = precise, lower-competition tags.\n` +
      `- "India-focused" = tags for an Indian audience.`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 700,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "AI request failed." },
        { status: 500 }
      );
    }

    const content: string = data?.choices?.[0]?.message?.content || "{}";
    let sets: Set[] = [];
    try {
      const parsed = JSON.parse(content);
      sets = (parsed.sets || [])
        .map((s: { label?: string; tags?: string[] }) => ({
          label: String(s.label || "Set"),
          tags: (s.tags || [])
            .map((t) => String(t).replace(/#/g, "").trim())
            .filter(Boolean)
            .slice(0, 12),
        }))
        .filter((s: Set) => s.tags.length > 0);
    } catch {
      return NextResponse.json({ error: "AI returned an unexpected format. Try again." }, { status: 500 });
    }

    if (!sets.length) {
      return NextResponse.json({ error: "No hashtags returned. Try rephrasing." }, { status: 500 });
    }
    return NextResponse.json({ sets });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
