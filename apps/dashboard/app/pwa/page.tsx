"use client";

import { useRef, useState } from "react";
import { PwaInstallButtons } from "../components/PwaInstallButtons";

type Agent = {
  id: string;
  badge: string;
  name: string;
  role: string;
  status: string;
};

type AgentMessage = {
  id: string;
  agentId: string;
  time: string;
  body: string;
};

const agents: Agent[] = [
  { id: "apex", badge: "APX", name: "Base44 APEX", role: "super agent", status: "routing" },
  { id: "gpt", badge: "GPT", name: "GPT Strategist", role: "planning", status: "active" },
  { id: "aria", badge: "ARI", name: "ARIA Support", role: "customer replies", status: "live" },
  { id: "social", badge: "SOC", name: "Social Pilot", role: "social ops", status: "drafting" },
  { id: "guard", badge: "GRD", name: "Compliance Guard", role: "approval gate", status: "watching" }
];

const messages: AgentMessage[] = [
  { id: "m1", agentId: "apex", time: "now", body: "APEX is routing the selected WhatsApp conversation through the agent room." },
  { id: "m2", agentId: "gpt", time: "now", body: "GPT Strategist is preparing the next recommendation before customer response." },
  { id: "m3", agentId: "aria", time: "02s", body: "ARIA has a reply draft ready for approval." },
  { id: "m4", agentId: "guard", time: "05s", body: "Compliance Guard is checking consent, claims, and escalation rules." },
  { id: "m5", agentId: "social", time: "08s", body: "Social Pilot is watching matching comments across Instagram and TikTok." }
];

const liveThreads = [
  { channel: "WA", customer: "Maya R.", status: "Approval", summary: "Wants WhatsApp approval before social posts go live." },
  { channel: "IG", customer: "Devon P.", status: "Hot lead", summary: "Asked for pricing from an Instagram reel." },
  { channel: "FB", customer: "Linda K.", status: "Review", summary: "Complaint reply is held for manager approval." }
];

export default function PwaPage() {
  const [selectedAgentIds, setSelectedAgentIds] = useState(["apex", "gpt", "aria"]);
  const [holdStatus, setHoldStatus] = useState("Hold an agent to select or deselect");
  const [selectedThread, setSelectedThread] = useState(0);
  const holdTimer = useRef<number | null>(null);

  function clearHoldTimer() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function toggleAgent(agentId: string) {
    setSelectedAgentIds((current) => (current.includes(agentId) ? current.filter((id) => id !== agentId) : [...current, agentId]));
  }

  function startHold(agent: Agent) {
    clearHoldTimer();
    setHoldStatus(`Holding ${agent.name}...`);
    holdTimer.current = window.setTimeout(() => {
      const willSelect = !selectedAgentIds.includes(agent.id);
      toggleAgent(agent.id);
      setHoldStatus(`${agent.name} ${willSelect ? "selected" : "deselected"}`);
      holdTimer.current = null;
    }, 650);
  }

  function cancelHold() {
    if (holdTimer.current) {
      clearHoldTimer();
      setHoldStatus("Hold longer to toggle agent");
    }
  }

  const activeMessages = messages.filter((message) => selectedAgentIds.includes(message.agentId));
  const thread = liveThreads[selectedThread];

  return (
    <main className="pwa-shell">
      <section className="hero">
        <div className="brand"><b>A</b><span><strong>Auto Chat</strong><em>PWA app</em></span></div>
        <h1>Installed command app</h1>
        <p>Mobile-first control for live customer threads and multi-agent selection.</p>
        <PwaInstallButtons tone="dark" />
      </section>

      <section className="thread-card">
        <div className="section-head"><span>Live thread</span><a href="/desktop">Desktop</a></div>
        <div className="thread-main"><b>{thread.channel}</b><span><strong>{thread.customer}</strong><em>{thread.status}</em></span></div>
        <p>{thread.summary}</p>
        <div className="thread-switcher">
          {liveThreads.map((item, index) => <button className={selectedThread === index ? "active" : ""} key={item.customer} onClick={() => setSelectedThread(index)}>{item.channel}</button>)}
        </div>
      </section>

      <section className="agent-room">
        <div className="room-head"><div><span>Multi-agent chat</span><h2>Push and hold</h2></div><b>{selectedAgentIds.length}/{agents.length}</b></div>
        <p className="helper">Hold an agent button for a moment to select or deselect them from this PWA room.</p>
        <div className="agent-grid">
          {agents.map((agent) => {
            const active = selectedAgentIds.includes(agent.id);
            return <button aria-pressed={active} className={active ? "agent on" : "agent"} key={agent.id} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleAgent(agent.id); setHoldStatus(`${agent.name} ${active ? "deselected" : "selected"}`); } }} onPointerCancel={cancelHold} onPointerDown={() => startHold(agent)} onPointerLeave={cancelHold} onPointerUp={cancelHold}><span>{agent.badge}</span><strong>{agent.name}</strong><em>{agent.role}</em><i>{agent.status}</i></button>;
          })}
        </div>
        <div className="hold-status" aria-live="polite">{holdStatus}</div>
        <div className="feed">
          {activeMessages.length ? activeMessages.map((message) => {
            const agent = agents.find((item) => item.id === message.agentId);
            return <p className="line" key={message.id}><b>{agent?.badge ?? "AGT"}</b><span><strong>{agent?.name ?? "Agent"} - {message.time}</strong>{message.body}</span></p>;
          }) : <p className="empty">No agents selected. Hold an agent button to bring them back in.</p>}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="PWA actions"><a href="/pwa">PWA</a><a href="/desktop">Desktop</a><a href="/api/agents">Agents API</a></nav>
      <style>{css}</style>
    </main>
  );
}

const css = `
:root{--g:#39ff14;--ink:#050706;--muted:#687168}*{box-sizing:border-box}body{margin:0;background:linear-gradient(145deg,#050706,#0d130f);color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button{font:inherit;cursor:pointer}.pwa-shell{width:min(480px,100%);min-height:100svh;margin:0 auto;padding:18px 18px 88px;background:radial-gradient(circle at 18% 0%,rgba(57,255,20,.22),transparent 36%),linear-gradient(180deg,#050706,#101812 70%,#050706)}.hero,.thread-card,.agent-room{border-radius:28px;padding:20px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),0 24px 60px rgba(0,0,0,.28)}.brand{display:flex;align-items:center;gap:12px}.brand>b{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950;box-shadow:0 0 28px rgba(57,255,20,.7)}.brand strong{display:block;font-size:24px;line-height:1;font-weight:950}.brand em{display:block;margin-top:4px;color:rgba(255,255,255,.65);font-style:normal;font-size:11px;font-weight:900;text-transform:uppercase}h1,h2,p{margin:0}.hero h1{margin-top:24px;font-size:34px;line-height:1;font-weight:950}.hero p{margin:10px 0 20px;color:rgba(255,255,255,.72);font-size:14px;line-height:1.45;font-weight:750}.thread-card,.agent-room{margin-top:14px}.section-head,.room-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.section-head span,.room-head span{color:var(--g);font-size:11px;font-weight:950;text-transform:uppercase}.section-head a{min-height:32px;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;color:var(--ink);background:var(--g);font-size:12px;font-weight:950;text-decoration:none}.thread-main{margin-top:18px;display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center}.thread-main>b{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950}.thread-main strong{display:block;font-size:20px}.thread-main em{display:block;margin-top:2px;color:rgba(255,255,255,.62);font-style:normal;font-size:12px;font-weight:850}.thread-card p{margin-top:14px;color:rgba(255,255,255,.78);font-size:13px;line-height:1.45;font-weight:760}.thread-switcher{margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.thread-switcher button{min-height:38px;border:0;border-radius:14px;color:#fff;background:rgba(255,255,255,.09);font-size:12px;font-weight:950}.thread-switcher .active{color:var(--ink);background:var(--g)}.room-head h2{margin-top:4px;font-size:27px;line-height:1;font-weight:950}.room-head>b{min-width:48px;height:32px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:12px}.helper{margin-top:10px;color:rgba(255,255,255,.66);font-size:13px;line-height:1.4;font-weight:760}.agent-grid{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.agent{min-height:108px;border:0;border-radius:20px;padding:12px;display:grid;align-content:start;gap:6px;color:rgba(255,255,255,.64);background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);text-align:left;touch-action:manipulation;user-select:none}.agent.on{color:#fff;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.48),0 0 24px rgba(57,255,20,.12)}.agent span{width:34px;height:28px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px;font-weight:950}.agent strong{font-size:12px;line-height:1.1}.agent em,.agent i{font-style:normal;font-size:10px;font-weight:850}.agent em{color:rgba(255,255,255,.64)}.agent i{width:max-content;border-radius:999px;padding:4px 8px;color:var(--ink);background:#fff}.hold-status{margin-top:12px;min-height:34px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.78);background:rgba(255,255,255,.08);font-size:11px;font-weight:900}.feed{margin-top:12px;display:grid;gap:9px}.line{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:start}.line>b{width:34px;height:28px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px}.line span,.empty{border-radius:16px;padding:10px;color:rgba(255,255,255,.84);background:#223026;font-size:11px;line-height:1.34;font-weight:760}.line strong{display:block;margin-bottom:3px;color:#fff;font-size:11px}.bottom-nav{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);width:min(444px,calc(100% - 28px));min-height:54px;border-radius:999px;padding:7px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:rgba(255,255,255,.92);box-shadow:0 18px 44px rgba(0,0,0,.28)}.bottom-nav a{border-radius:999px;display:grid;place-items:center;color:var(--muted);font-size:12px;font-weight:950;text-decoration:none}.bottom-nav a:first-child{color:var(--ink);background:var(--g)}@media(min-width:760px){.pwa-shell{margin-top:24px;margin-bottom:24px;border-radius:34px;min-height:calc(100svh - 48px)}.bottom-nav{bottom:24px}}
`;
