import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Auto Chat",
    room: "multi_agent_chat",
    selection_mode: "press_and_hold",
    shell: {
      status_endpoint: "/api/shell",
      command_endpoint: "/api/shell/command",
      execution_mode: process.env.AUTO_CHAT_SHELL_PUBLIC_EXECUTION === "true" ? "live_public_execution_enabled" : "guarded_execution",
      live_dispatch_requires: ["AUTO_CHAT_SHELL_TOKEN or AUTO_CHAT_SHELL_PUBLIC_EXECUTION=true", "target webhook/token env vars"]
    },
    agents: [
      { id: "apex", name: "Base44 APEX", role: "super agent", target: "base44_apex", status: "routing" },
      { id: "gpt", name: "GPT Strategist", role: "planning", target: "chatgpt_agents", status: "active" },
      { id: "aria", name: "ARIA Support", role: "customer replies", target: "auto_builder", status: "live" },
      { id: "social", name: "Social Pilot", role: "social ops", target: "auto_builder", status: "drafting" },
      { id: "guard", name: "Compliance Guard", role: "approval gate", target: "auto_builder", status: "watching" }
    ],
    controls: ["press_hold_select", "press_hold_deselect", "observe", "approve", "pause", "human_takeover", "route_thread", "pass_thread", "sync_repo_context", "write_memory_receipt"],
    integrations: ["auto_builder", "github_repo", "drive_memory", "base44_apex", "chatgpt_agents"],
    note: "Shell discovery endpoint. Live Base44, GPT agent, Drive, GitHub, and Auto Builder execution depends on protected Vercel environment values and approved webhooks."
  });
}
