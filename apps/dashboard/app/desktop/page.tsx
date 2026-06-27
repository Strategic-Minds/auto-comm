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
  risk: "low" | "medium" | "high";
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
  { key: "all" as ChannelKey, label: "All", count: 156 },
  { key: "wa" as ChannelKey, label: "WhatsApp", count: 58 },
  { key: "fb" as ChannelKey, label: "Facebook", count: 24 },
  { key: "ig" as ChannelKey, label: "Instagram", count: 39 },
  { key: "tt" as ChannelKey, label: "TikTok", count: 21 },
  { key: "sc" as ChannelKey, label: "Snapchat", count: 14 }
];

const metrics = [
  { label: "Active threads", value: "156", detail: "+18 in 10 min", tone: "blue" },
  { label: "Agent lanes", value: "5", detail: "APEX routing", tone: "green" },
  { label: "Human review", value: "11", detail: "4 high priority", tone: "blue" },
  { label: "Avg response", value: "42s", detail: "inside SLA", tone: "green" }
];

const conversations: Conversation[] = [
  { id: "maya-wa", channel: "wa", channelLabel: "WA", customer: "Maya R.", agent: "ARIA Support", age: "02:14", summary: "Approval flow for WhatsApp-controlled social posting.", status: "Live", stage: "Approval", sentiment: "Positive", risk: "low", transcript: ["Can WhatsApp approve posts before they go live?", "Yes. Each publish request can route to your approval queue first.", "Can I watch the agent conversation while it happens?", "Yes. Auto Chat shows each active thread as a live card."] },
  { id: "devon-ig", channel: "ig", channelLabel: "IG", customer: "Devon P.", agent: "Sales Agent", age: "04:51", summary: "Instagram lead wants pricing for social automation.", status: "Hot", stage: "Lead", sentiment: "Interested", risk: "medium", transcript: ["Saw the automation reel. What does setup cost?", "It depends on channels and volume. Want the MVP or enterprise path?"] },
  { id: "linda-fb", channel: "fb", channelLabel: "FB", customer: "Linda K.", agent: "Service Agent", age: "01:06", summary: "Complaint detected. Recovery reply waiting for review.", status: "Risk", stage: "Review", sentiment: "Frustrated", risk: "high", transcript: ["This is taking too long. I need a real answer.", "I hear you. I am flagging this for direct review now."] },
  { id: "jay-tt", channel: "tt", channelLabel: "TT", customer: "Jay M.", agent: "Content Agent", age: "06:33", summary: "Creator asked for clip schedule and campaign timing.", status: "Draft", stage: "Content", sentiment: "Neutral", risk: "low", transcript: ["When do the clips go out?", "I have three draft windows ready. Want morning or evening priority?"] },
  { id: "omar-wa", channel: "wa", channelLabel: "WA", customer: "Omar S.", agent: "Booking Agent", age: "03:18", summary: "Availability confirmed and final requirements are being collected.", status: "Ready", stage: "CRM", sentiment: "Positive", risk: "low", transcript: ["Friday works.", "Perfect. What kind of space are you working with?"] },
  { id: "nia-sc", channel: "sc", channelLabel: "SC", customer: "Nia B.", agent: "Social Agent", age: "00:44", summary: "Snap response received and demo interest is being qualified.", status: "New", stage: "Qualify", sentiment: "Curious", risk: "low", transcript: ["Can I see a demo?", "Yes. Are you looking for WhatsApp, Instagram, or both?"] },
  { id: "priya-wa", channel: "wa", channelLabel: "WA", customer: "Priya C.", agent: "ARIA Sales", age: "02:57", summary: "Lead asked for build timeline and MVP vs enterprise split.", status: "Buyer", stage: "Quote", sentiment: "Buyer", risk: "medium", transcript: ["How long would the first build take?", "MVP is usually the fastest path. Enterprise adds full governance."] },
  { id: "elle-tt", channel: "tt", channelLabel: "TT", customer: "Elle V.", agent: "Trend Agent", age: "05:12", summary: "Comment thread is being summarized for content opportunity.", status: "Trend", stage: "Watch", sentiment: "Positive", risk: "low", transcript: ["This would make a good follow-up video.", "Agreed. I am summarizing the thread for review."] },
  { id: "marcus-fb", channel: "fb", channelLabel: "FB", customer: "Marcus G.", agent: "Inbox Agent", age: "07:40", summary: "Invoice resend request is held for account-data approval.", status: "Hold", stage: "Finance", sentiment: "Neutral", risk: "medium", transcript: ["Can you resend the invoice?", "I found it. I need approval before sending account details."] },
  { id: "alex-ig", channel: "ig", channelLabel: "IG", customer: "Alex T.", agent: "DM Agent", age: "09:21", summary: "Technical question about memory sync and audit receipts.", status: "Support", stage: "Normal", sentiment: "Neutral", risk: "low", transcript: ["Where does the memory get stored?", "The app writes conversation state and audit receipts before handoff."] },
  { id: "sam-wa", channel: "wa", channelLabel: "WA", customer: "Sam W.", agent: "Onboarding", age: "08:05", summary: "Customer needs help connecting WhatsApp webhook settings.", status: "Setup", stage: "Guide", sentiment: "Neutral", risk: "low", transcript: ["Where do I paste the webhook?", "Open the WhatsApp sender settings, then paste the Vercel webhook URL."] },
  { id: "rae-sc", channel: "sc", channelLabel: "SC", customer: "Rae L.", agent: "Promo Agent", age: "01:36", summary: "Campaign reply is checking eligibility before offer details.", status: "Offer", stage: "Promo", sentiment: "Interested", risk: "low", transcript: ["Is the offer still open?", "I am checking eligibility first so I do not send the wrong details."] },
  { id: "brent-wa", channel: "wa", channelLabel: "WA", customer: "Brent H.", agent: "Compliance Guard", age: "00:58", summary: "Consent question detected before outbound campaign enrollment.", status: "Consent", stage: "Guard", sentiment: "Cautious", risk: "high", transcript: ["Why did I get this message?", "I am checking consent history and can opt you out immediately if needed."] },
  { id: "tessa-ig", channel: "ig", channelLabel: "IG", customer: "Tessa V.", agent: "Social Pilot", age: "03:44", summary: "DM thread linked to a TikTok comment and needs unified response.", status: "Linked", stage: "Social", sentiment: "Positive", risk: "medium", transcript: ["I also commented on TikTok.", "I found that thread and can keep both responses aligned."] }
];

const agents: Agent[] = [
  { id: "apex", badge: "APX", name: "Base44 APEX", role: "super agent", status: "routing" },
  { id: "gpt", badge: "GPT", name: "GPT Strategist", role: "planning", status: "active" },
  { id: "aria", badge: "ARI", name: "ARIA Support", role: "customer replies", status: "live" },
  { id: "social", badge: "SOC", name: "Social Pilot", role: "social ops", status: "drafting" },
  { id: "guard", badge: "GRD", name: "Compliance Guard", role: "approval gate", status: "watching" }
];

const agentMessages: AgentMessage[] = [
  { id: "m1", agentId: "apex", time: "now", body: "APEX routed the selected thread to GPT Strategist and Compliance Guard." },
  { id: "m2", agentId: "gpt", time: "now", body: "GPT Strategist matched the customer intent to the enterprise automation path." },
  { id: "m3", agentId: "aria", time: "02s", body: "ARIA drafted a concise customer-safe reply and is waiting for approval." },
  { id: "m4", agentId: "guard", time: "05s", body: "Compliance Guard confirmed human takeover remains available." },
  { id: "m5", agentId: "social", time: "08s", body: "Social Pilot found a related Instagram/TikTok response pattern." }
];

const priority = new Set(["Live", "Hot", "Risk", "Ready", "Buyer", "New", "Consent"]);

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
        <a className="brand" href="/"><b>A</b><span><strong>Auto Chat</strong><em>Enterprise desktop</em></span></a>
        <p className="rail-title">Channel queues</p>
        <div className="nav-list">{channels.map((item) => <button className={channel === item.key ? "nav-item active" : "nav-item"} key={item.key} onClick={() => setChannel(item.key)}><span>{item.label.slice(0, 2).toUpperCase()}</span>{item.label}<b>{item.count}</b></button>)}</div>
        <div className="rail-status"><strong>Command health</strong><p>All routing lanes are online. PWA remains separate at /pwa.</p><a href="/pwa">Open PWA</a></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">Enterprise command center</p><h1>Desktop operations</h1><p>Dense monitoring for customer communications, agent routing, approvals, and escalation control.</p></div>
          <div className="top-actions"><span className="mode">Desktop</span><span className="blue">Blue queue view</span><button onClick={() => setAction("Observing selected")}>Observe selected</button></div>
        </header>

        <section className="metrics">{metrics.map((metric) => <div className={`metric ${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><em>{metric.detail}</em></div>)}</section>

        <div className="controlbar">
          <div className="tabs">{channels.map((item) => <button className={channel === item.key ? "active" : ""} key={item.key} onClick={() => setChannel(item.key)}>{item.label} {item.count}</button>)}</div>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, agent, risk, stage..." value={query} />
        </div>

        <section className="ops-strip">
          <div><span>Queue health</span><strong>96%</strong><em>stable</em></div>
          <div><span>Approval SLA</span><strong>7m</strong><em>avg wait</em></div>
          <div><span>High risk</span><strong>4</strong><em>needs review</em></div>
          <div><span>Agent sync</span><strong>Live</strong><em>5 lanes</em></div>
        </section>

        <section className="conversation-grid">
          {visible.map((conversation) => <ConversationCard conversation={conversation} key={conversation.id} selected={selected.id === conversation.id} onSelect={() => { setSelectedId(conversation.id); setAction("Watching live"); }} />)}
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

function ConversationCard({ conversation, onSelect, selected }: { conversation: Conversation; onSelect: () => void; selected: boolean }) {
  return (
    <button className={`${selected ? "conversation selected" : "conversation"} risk-${conversation.risk}`} onClick={onSelect}>
      <span className="conversation-head"><b>{conversation.channelLabel}</b><span><strong>{conversation.customer}</strong><em>{conversation.agent} - {conversation.age}</em></span><i /></span>
      <span className="conversation-summary">{conversation.summary}</span>
      <span className="conversation-tags"><em className={priority.has(conversation.status) ? "hot" : ""}>{conversation.status}</em><em>{conversation.stage}</em><em className="risk">{conversation.risk}</em></span>
    </button>
  );
}

function ConversationInspector({ action, conversation, setAction }: { action: string; conversation: Conversation; setAction: (value: string) => void }) {
  return (
    <section className="panel inspector-panel">
      <div className="panel-head"><span>{conversation.channelLabel} selected</span><h2>{conversation.customer}</h2><p>{conversation.summary}</p></div>
      <div className="summary"><span>{conversation.stage} - {conversation.sentiment}</span><strong>{conversation.agent}</strong><small>Risk: {conversation.risk} - Status: {conversation.status}</small></div>
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
      <div className="agent-head"><div><span>Agent room</span><h2>Multi-agent chat</h2><p>Push and hold an agent button to select or deselect.</p></div><b>{selectedAgentIds.length}/{agents.length}</b></div>
      <div className="agent-grid">{agents.map((agent) => { const active = selectedAgentIds.includes(agent.id); return <button aria-pressed={active} className={active ? "agent-card on" : "agent-card"} key={agent.id} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggleAgent(agent.id); setHoldStatus(`${agent.name} ${active ? "deselected" : "selected"}`); } }} onPointerCancel={cancelHold} onPointerDown={() => startHold(agent)} onPointerLeave={cancelHold} onPointerUp={cancelHold}><span>{agent.badge}</span><strong>{agent.name}</strong><em>{agent.role}</em><i>{agent.status}</i></button>; })}</div>
      <div className="hold-status" aria-live="polite">{holdStatus}</div>
      <div className="agent-feed">{activeMessages.length ? activeMessages.map((message) => { const agent = agents.find((item) => item.id === message.agentId); return <p className="room-line" key={message.id}><b>{agent?.badge ?? "AGT"}</b><span><strong>{agent?.name ?? "Agent"} - {message.time}</strong>{message.body}</span></p>; }) : <p className="empty-room">No agents selected. Hold an agent button to bring them back into the room.</p>}</div>
    </section>
  );
}

const css = `
:root{--g:#39ff14;--b:#2f7bff;--ink:#050706;--muted:#667066;--line:rgba(5,7,6,.12)}*{box-sizing:border-box}body{margin:0;background:linear-gradient(135deg,#f8fbf7,#eef4f0);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}button{cursor:pointer}.desktop-shell{min-height:100svh;padding:22px;display:grid;grid-template-columns:250px minmax(0,1fr)360px;gap:18px}.rail,.panel{border-radius:18px;color:#fff;background:linear-gradient(155deg,#050706,#101713);box-shadow:0 18px 42px rgba(5,7,6,.2)}.rail{padding:18px;display:flex;flex-direction:column;min-height:calc(100svh - 44px);border-top:3px solid var(--b)}.brand{display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none;margin-bottom:22px}.brand>b,.nav-item span,.conversation-head>b{display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950}.brand>b{width:42px;height:42px;border-radius:12px;box-shadow:0 0 22px rgba(57,255,20,.62)}h1,h2,p{margin:0}.brand strong{font-size:23px;line-height:1;font-weight:950}.brand em{display:block;margin-top:4px;color:rgba(255,255,255,.62);font-size:11px;font-style:normal;font-weight:850;text-transform:uppercase}.rail-title,.eyebrow,.panel-head span,.agent-head span{color:var(--b);font-size:11px;font-weight:950;text-transform:uppercase}.rail-title{margin-bottom:10px}.nav-list{display:grid;gap:7px}.nav-item{width:100%;min-height:43px;border:0;border-radius:12px;padding:7px 9px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:9px;color:rgba(255,255,255,.75);background:transparent;text-align:left;font-size:13px;font-weight:850}.nav-item.active{color:#fff;background:rgba(47,123,255,.18);box-shadow:inset 0 0 0 1px rgba(47,123,255,.44)}.nav-item span{width:28px;height:28px;border-radius:9px;font-size:10px}.nav-item b{min-width:28px;height:23px;border-radius:999px;display:grid;place-items:center;color:#fff;background:var(--b);font-size:11px}.rail-status{margin-top:auto;border-radius:16px;padding:15px;background:rgba(47,123,255,.16);box-shadow:inset 0 0 0 1px rgba(47,123,255,.28)}.rail-status strong{color:#fff;font-size:13px}.rail-status p{margin-top:7px;color:rgba(255,255,255,.72);font-size:12px;line-height:1.4;font-weight:700}.rail-status a{margin-top:12px;min-height:34px;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;color:#fff;background:var(--b);font-size:12px;font-weight:950;text-decoration:none}.workspace{min-width:0;display:grid;grid-template-rows:auto auto auto auto 1fr;gap:14px}.topbar{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:18px}.topbar h1{margin-top:5px;font-size:34px;line-height:1;font-weight:950}.topbar p:not(.eyebrow){margin-top:6px;color:var(--muted);font-size:14px;font-weight:700}.top-actions{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap}.top-actions span,.top-actions button,.panel-actions button{min-height:38px;border:0;border-radius:999px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink);background:#fff;font-size:12px;font-weight:900;white-space:nowrap;box-shadow:inset 0 0 0 1px var(--line),0 10px 24px rgba(5,7,6,.08)}.top-actions .blue{color:#fff;background:var(--b)}.top-actions .mode{color:#fff;background:var(--ink)}.top-actions button,.panel-actions button:first-child{background:var(--g);box-shadow:0 14px 28px rgba(57,255,20,.24)}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{min-height:84px;border-radius:16px;padding:13px 14px;background:#fff;box-shadow:0 14px 32px rgba(5,7,6,.08),inset 0 0 0 1px rgba(5,7,6,.06)}.metric span,.metric em{display:block;color:var(--muted);font-size:11px;font-style:normal;font-weight:850}.metric strong{display:block;margin:6px 0 5px;font-size:26px;line-height:1;font-weight:950}.metric.blue{border-top:3px solid var(--b)}.metric.green{border-top:3px solid var(--g)}.controlbar{display:grid;grid-template-columns:minmax(0,1fr)280px;gap:10px;align-items:center}.tabs,.controlbar input{min-height:52px;border-radius:16px;background:rgba(255,255,255,.9);box-shadow:inset 0 0 0 1px rgba(5,7,6,.08),0 12px 28px rgba(5,7,6,.06)}.tabs{padding:7px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}.tabs button{border:0;border-radius:12px;color:var(--muted);background:transparent;font-size:11px;font-weight:900}.tabs .active{color:#fff;background:var(--b);box-shadow:0 10px 22px rgba(47,123,255,.25)}.controlbar input{width:100%;border:0;outline:0;padding:0 16px;color:var(--ink);font-weight:750}.ops-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.ops-strip div{min-height:58px;border-radius:14px;padding:11px 12px;display:grid;grid-template-columns:1fr auto;align-items:center;background:#08110c;color:#fff;box-shadow:inset 0 0 0 1px rgba(47,123,255,.22)}.ops-strip span{grid-column:1/-1;color:rgba(255,255,255,.6);font-size:10px;font-weight:950;text-transform:uppercase}.ops-strip strong{font-size:18px;font-weight:950}.ops-strip em{color:var(--g);font-style:normal;font-size:11px;font-weight:900}.conversation-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(246px,1fr));grid-auto-rows:124px;gap:10px;align-content:start}.conversation{position:relative;border:0;border-radius:16px;padding:12px;overflow:hidden;display:grid;align-content:start;gap:8px;background:#fff;box-shadow:0 12px 26px rgba(5,7,6,.08),inset 0 0 0 1px rgba(5,7,6,.06);text-align:left}.conversation:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:var(--b);opacity:.65}.conversation.selected{color:#fff;background:linear-gradient(145deg,#050706,#121913);box-shadow:0 20px 38px rgba(5,7,6,.2),0 0 0 2px var(--b),0 0 28px rgba(47,123,255,.2)}.conversation.risk-high:before{background:#ff4d4d}.conversation.risk-medium:before{background:var(--b)}.conversation-head{display:grid;grid-template-columns:32px 1fr auto;gap:9px;align-items:center}.conversation-head>b{width:32px;height:32px;border-radius:10px;font-size:10px}.conversation:not(.selected) .conversation-head>b{color:#fff;background:var(--b)}.conversation-head strong,.conversation-head em,.conversation-summary{display:block}.conversation-head strong{font-size:13px}.conversation-head em{margin-top:2px;color:var(--muted);font-size:10px;font-style:normal;font-weight:850}.selected .conversation-head em{color:rgba(255,255,255,.62)}.conversation-head i{width:9px;height:9px;border-radius:999px;background:var(--g);box-shadow:0 0 12px rgba(57,255,20,.9)}.conversation-summary{color:#344034;font-size:12px;line-height:1.25;font-weight:780}.selected .conversation-summary{color:rgba(255,255,255,.88)}.conversation-tags{position:absolute;left:12px;right:12px;bottom:10px;display:flex;gap:6px}.conversation-tags em{min-width:52px;height:22px;border-radius:999px;display:grid;place-items:center;color:var(--muted);background:#eef3ef;font-size:9px;font-style:normal;font-weight:950}.selected .conversation-tags em{color:rgba(255,255,255,.84);background:rgba(255,255,255,.13)}.conversation-tags .hot{color:var(--ink)!important;background:var(--g)!important}.conversation-tags .risk{color:#fff;background:var(--b)}.inspector{display:grid;gap:12px;align-content:start}.panel{padding:18px;border-top:3px solid var(--b)}.panel h2{margin-top:4px;font-size:23px;line-height:1.05;font-weight:950}.panel p{margin-top:7px;color:rgba(255,255,255,.66);font-size:12px;line-height:1.35;font-weight:760}.summary{margin-top:14px;border-radius:16px;padding:14px;color:#fff;background:linear-gradient(135deg,var(--b),#1749ac);box-shadow:0 14px 32px rgba(47,123,255,.22)}.summary span,.summary strong,.summary small{display:block}.summary span{color:rgba(255,255,255,.75);font-size:11px;font-weight:950;text-transform:uppercase}.summary strong{margin-top:10px;color:#fff;font-size:18px;line-height:1.1}.summary small{margin-top:5px;color:#dfe8ff;font-weight:900}.thread{margin-top:14px;display:grid;gap:9px}.thread p{max-width:92%;border-radius:14px;padding:10px 11px;color:rgba(255,255,255,.9);background:#223026;font-size:11px;line-height:1.35;font-weight:780}.thread .agent-line{margin-left:auto;color:var(--ink);background:var(--g)}.panel-actions{margin-top:14px;display:grid;gap:8px}.panel-actions button{width:100%}.panel-actions .white{background:#fff}.panel-actions .dark{color:#fff;background:var(--ink)}.panel-actions span{min-height:34px;border-radius:12px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:11px;font-weight:850}.agent-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.agent-head>b{min-width:46px;height:30px;border-radius:999px;display:grid;place-items:center;color:#fff;background:var(--b);font-size:12px}.agent-grid{margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.agent-card{min-height:92px;border:0;border-radius:14px;padding:10px;display:grid;align-content:start;gap:5px;color:rgba(255,255,255,.64);background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);text-align:left;touch-action:manipulation;user-select:none}.agent-card.on{color:#fff;background:rgba(47,123,255,.2);box-shadow:inset 0 0 0 1px rgba(47,123,255,.48),0 0 24px rgba(47,123,255,.12)}.agent-card span{width:32px;height:25px;border-radius:9px;display:grid;place-items:center;color:#fff;background:var(--b);font-size:10px;font-weight:950}.agent-card strong{font-size:12px;line-height:1.1}.agent-card em,.agent-card i{font-style:normal;font-size:10px;font-weight:850}.agent-card em{color:rgba(255,255,255,.62)}.agent-card i{width:max-content;border-radius:999px;padding:4px 8px;color:var(--ink);background:var(--g)}.hold-status{margin-top:10px;min-height:30px;border-radius:12px;display:grid;place-items:center;color:rgba(255,255,255,.78);background:rgba(255,255,255,.08);font-size:11px;font-weight:900}.agent-feed{margin-top:10px;display:grid;gap:8px}.room-line{display:grid;grid-template-columns:32px 1fr;gap:8px;align-items:start;margin:0}.room-line>b{width:32px;height:27px;border-radius:9px;display:grid;place-items:center;color:#fff;background:var(--b);font-size:10px}.room-line span{border-radius:13px;padding:9px;color:rgba(255,255,255,.84);background:#223026;font-size:11px;line-height:1.34;font-weight:760}.room-line strong{display:block;margin-bottom:3px;color:#fff;font-size:11px}.empty-room{border-radius:13px;padding:11px;color:rgba(255,255,255,.74);background:#223026;font-size:12px;line-height:1.35;font-weight:800}@media(max-width:1280px){.desktop-shell{grid-template-columns:220px minmax(0,1fr)}.inspector{grid-column:2}.conversation-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}}@media(max-width:900px){.desktop-shell{display:block;padding:18px}.rail,.workspace,.inspector{margin-top:14px}.metrics,.ops-strip{grid-template-columns:repeat(2,minmax(0,1fr))}.controlbar{display:block}.controlbar input{margin-top:10px}.tabs{display:flex;overflow:auto}.tabs button{min-width:max-content;padding:0 12px}.conversation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.desktop-shell:before{content:"Desktop console is optimized for wide screens. Open /pwa for the separate installed app.";display:block;margin-bottom:12px;border-radius:14px;padding:13px;color:var(--ink);background:var(--g);font-size:12px;font-weight:950}.topbar{display:block}.top-actions{justify-content:flex-start;margin-top:12px}.metrics,.ops-strip,.conversation-grid{grid-template-columns:1fr}.rail{min-height:unset}.inspector{display:block}.panel{margin-top:12px}}
`;
