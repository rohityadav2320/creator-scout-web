import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = "llama-3.3-70b-versatile";

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
      `Give exactly 10 Instagram hashtags to find creators who make this kind of content: ` +
      `"${description.trim()}".\n\n` +
      `Rules:\n` +
      `- Return ONLY the hashtags, comma-separated.\n` +
      `- No "#" symbol, no numbering, no explanations, no extra text.\n` +
      `- Use real hashtags creators actually use on Instagram.\n` +
      `- Mix broad tags and specific niche tags.`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "AI request failed." },
        { status: 500 }
      );
    }

    const text: string = data?.choices?.[0]?.message?.content || "";
    const tags = text
      .replace(/#/g, "")
      .split(/[,\n]+/)
      .map((t) => t.trim().replace(/^[0-9.)\s-]+/, ""))
      .filter(Boolean)
      .slice(0, 12);

    if (!tags.length) {
      return NextResponse.json({ error: "No hashtags returned. Try rephrasing." }, { status: 500 });
    }
    return NextResponse.json({ hashtags: tags.join(", ") });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
