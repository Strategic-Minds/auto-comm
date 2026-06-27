import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Auto Chat",
    channels: ["whatsapp", "facebook", "instagram", "tiktok", "snapchat"],
    controls: ["observe", "approve_next_reply", "take_over", "pause_agent"],
    source: "dashboard_seed",
    note: "Connect this endpoint to Supabase conversations/messages for live production data."
  });
}
