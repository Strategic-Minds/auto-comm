"use client";

import { useMemo, useRef, useState } from "react";

type ChannelKey = "all" | "wa" | "fb" | "ig" | "tt" | "sc";
type SocialChannelKey = Exclude<ChannelKey, "all">;

type Conversation = {
  id: string;
  channel: SocialChannelKey;
  channelLabel: string;
  customer: string;
  agent: string;
  age: string;
  summary: string;
  status: string;
  stage: string;
  sentiment: string;
  transcript: string[];
};

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

const channels = [
  { key: "all" as ChannelKey, label: "All", count: 128 },
  { key: "wa" as ChannelKey, label: "WhatsApp", count: 48 },
  { key: "fb" as ChannelKey, label: "Facebook", count: 20 },
  { key: "ig" as ChannelKey, label: "Instagram", count: 31 },
  { key: "tt" as ChannelKey, label: "TikTok", count: 17 },
  { key: "sc" as ChannelKey, label: "Snapchat", count: 12 }
];

const conversations: Conversation[] = [
  { id: "maya-wa", channel: "wa", channelLabel: "WA", customer: "Maya R.", agent: "ARIA Support", age: "02:14", summary: "Approvals question for WhatsApp-controlled social posting.", status: "Live", stage: "Approval", sentiment: "Positive", transcript: ["Can WhatsApp approve posts before they go live?", "Yes. I can route each publish request to an approval queue first.", "Can I watch the agent conversation while it happens?", "Yes. Auto Chat shows each active thread as a live card."] },
  { id: "devon-ig", channel: "ig", channelLabel: "IG", customer: "Devon P.", agent: "Sales Agent", age: "04:51", summary: "Instagram lead wants pricing for social automation.", status: "Hot", stage: "Lead", sentiment: "Interested", transcript: ["Saw the automation reel. What does setup cost?", "It depends on channels and volume. Want the MVP or enterprise path?"] },
  { id: "linda-fb", channel: "fb", channelLabel: "FB", customer: "Linda K.", agent: "Service Agent", age: "01:06", summary: "Complaint detected. Recovery reply waiting for review.", status: "Risk", stage: "Review", sentiment: "Frustrated", transcript: ["This is taking too long. I need a real answer.", "I hear you. I am flagging this for direct review now."] },
  { id: "jay-tt", channel: "tt", channelLabel: "TT", customer: "Jay M.", agent: "Content Agent", age: "06:33", summary: "Creator asked for the clip schedule.", status: "Draft", stage: "Content", sentiment: "Neutral", transcript: ["When do the clips go out?", "I have three draft windows ready. Want morning or evening priority?"] },
  { id: "omar-wa", channel: "wa", channelLabel: "WA", customer: "Omar S.", agent: "Booking Agent", age: "03:18", summary: "Customer confirmed availability and requirements are being collected.", status: "Ready", stage: "CRM", sentiment: "Positive", transcript: ["Friday works.", "Perfect. What kind of space are you working with?"] },
  { id: "nia-sc", channel: "sc", channelLabel: "SC", customer: "Nia B.", agent: "Social Agent", age: "00:44", summary: "Snap response received and demo interest is being qualified.", status: "New", stage: "Qualify", sentiment: "Curious", transcript: ["Can I see a demo?", "Yes. Are you looking for WhatsApp, Instagram, or both?"] },
  { id: "priya-wa", channel: "wa", channelLabel: "WA", customer: "Priya C.", agent: "ARIA Sales", age: "02:57", summary: "Lead asked for build timeline and MVP vs enterprise split.", status: "Buyer", stage: "Quote", sentiment: "Buyer", transcript: ["How long would the first build take?", "MVP is usually the fastest path. Enterprise adds full governance."] },
  { id: "elle-tt", channel: "tt", channelLabel: "TT", customer: "Elle V.", agent: "Trend Agent", age: "05:12", summary: "Comment thread is being summarized for a content opportunity.", status: "Trend", stage: "Watch", sentiment: "Positive", transcript: ["This would make a good follow-up video.", "Agreed. I am summarizing the thread for review."] }
];

const agents: Agent[] = [
  { id: "apex", badge: "APX", name: "Base44 APEX", role: "super agent", status: "routing" },
  { id: "gpt", badge: "GPT", name: "GPT Strategist", role: "planning", status: "active" },
  { id: "aria", badge: "ARI", name: "ARIA Support", role: "customer replies", status: "live" },
  { id: "social", badge: "SOC", name: "Social Pilot", role: "social ops", status: "drafting" },
  { id: "guard", badge: "GRD", name: "Compliance Guard", role: "approval gate", status: "watching" }
];

const agentMessages: AgentMessage[] = [
  { id: "m1", agentId: "apex", time: "now", body: "APEX routed the active WhatsApp thread to GPT Strategist and ARIA." },
  { id: "m2", agentId: "gpt", time: "now", body: "GPT Strategist matched the customer intent to the enterprise automation path." },
  { id: "m3", agentId: "aria", time: "02s", body: "ARIA drafted a short customer-safe reply and is waiting for approval." },
  { id: "m4", agentId: "guard", time: "05s", body: "Compliance Guard confirmed the reply keeps human takeover available." },
  { id: "m5", agentId: "social", time: "08s", body: "Social Pilot found a matching Instagram thread that may use the same answer pattern." }
];

const priority = new Set(["Live", "Hot", "Risk", "Ready", "Buyer", "New"]);

export default function DesktopPage() {
  const [channel, setChannel] = useState<ChannelKey>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [action, setAction] = useState("Watching live");
  const [selectedAgentIds, setSelectedAgentIds] = useState(["apex", "gpt", "aria"]);
  const [holdStatus, setHoldStatus] = useState("Hold an agent to select or deselect");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesChannel = channel === "all" || conversation.channel === channel;
      const text = [conversation.customer, conversation.agent, conversation.summary, conversation.status, conversation.stage, conversation.sentiment, conversation.transcript.join(" ")].join(" ").toLowerCase();
      return matchesChannel && (!q || text.includes(q));
    });
  }, [channel, query]);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? visible[0] ?? conversations[0];

  function toggleAgent(agentId: string) {
    setSelectedAgentIds((current) => (current.includes(agentId) ? current.filter((id) => id !== agentId) : [...current, agentId]));
  }

  return (
    <main className="desktop-shell">
      <aside className="rail">
        <a className="brand" href="/"><b>A</b><span><strong>Auto Chat</strong><em>Desktop command</em></span></a>
        <p className="rail-title">Open channels</p>
        <div className="nav-list">
          {channels.map((item) => (
            <button className={channel === item.key ? "nav-item active" : "nav-item"} key={item.key} onClick={() => setChannel(item.key)}><span>{item.label.slice(0, 2).toUpperCase()}</span>{item.label}<b>{item.count}</b></button>
          ))}
        </div>
        <div className="surface-switch"><strong>Separate PWA</strong><p>The installable app now lives on its own page.</p><a href="/pwa">Open PWA app</a></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">Dedicated desktop page</p><h1>Conversation wall</h1><p>Full-width operator view for live WhatsApp and social communication monitoring.</p></div>
          <div className="top-actions"><span>Desktop</span><span className="dark">Escalations 9</span><button onClick={() => setAction("Observing selected")}>Observe selected</button></div>
        </header>

        <div className="filters">
          <div className="tabs">
            {channels.map((item) => <button className={channel === item.key ? "active" : ""} key={item.key} onClick={() => setChannel(item.key)}>{item.label} {item.count}</button>)}
          </div>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, agent, issue..." value={query} />
        </div>

        <section className="conversation-grid">
          {visible.map((conversation) => (
            <button className={`${selected.id === conversation.id ? "conversation selected" : "conversation"} ${conversation.stage === "Review" ? "alert" : ""}`} key={conversation.id} onClick={() => { setSelectedId(conversation.id); setAction("Watching live"); }}>
              <span className="conversation-head"><b>{conversation.channelLabel}</b><span><strong>{conversation.customer}</strong><em>{conversation.agent} - {conversation.age}</em></span><i /></span>
              <span className="conversation-summary">{conversation.summary}</span>
              <span className="conversation-tags"><em className={priority.has(conversation.status) ? "hot" : ""}>{conversation.status}</em><em>{conversation.stage}</em></span>
            </button>
          ))}
        </section>
      </section>

      <aside className="inspector">
        <ConversationInspector action={action} conversation={selected} setAction={setAction} />
        <AgentRoom holdStatus={holdStatus} onToggleAgent={toggleAgent} selectedAgentIds={selectedAgentIds} setHoldStatus={setHoldStatus} />
      </aside>
      <style>{css}</style>
    </main>
  );
}

function ConversationInspector({ action, conversation, setAction }: { action: string; conversation: Conversation; setAction: (value: string) => void }) {
  return (
    <section className="panel inspector-panel">
      <div className="panel-head"><h2>Observe selected</h2><p>Approve the next reply, take over, or pause the agent.</p></div>
      <div className="summary"><span>{conversation.channelLabel} live</span><strong>{conversation.customer} with {conversation.agent}</strong><small>Intent: {conversation.stage} - Sentiment: {conversation.sentiment}</small></div>
      <div className="thread">{conversation.transcript.map((line, index) => <p className={index % 2 ? "agent-line" : ""} key={`${conversation.id}-${index}`}>{index % 2 ? "Agent" : "Customer"}: {line}</p>)}</div>
      <div className="panel-actions"><button onClick={() => setAction("Approved next reply")}>Approve next reply</button><button className="white" onClick={() => setAction("Human takeover active")}>Take over</button><button className="dark" onClick={() => setAction("Agent paused")}>Pause</button><span>{action}</span></div>
    </section>
  );
}

function AgentRoom({ holdStatus, onToggleAgent, selectedAgentIds, setHoldStatus }: { holdStatus: string; onToggleAgent: (agentId: string) => void; selectedAgentIds: string[]; setHoldStatus: (value: string) => void }) {
  const holdTimer = useRef<number | null>(null);

  function clearHoldTimer() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function startHold(agent: Agent) {
    clearHoldTimer();
    setHoldStatus(`Holding ${agent.name}...`);
    holdTimer.current = window.setTimeout(() => {
      const willSelect = !selectedAgentIds.includes(agent.id);
      onToggleAgent(agent.id);
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

  const activeMessages = agentMessages.filter((message) => selectedAgentIds.includes(message.agentId));

  return (
    <section className="panel agent-panel">
      <div className="agent-head"><div><h2>Multi-agent chat</h2><p>Push and hold an agent button to select or deselect.</p></div><span>{selectedAgentIds.length}/{agents.length}</span></div>
      <div className="agent-grid">
        {agents.map((agent) => {
          const active = selectedAgentIds.includes(agent.id);
          return <button aria-pressed={active} className={active ? "agent-card on" : "agent-card"} key={agent.id} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggleAgent(agent.id); setHoldStatus(`${agent.name} ${active ? "deselected" : "selected"}`); } }} onPointerCancel={cancelHold} onPointerDown={() => startHold(agent)} onPointerLeave={cancelHold} onPointerUp={cancelHold}><span>{agent.badge}</span><strong>{agent.name}</strong><em>{agent.role}</em><i>{agent.status}</i></button>;
        })}
      </div>
      <div className="hold-status" aria-live="polite">{holdStatus}</div>
      <div className="agent-feed">{activeMessages.length ? activeMessages.map((message) => { const agent = agents.find((item) => item.id === message.agentId); return <p className="room-line" key={message.id}><b>{agent?.badge ?? "AGT"}</b><span><strong>{agent?.name ?? "Agent"} - {message.time}</strong>{message.body}</span></p>; }) : <p className="empty-room">No agents selected. Hold an agent button to bring them back into the room.</p>}</div>
    </section>
  );
}

const css = `
:root{--g:#39ff14;--ink:#050706;--muted:#687168;--line:rgba(5,7,6,.12)}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 18% 8%,rgba(57,255,20,.16),transparent 26%),linear-gradient(135deg,#fff 0%,#f7faf5 54%,#edf2eb 100%);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}button{cursor:pointer}.desktop-shell{min-height:100svh;padding:32px;display:grid;grid-template-columns:232px minmax(0,1fr)340px;gap:28px}.rail,.panel{border-radius:28px;color:#fff;background:radial-gradient(circle at 18% 88%,rgba(57,255,20,.16),transparent 26%),linear-gradient(150deg,#050706,#111713);box-shadow:22px 28px 60px rgba(5,7,6,.25)}.rail{padding:24px;display:flex;flex-direction:column;min-height:calc(100svh - 64px)}.brand{display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none;margin-bottom:34px}.brand>b,.nav-item span,.conversation-head>b{display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950}.brand>b{width:44px;height:44px;border-radius:14px;box-shadow:0 0 28px rgba(57,255,20,.72)}h1,h2,p{margin:0}.brand strong{font-size:24px;line-height:1;font-weight:950}.brand em{display:block;margin-top:4px;color:rgba(255,255,255,.65);font-size:11px;font-style:normal;font-weight:850;text-transform:uppercase}.rail-title{margin-bottom:12px;color:rgba(255,255,255,.54);font-size:11px;font-weight:950;text-transform:uppercase}.nav-list{display:grid;gap:8px}.nav-item{width:100%;min-height:48px;border:0;border-radius:16px;padding:8px 10px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:10px;color:rgba(255,255,255,.76);background:transparent;text-align:left;font-size:14px;font-weight:850}.nav-item.active{color:#fff;background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(57,255,20,.34)}.nav-item span{width:28px;height:28px;border-radius:10px;font-size:10px}.nav-item b{min-width:28px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:11px}.surface-switch{margin-top:auto;border-radius:22px;padding:18px;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.24)}.surface-switch strong,.eyebrow{color:var(--g);font-size:12px;font-weight:950;text-transform:uppercase}.surface-switch p{margin-top:8px;color:rgba(255,255,255,.74);font-size:13px;line-height:1.4;font-weight:700}.surface-switch a{margin-top:14px;min-height:36px;border-radius:999px;padding:0 14px;display:inline-flex;align-items:center;color:var(--ink);background:var(--g);font-size:12px;font-weight:950;text-decoration:none}.workspace{min-width:0;display:grid;grid-template-rows:auto auto 1fr;gap:20px}.topbar{min-height:94px;display:flex;align-items:center;justify-content:space-between;gap:20px}.topbar h1{margin-top:8px;font-size:clamp(34px,4vw,46px);line-height:1;font-weight:950}.topbar p:not(.eyebrow){margin-top:8px;color:var(--muted);font-size:15px;font-weight:700}.top-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}.top-actions span,.top-actions button,.panel-actions button{min-height:42px;border:0;border-radius:999px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink);background:#fff;font-size:13px;font-weight:900;white-space:nowrap;box-shadow:inset 0 0 0 1px var(--line),0 10px 26px rgba(5,7,6,.08)}.top-actions .dark,.panel-actions .dark{color:#fff;background:var(--ink);box-shadow:0 14px 32px rgba(5,7,6,.2)}.top-actions button,.panel-actions button:first-child{background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.32)}.filters{display:grid;grid-template-columns:minmax(0,1fr)260px;gap:14px;align-items:center}.tabs,.filters input{min-height:62px;border-radius:24px;background:rgba(255,255,255,.8);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 18px 42px rgba(5,7,6,.08)}.tabs{padding:9px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.tabs button{border:0;border-radius:17px;color:var(--muted);background:transparent;font-size:12px;font-weight:900}.tabs .active{color:var(--ink);background:var(--g);box-shadow:0 10px 24px rgba(57,255,20,.28)}.filters input{width:100%;border:0;outline:0;padding:0 18px;color:var(--ink);font-weight:750}.conversation-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:132px;gap:14px;align-content:start}.conversation{position:relative;border:0;border-radius:22px;padding:14px;overflow:hidden;display:grid;align-content:start;gap:10px;background:rgba(255,255,255,.96);box-shadow:0 18px 36px rgba(5,7,6,.11),inset 0 1px 0 rgba(255,255,255,.92);text-align:left;transform:perspective(900px) rotateX(3deg)}.conversation.selected,.conversation.alert{color:#fff;background:radial-gradient(circle at 92% 14%,rgba(57,255,20,.12),transparent 30%),linear-gradient(145deg,#050706,#121913)}.conversation.selected{box-shadow:0 24px 50px rgba(5,7,6,.2),0 0 0 2px var(--g),0 0 30px rgba(57,255,20,.18)}.conversation-head{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}.conversation-head>b{width:34px;height:34px;border-radius:12px;font-size:10px}.conversation:not(.selected):not(.alert) .conversation-head>b{color:var(--g);background:var(--ink)}.conversation-head strong,.conversation-head em,.conversation-summary{display:block}.conversation-head strong{font-size:13px}.conversation-head em{margin-top:2px;color:var(--muted);font-size:11px;font-style:normal;font-weight:850}.selected .conversation-head em,.alert .conversation-head em{color:rgba(255,255,255,.62)}.conversation-head i{width:10px;height:10px;border-radius:999px;background:var(--g);box-shadow:0 0 14px rgba(57,255,20,.9)}.conversation-summary{color:#3d453d;font-size:13px;line-height:1.25;font-weight:780}.selected .conversation-summary,.alert .conversation-summary{color:rgba(255,255,255,.88)}.conversation-tags{position:absolute;left:14px;right:14px;bottom:12px;display:flex;gap:8px}.conversation-tags em{min-width:64px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--muted);background:#edf2ec;font-size:10px;font-style:normal;font-weight:950}.selected .conversation-tags em,.alert .conversation-tags em{color:rgba(255,255,255,.82);background:rgba(255,255,255,.13)}.conversation-tags .hot{color:var(--ink)!important;background:var(--g)!important}.inspector{display:grid;gap:16px;align-content:start}.panel{padding:22px}.panel h2{font-size:24px;line-height:1.05;font-weight:950}.panel p{margin-top:7px;color:rgba(255,255,255,.64);font-size:12px;line-height:1.35;font-weight:760}.summary{margin-top:18px;border-radius:22px;padding:18px;color:#fff;background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.24)}.summary span,.summary strong,.summary small{display:block}.summary span{color:rgba(5,7,6,.76);font-size:12px;font-weight:950;text-transform:uppercase}.summary strong{margin-top:16px;color:#fff;font-size:20px;line-height:1.1}.summary small{margin-top:6px;color:var(--ink);font-weight:900}.thread{margin-top:18px;display:grid;gap:12px}.thread p{max-width:88%;border-radius:18px;padding:12px 13px;color:rgba(255,255,255,.9);background:#223026;font-size:12px;line-height:1.35;font-weight:780}.thread .agent-line{margin-left:auto;color:var(--ink);background:var(--g)}.panel-actions{margin-top:18px;display:grid;gap:10px}.panel-actions button{width:100%}.panel-actions .white{background:#fff}.panel-actions span{min-height:36px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:12px;font-weight:850}.agent-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.agent-head>span{min-width:48px;height:30px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:12px;font-weight:950}.agent-grid{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.agent-card{min-height:98px;border:0;border-radius:18px;padding:11px;display:grid;align-content:start;gap:5px;color:rgba(255,255,255,.64);background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);text-align:left;touch-action:manipulation;user-select:none}.agent-card.on{color:#fff;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.45),0 0 24px rgba(57,255,20,.12)}.agent-card span{width:32px;height:26px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px;font-weight:950}.agent-card strong{font-size:12px;line-height:1.1}.agent-card em,.agent-card i{font-style:normal;font-size:10px;font-weight:850}.agent-card em{color:rgba(255,255,255,.62)}.agent-card i{width:max-content;border-radius:999px;padding:4px 8px;color:var(--ink);background:#fff}.hold-status{margin-top:12px;min-height:32px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:11px;font-weight:900}.agent-feed{margin-top:12px;display:grid;gap:9px}.room-line{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:start;margin:0}.room-line>b{width:34px;height:28px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px}.room-line span{border-radius:16px;padding:10px;color:rgba(255,255,255,.84);background:#223026;font-size:11px;line-height:1.34;font-weight:760}.room-line strong{display:block;margin-bottom:3px;color:#fff;font-size:11px}.empty-room{border-radius:16px;padding:12px;color:rgba(255,255,255,.74);background:#223026;font-size:12px;line-height:1.35;font-weight:800}@media(max-width:1100px){.desktop-shell{display:block;padding:24px}.rail,.inspector{margin-top:18px}.workspace{margin-top:18px}.conversation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.topbar,.filters{display:block}.filters input{margin-top:12px}.tabs{display:flex;overflow:auto}}@media(max-width:760px){.desktop-shell:before{content:"Desktop console is optimized for wide screens. Open /pwa for the separate installed app.";display:block;margin-bottom:14px;border-radius:18px;padding:14px;color:var(--ink);background:var(--g);font-size:13px;font-weight:900}.conversation-grid{grid-template-columns:1fr}.top-actions{justify-content:flex-start;margin-top:14px}.tabs{min-height:44px;background:transparent;box-shadow:none;padding:0}.tabs button{min-width:max-content;padding:0 14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}.inspector{display:block}.panel{margin-top:14px}}
`;
