import { NextRequest, NextResponse } from "next/server";

const GSHEET_URL = process.env.GSHEET_URL || "";

export async function POST(req: NextRequest) {
  if (!GSHEET_URL) {
    return NextResponse.json({ error: "Sheet not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const r = await fetch(GSHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    return NextResponse.json(data, { status: r.ok ? 200 : 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
