import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ShellTarget = "auto_builder" | "github_repo" | "drive_memory" | "base44_apex" | "chatgpt_agents";
type ShellCommand = {
  target?: ShellTarget;
  action?: string;
  threadId?: string;
  channel?: string;
  customer?: string;
  selectedAgents?: string[];
  metadata?: Record<string, unknown>;
};

const targetEnv: Record<ShellTarget, { url?: string; token?: string; required: string[] }> = {
  auto_builder: {
    url: process.env.AUTO_BUILDER_BRIDGE_WEBHOOK_URL,
    token: process.env.AUTO_BUILDER_BRIDGE_TOKEN,
    required: ["AUTO_BUILDER_BRIDGE_WEBHOOK_URL", "AUTO_BUILDER_BRIDGE_TOKEN"]
  },
  github_repo: {
    token: process.env.GITHUB_TOKEN,
    required: ["GITHUB_TOKEN"]
  },
  drive_memory: {
    token: process.env.GOOGLE_PRIVATE_KEY,
    required: ["GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_DRIVE_ROOT_FOLDER_ID"]
  },
  base44_apex: {
    url: process.env.BASE44_APEX_WEBHOOK_URL,
    token: process.env.BASE44_APEX_TOKEN,
    required: ["BASE44_APEX_WEBHOOK_URL", "BASE44_APEX_TOKEN"]
  },
  chatgpt_agents: {
    url: process.env.CHATGPT_AGENT_WEBHOOK_URL,
    token: process.env.OPENAI_API_KEY,
    required: ["CHATGPT_AGENT_WEBHOOK_URL", "OPENAI_API_KEY"]
  }
};

const allowedTargets = new Set<ShellTarget>(["auto_builder", "github_repo", "drive_memory", "base44_apex", "chatgpt_agents"]);

function isShellTarget(value: unknown): value is ShellTarget {
  return typeof value === "string" && allowedTargets.has(value as ShellTarget);
}

function liveDispatchAllowed(request: NextRequest) {
  if (process.env.AUTO_CHAT_SHELL_PUBLIC_EXECUTION === "true") {
    return true;
  }

  const expected = process.env.AUTO_CHAT_SHELL_TOKEN;
  return Boolean(expected && request.headers.get("x-auto-chat-shell-token") === expected);
}

async function dispatchWebhook(target: ShellTarget, payload: Record<string, unknown>) {
  const config = targetEnv[target];

  if (!config.url) {
    return null;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(config.token ? { authorization: `Bearer ${config.token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body_preview: text.slice(0, 600)
  };
}

export async function POST(request: NextRequest) {
  let command: ShellCommand;

  try {
    command = (await request.json()) as ShellCommand;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON command payload." }, { status: 400 });
  }

  if (!isShellTarget(command.target)) {
    return NextResponse.json({ ok: false, message: "Unknown shell target.", allowed_targets: [...allowedTargets] }, { status: 400 });
  }

  if (!command.action) {
    return NextResponse.json({ ok: false, message: "Missing shell action." }, { status: 400 });
  }

  const config = targetEnv[command.target];
  const missing = config.required.filter((name) => !process.env[name]);
  const audit = {
    app: "Auto Chat",
    shell: "agent_control_shell",
    target: command.target,
    action: command.action,
    threadId: command.threadId ?? null,
    channel: command.channel ?? null,
    customer: command.customer ?? null,
    selectedAgents: command.selectedAgents ?? [],
    metadata: command.metadata ?? {},
    repository: process.env.AUTO_CHAT_REPOSITORY ?? "Strategic-Minds/auto-comm",
    issuedAt: new Date().toISOString()
  };

  if (!liveDispatchAllowed(request)) {
    return NextResponse.json(
      {
        ok: true,
        mode: "guarded",
        message: `${command.action} validated for ${command.target}. Live dispatch is protected until operator auth is enabled.`,
        missing_env: missing,
        audit
      },
      { status: 202 }
    );
  }

  if (missing.length > 0 || !config.url) {
    return NextResponse.json(
      {
        ok: true,
        mode: "contract_ready",
        message: `${command.action} validated for ${command.target}. Add the missing env values to execute live.`,
        missing_env: missing,
        audit
      },
      { status: 202 }
    );
  }

  const dispatch = await dispatchWebhook(command.target, audit);

  return NextResponse.json({
    ok: Boolean(dispatch?.ok),
    mode: "live_dispatch",
    message: dispatch?.ok ? `${command.action} dispatched to ${command.target}.` : `${command.action} reached ${command.target}, but the target did not accept it.`,
    dispatch,
    audit
  });
}
