import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const repository = process.env.AUTO_CHAT_REPOSITORY ?? "Strategic-Minds/auto-comm";
const autoBuilderMcpUrl = process.env.AUTO_BUILDER_MCP_URL ?? "https://auto-builder-strategic-minds-advisory.vercel.app/api/mcp";

function statusFor(required: string[], liveEnv?: string) {
  const missing = required.filter((name) => !process.env[name]);
  return {
    state: missing.length === 0 ? "connected" : liveEnv && process.env[liveEnv] ? "webhook_ready" : "contract_ready",
    missing
  };
}

export async function GET() {
  const github = statusFor(["GITHUB_TOKEN"]);
  const drive = statusFor(["GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_DRIVE_ROOT_FOLDER_ID"]);
  const autoBuilder = statusFor(["AUTO_BUILDER_BRIDGE_TOKEN"], "AUTO_BUILDER_BRIDGE_WEBHOOK_URL");
  const base44 = statusFor(["BASE44_APEX_WEBHOOK_URL", "BASE44_APEX_TOKEN"], "BASE44_APEX_WEBHOOK_URL");
  const chatgpt = statusFor(["CHATGPT_AGENT_WEBHOOK_URL", "OPENAI_API_KEY"], "CHATGPT_AGENT_WEBHOOK_URL");

  return NextResponse.json({
    ok: true,
    app: "Auto Chat",
    shell: "agent_control_shell",
    mode: process.env.AUTO_CHAT_SHELL_PUBLIC_EXECUTION === "true" ? "live_public_execution_enabled" : "guarded_execution",
    command_endpoint: "/api/shell/command",
    integrations: [
      {
        id: "auto_builder",
        label: "AUTO_BUILDER control plane",
        state: autoBuilder.state,
        mcp_url: autoBuilderMcpUrl,
        missing_env: autoBuilder.missing
      },
      {
        id: "github_repo",
        label: "Auto Chat repository",
        state: github.state,
        repository,
        repository_url: `https://github.com/${repository}`,
        default_branch: "main",
        missing_env: github.missing
      },
      {
        id: "drive_memory",
        label: "Drive memory and project folders",
        state: drive.state,
        folders: [
          { label: "Strategic Minds source of truth", id: "1rjOt7prvOCaUNgCmcY8Ce605cIv2FuSY" },
          { label: "Project Drive", id: "17u9CReEkuI5AZyNty6QZcqFPPXug_NQm" },
          { label: "Auto Builder command folder", id: "13uLhv0NRhmdCdJCCLrroLzyRRttoXtpr" },
          { label: "Auto Chat reference folder", id: "1HOkQbwWV6wvtUJwuKxbJlzvIhCsuwSh7" }
        ],
        missing_env: drive.missing
      },
      {
        id: "base44_apex",
        label: "Base44 APEX super agent",
        state: base44.state,
        receives: ["route_thread", "agent_select", "agent_deselect", "human_takeover", "pause_agent"],
        missing_env: base44.missing
      },
      {
        id: "chatgpt_agents",
        label: "ChatGPT agent pass-through",
        state: chatgpt.state,
        receives: ["pass_thread", "agent_select", "agent_deselect", "summarize", "handoff"],
        missing_env: chatgpt.missing
      }
    ],
    controls: [
      "route_apex",
      "gpt_pass_through",
      "repo_sync",
      "drive_receipt",
      "press_hold_agent_select",
      "press_hold_agent_deselect",
      "observe",
      "approve",
      "pause",
      "human_takeover"
    ],
    governance: {
      live_dispatch_requires: ["AUTO_CHAT_SHELL_TOKEN or AUTO_CHAT_SHELL_PUBLIC_EXECUTION=true", "target webhook/token env vars"],
      default_behavior: "validate and audit command contracts without live external side effects",
      reason: "The public PWA should not expose unrestricted control over Base44, Drive, GitHub, or ChatGPT agents."
    }
  });
}
