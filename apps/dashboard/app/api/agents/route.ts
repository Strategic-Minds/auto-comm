import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Auto Chat",
    room: "multi_agent_chat",
    selection_mode: "press_and_hold",
    agents: [
      { id: "apex", name: "Base44 APEX", role: "super agent", status: "routing" },
      { id: "gpt", name: "GPT Strategist", role: "planning", status: "active" },
      { id: "aria", name: "ARIA Support", role: "customer replies", status: "live" },
      { id: "social", name: "Social Pilot", role: "social ops", status: "drafting" },
      { id: "guard", name: "Compliance Guard", role: "approval gate", status: "watching" }
    ],
    controls: ["press_hold_select", "press_hold_deselect", "observe", "approve", "pause", "human_takeover"],
    note: "Seed endpoint for wiring live Base44, GPT agent, Supabase, and WhatsApp/social event state."
  });
}
