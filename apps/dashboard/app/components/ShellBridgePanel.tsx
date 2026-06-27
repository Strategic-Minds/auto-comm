"use client";

import { useRef, useState } from "react";

type ShellThread = {
  id: string;
  channel: string;
  label: string;
  customer: string;
  status: string;
  risk: string;
  summary: string;
};

type ShellAgent = readonly [string, string, string];
type ShellTarget = "auto_builder" | "github_repo" | "drive_memory" | "base44_apex" | "chatgpt_agents";

type ShellBridgePanelProps = {
  selected: ShellThread;
  agents: readonly ShellAgent[];
};

const agentIds: Record<string, string> = {
  "Base44 APEX": "apex",
  "GPT Strategist": "gpt",
  "ARIA Support": "aria",
  "Social Pilot": "social",
  "Compliance Guard": "guard"
};

function targetForAgent(agentId: string): ShellTarget {
  if (agentId === "apex") {
    return "base44_apex";
  }

  if (agentId === "gpt") {
    return "chatgpt_agents";
  }

  return "auto_builder";
}

export function ShellBridgePanel({ selected, agents }: ShellBridgePanelProps) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["apex", "gpt"]);
  const [status, setStatus] = useState("Shell ready. Commands are guarded until operator auth is attached.");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  async function sendCommand(target: ShellTarget, action: string, nextAgents = selectedAgents) {
    setStatus(`Sending ${action} to ${target}...`);

    try {
      const response = await fetch("/api/shell/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          target,
          action,
          threadId: selected.id,
          channel: selected.channel,
          customer: selected.customer,
          selectedAgents: nextAgents,
          metadata: {
            selectedStatus: selected.status,
            selectedRisk: selected.risk,
            selectedSummary: selected.summary
          }
        })
      });
      const data = await response.json();
      setStatus(data.message ?? (response.ok ? "Shell command accepted." : "Shell command returned an error."));
    } catch {
      setStatus("Shell command could not reach the bridge endpoint.");
    }
  }

  function holdToToggleAgent(agentId: string, name: string) {
    clearHold();
    setStatus(`Hold to toggle ${name}...`);

    holdTimer.current = setTimeout(() => {
      setSelectedAgents((current) => {
        const isSelected = current.includes(agentId);
        const next = isSelected ? current.filter((item) => item !== agentId) : [...current, agentId];
        void sendCommand(targetForAgent(agentId), isSelected ? "agent_deselect" : "agent_select", next);
        return next;
      });
    }, 520);
  }

  return (
    <>
      <div className="selected-card">
        <span>{selected.label} selected</span>
        <h2>{selected.customer}</h2>
        <p>{selected.summary}</p>
        <div>
          <b>{selected.status}</b>
          <b className="blue">{selected.risk} risk</b>
        </div>
        <div className="shell-actions">
          <button className="shell-action primary" onClick={() => sendCommand("base44_apex", "route_thread")} type="button">Route APEX</button>
          <button className="shell-action" onClick={() => sendCommand("chatgpt_agents", "pass_thread")} type="button">GPT Pass</button>
          <button className="shell-action" onClick={() => sendCommand("github_repo", "sync_repo_context")} type="button">Repo Sync</button>
          <button className="shell-action" onClick={() => sendCommand("drive_memory", "write_memory_receipt")} type="button">Drive Log</button>
        </div>
        <p className="shell-status" aria-live="polite">{status}</p>
      </div>

      <div className="agent-room">
        <div className="section-title"><span>Multi-agent room</span><strong>Press hold to route</strong></div>
        {agents.map(([badge, name, agentStatus]) => {
          const agentId = agentIds[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
          const active = selectedAgents.includes(agentId);

          return (
            <button
              className={active ? "agent selected" : "agent"}
              key={name}
              onClick={() => setStatus(`Press and hold ${name} to select or deselect.`)}
              onPointerCancel={clearHold}
              onPointerDown={() => holdToToggleAgent(agentId, name)}
              onPointerLeave={clearHold}
              onPointerUp={clearHold}
              type="button"
            >
              <b>{badge}</b>
              <span><strong>{name}</strong><em>{active ? "selected" : agentStatus}</em></span>
            </button>
          );
        })}
      </div>
    </>
  );
}
