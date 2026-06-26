import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // TODO: verify Twilio signature before production traffic.
  return NextResponse.json({
    ok: true,
    received: true,
    route: "whatsapp_inbound",
    next: ["store_message", "classify_intent", "score_lead", "route_or_reply"]
  });
}
