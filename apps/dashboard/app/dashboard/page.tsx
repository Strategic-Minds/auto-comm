"use client";

import { useMemo, useRef, useState } from "react";
import { PwaInstallButtons } from "../components/PwaInstallButtons";

type ChannelKey = "all" | "wa" | "fb" | "ig" | "tt" | "sc";
type SocialChannelKey = Exclude<ChannelKey, "all">;

type Channel = {
  key: ChannelKey;
  label: string;
  badge: string;
  count: number;
};

type Conversation = {
  id: string;
  channel: SocialChannelKey;
  badge: string;
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

type AgentRoomMessage = {
  id: string;
  agentId: string;
  message: string;
  time: string;
};

const channels: Channel[] = [
  { key: "all", label: "All", badge: "ALL", count: 128 },
  { key: "wa", label: "WhatsApp", badge: "WA", count: 48 },
  { key: "fb", label: "Facebook", badge: "FB", count: 20 },
  { key: "ig", label: "Instagram", badge: "IG", count: 31 },
  { key: "tt", label: "TikTok", badge: "TT", count: 17 },
  { key: "sc", label: "Snapchat", badge: "SC", count: 12 }
];

const conversations: Conversation[] = [
  {
    id: "maya-wa",
    channel: "wa",
    badge: "WA",
    customer: "Maya R.",
    agent: "ARIA Support",
    age: "02:14",
    summary: "Asking if WhatsApp approvals can control social posts before they go live.",
    status: "Live",
    stage: "Approval",
    sentiment: "Positive",
    transcript: [
      "Can it approve posts from WhatsApp before they go live?",
      "Yes. I can route each publish request to your approval queue first.",
      "Can I watch the agent conversation while it happens?",
      "Yes. Auto Chat shows each active thread as a live card."
    ]
  },
  {
    id: "devon-ig",
    channel: "ig",
    badge: "IG",
    customer: "Devon P.",
    agent: "Sales Agent",
    age: "04:51",
    summary: "Lead replied to a reel and wants pricing for a social automation build.",
    status: "Hot",
    stage: "Lead",
    sentiment: "Interested",
    transcript: ["Saw the automation reel. What does setup cost?", "It depends on channels and volume. Want the MVP or enterprise path?"]
  },
  {
    id: "linda-fb",
    channel: "fb",
    badge: "FB",
    customer: "Linda K.",
    agent: "Service Agent",
    age: "01:06",
    summary: "Complaint detected. Draft recovery reply is waiting for manager review.",
    status: "Risk",
    stage: "Review",
    sentiment: "Frustrated",
    transcript: ["This is taking too long. I need a real answer.", "I hear you. I am flagging this for direct review now."]
  },
  {
    id: "jay-tt",
    channel: "tt",
    badge: "TT",
    customer: "Jay M.",
    agent: "Content Agent",
    age: "06:33",
    summary: "Creator asked for the clip schedule. Agent is sending draft options.",
    status: "TikTok",
    stage: "Draft",
    sentiment: "Neutral",
    transcript: ["When do the clips go out?", "I have three draft windows ready. Want morning or evening priority?"]
  },
  {
    id: "omar-wa",
    channel: "wa",
    badge: "WA",
    customer: "Omar S.",
    agent: "Booking Agent",
    age: "03:18",
    summary: "Customer confirmed availability. Agent is collecting final requirements.",
    status: "Ready",
    stage: "CRM",
    sentiment: "Positive",
    transcript: ["Friday works.", "Perfect. What kind of space are you working with?"]
  },
  {
    id: "nia-sc",
    channel: "sc",
    badge: "SC",
    customer: "Nia B.",
    agent: "Social Agent",
    age: "00:44",
    summary: "Snap response received. Agent is qualifying demo interest.",
    status: "Snap",
    stage: "Qualify",
    sentiment: "Curious",
    transcript: ["Can I see a demo?", "Yes. Are you looking for WhatsApp, Instagram, or both?"]
  },
  {
    id: "alex-ig",
    channel: "ig",
    badge: "IG",
    customer: "Alex T.",
    agent: "DM Agent",
    age: "09:21",
    summary: "Technical question about memory sync and handoff receipts.",
    status: "Support",
    stage: "Normal",
    sentiment: "Neutral",
    transcript: ["Where does the memory get stored?", "The app writes conversation state and audit receipts before handoff."]
  },
  {
    id: "priya-wa",
    channel: "wa",
    badge: "WA",
    customer: "Priya C.",
    agent: "ARIA Sales",
    age: "02:57",
    summary: "Lead asked for a build timeline. Agent is comparing MVP vs enterprise.",
    status: "Buyer",
    stage: "Quote",
    sentiment: "Buyer",
    transcript: ["How long would the first build take?", "MVP is usually the fastest path. Enterprise adds full governance."]
  },
  {
    id: "marcus-fb",
    channel: "fb",
    badge: "FB",
    customer: "Marcus G.",
    agent: "Inbox Agent",
    age: "07:40",
    summary: "Invoice resend request found. Agent needs approval to send.",
    status: "Finance",
    stage: "Hold",
    sentiment: "Neutral",
    transcript: ["Can you resend the invoice?", "I found it. I need approval before sending account details."]
  },
  {
    id: "elle-tt",
    channel: "tt",
    badge: "TT",
    customer: "Elle V.",
    agent: "Trend Agent",
    age: "05:12",
    summary: "Inbound comment thread is being summarized for a content opportunity.",
    status: "Trend",
    stage: "Watch",
    sentiment: "Positive",
    transcript: ["This would make a good follow-up video.", "Agreed. I am summarizing the thread for review."]
  },
  {
    id: "sam-wa",
    channel: "wa",
    badge: "WA",
    customer: "Sam W.",
    agent: "Onboarding",
    age: "08:05",
    summary: "Agent is walking customer through connecting their WhatsApp number.",
    status: "Setup",
    stage: "Guide",
    sentiment: "Neutral",
    transcript: ["Where do I paste the webhook?", "Open the WhatsApp sender settings, then paste the Vercel webhook URL."]
  },
  {
    id: "rae-sc",
    channel: "sc",
    badge: "SC",
    customer: "Rae L.",
    agent: "Promo Agent",
    age: "01:36",
    summary: "New campaign reply. Agent is checking eligibility before sending offer.",
    status: "New",
    stage: "Offer",
    sentiment: "Interested",
    transcript: ["Is the offer still open?", "I am checking eligibility first so I do not send the wrong details."]
  }
];

const agents: Agent[] = [
  { id: "apex", badge: "APX", name: "Base44 APEX", role: "super agent", status: "routing" },
  { id: "gpt", badge: "GPT", name: "GPT Strategist", role: "planning", status: "active" },
  { id: "aria", badge: "ARI", name: "ARIA Support", role: "customer replies", status: "live" },
  { id: "social", badge: "SOC", name: "Social Pilot", role: "social ops", status: "drafting" },
  { id: "guard", badge: "GRD", name: "Compliance Guard", role: "approval gate", status: "watching" }
];

const agentRoomMessages: AgentRoomMessage[] = [
  { id: "m1", agentId: "apex", time: "now", message: "APEX received the active WhatsApp thread and is routing context to GPT Strategist." },
  { id: "m2", agentId: "gpt", time: "now", message: "GPT Strategist is checking customer intent against the current offer and handoff rules." },
  { id: "m3", agentId: "aria", time: "02s", message: "ARIA prepared a short customer-safe reply and is waiting for approval." },
  { id: "m4", agentId: "guard", time: "05s", message: "Compliance Guard confirms the reply avoids unsupported claims and keeps human takeover available." },
  { id: "m5", agentId: "social", time: "08s", message: "Social Pilot found a matching Instagram comment thread that may need the same answer pattern." }
];

const priorityStatuses = new Set(["Live", "Hot", "Risk", "Ready", "Buyer", "New"]);

export default function DashboardPage() {
  const [channel, setChannel] = useState<ChannelKey>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [action, setAction] = useState("Watching live");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(["apex", "gpt", "aria"]);
  const [holdStatus, setHoldStatus] = useState("Hold an agent to select or deselect");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesChannel = channel === "all" || conversation.channel === channel;
      const searchText = [
        conversation.customer,
        conversation.agent,
        conversation.summary,
        conversation.status,
        conversation.stage,
        conversation.sentiment,
        conversation.transcript.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return matchesChannel && (!q || searchText.includes(q));
    });
  }, [channel, query]);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? visible[0] ?? conversations[0];

  function toggleAgent(agentId: string) {
    setSelectedAgentIds((current) => (current.includes(agentId) ? current.filter((id) => id !== agentId) : [...current, agentId]));
  }

  return (
    <main className="shell">
      <aside className="side">
        <div className="brand"><b>A</b><div><h1>Auto Chat</h1><p>Live monitor</p></div></div>
        <p className="navtitle">Open channels</p>
        <div className="channels">
          {channels.map((item) => (
            <button className={channel === item.key ? "chan on" : "chan"} key={item.key} onClick={() => setChannel(item.key)}>
              <span>{item.badge}</span>{item.label}<b>{item.count}</b>
            </button>
          ))}
        </div>
        <div className="note"><strong>PWA control</strong><p>Install Auto Chat for faster access to the live command center.</p></div>
      </aside>

      <section className="work">
        <header className="top">
          <div><p className="eyebrow">Live customer communications</p><h2>Conversation wall</h2><p>Observe agents talking with customers across WhatsApp, Facebook, Instagram, TikTok, and Snapchat.</p></div>
          <div className="actions"><span>Dense</span><span className="black">Escalations 9</span><button onClick={() => setAction("Observing selected")}>Observe selected</button><PwaInstallButtons compact /></div>
        </header>
        <div className="filters">
          <div className="tabs">
            {channels.map((item) => (
              <button className={channel === item.key ? "active" : ""} key={item.key} onClick={() => setChannel(item.key)}>{item.label} {item.count}</button>
            ))}
          </div>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, agent, issue..." value={query} />
        </div>
        <div className="mobile stack"><Observer action={action} conversation={selected} setAction={setAction} /><MultiAgentPanel holdStatus={holdStatus} onToggleAgent={toggleAgent} selectedAgentIds={selectedAgentIds} setHoldStatus={setHoldStatus} /></div>
        <section className="grid">
          {visible.map((conversation) => (
            <button className={`${selected.id === conversation.id ? "card selected" : "card"} ${conversation.stage === "Review" ? "hot" : ""}`} key={conversation.id} onClick={() => { setSelectedId(conversation.id); setAction("Watching live"); }}>
              <span className="head"><b>{conversation.badge}</b><span><strong>{conversation.customer}</strong><em>{conversation.agent} - {conversation.age}</em></span><i /></span>
              <span className="msg">{conversation.summary}</span>
              <span className="tags"><em className={priorityStatuses.has(conversation.status) ? "gold" : ""}>{conversation.status}</em><em>{conversation.stage}</em></span>
            </button>
          ))}
        </section>
      </section>

      <aside className="desktop inspector"><Observer action={action} conversation={selected} setAction={setAction} /><MultiAgentPanel holdStatus={holdStatus} onToggleAgent={toggleAgent} selectedAgentIds={selectedAgentIds} setHoldStatus={setHoldStatus} /></aside>
      <style>{css}</style>
    </main>
  );
}

function Observer({ conversation, action, setAction }: { conversation: Conversation; action: string; setAction: (value: string) => void }) {
  const channelName = channels.find((item) => item.key === conversation.channel)?.label ?? "Channel";

  return (
    <div className="observer">
      <div className="observe-head"><h3>Observe selected</h3><p>Watch the live thread, approve the next reply, take over, or pause the agent.</p></div>
      <div className="summary"><span>{channelName} live</span><strong>{conversation.customer} with {conversation.agent}</strong><small>Intent: {conversation.stage} - Sentiment: {conversation.sentiment}</small></div>
      <div className="thread">
        {conversation.transcript.map((line, index) => (
          <p className={index % 2 ? "agent" : ""} key={`${conversation.id}-${index}`}>{index % 2 ? "Agent" : "Customer"}: {line}</p>
        ))}
      </div>
      <div className="obs-actions"><button onClick={() => setAction("Approved next reply")}>Approve next reply</button><button className="white" onClick={() => setAction("Human takeover active")}>Take over</button><button className="black" onClick={() => setAction("Agent paused")}>Pause</button><span>{action}</span></div>
    </div>
  );
}

function MultiAgentPanel({ holdStatus, onToggleAgent, selectedAgentIds, setHoldStatus }: { holdStatus: string; onToggleAgent: (agentId: string) => void; selectedAgentIds: string[]; setHoldStatus: (value: string) => void }) {
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

  const selectedMessages = agentRoomMessages.filter((message) => selectedAgentIds.includes(message.agentId));

  return (
    <div className="agent-room">
      <div className="agent-head"><div><h3>Multi-agent chat</h3><p>Press and hold an agent to select or deselect them from the room.</p></div><span>{selectedAgentIds.length}/{agents.length}</span></div>
      <div className="agent-grid">
        {agents.map((agent) => {
          const active = selectedAgentIds.includes(agent.id);
          return (
            <button
              aria-pressed={active}
              className={active ? "agent on" : "agent"}
              key={agent.id}
              onContextMenu={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggleAgent(agent.id);
                  setHoldStatus(`${agent.name} ${active ? "deselected" : "selected"}`);
                }
              }}
              onPointerCancel={cancelHold}
              onPointerDown={() => startHold(agent)}
              onPointerLeave={cancelHold}
              onPointerUp={cancelHold}
            >
              <span>{agent.badge}</span><strong>{agent.name}</strong><em>{agent.role}</em><i>{agent.status}</i>
            </button>
          );
        })}
      </div>
      <div className="hold-status" aria-live="polite">{holdStatus}</div>
      <div className="agent-feed">
        {selectedMessages.length ? selectedMessages.map((message) => {
          const agent = agents.find((item) => item.id === message.agentId);
          return <p className="room-line" key={message.id}><b>{agent?.badge ?? "AGT"}</b><span><strong>{agent?.name ?? "Agent"} - {message.time}</strong>{message.message}</span></p>;
        }) : <p className="empty-room">No agents selected. Hold an agent button to bring them back into the room.</p>}
      </div>
    </div>
  );
}

const css = `
:root{--g:#39ff14;--ink:#050706;--muted:#687168;--line:rgba(5,7,6,.12)}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 18% 8%,rgba(57,255,20,.16),transparent 26%),linear-gradient(135deg,#fff 0%,#f7faf5 54%,#edf2eb 100%);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}button{cursor:pointer}.shell{min-height:100svh;padding:32px;display:grid;grid-template-columns:232px minmax(0,1fr)330px;gap:28px}.side,.observer,.agent-room{border-radius:28px;color:#fff;background:radial-gradient(circle at 18% 88%,rgba(57,255,20,.16),transparent 26%),linear-gradient(150deg,#050706,#111713);box-shadow:22px 28px 60px rgba(5,7,6,.25)}.side{padding:24px;display:flex;flex-direction:column;min-height:calc(100svh - 64px)}.brand{display:flex;align-items:center;gap:12px;margin-bottom:34px}.brand>b,.chan span,.head>b{display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950}.brand>b{width:44px;height:44px;border-radius:14px;box-shadow:0 0 28px rgba(57,255,20,.72)}h1,h2,h3,p{margin:0}.brand h1{font-size:24px;line-height:1;font-weight:950}.brand p{margin-top:4px;color:rgba(255,255,255,.65);font-size:11px;font-weight:850;text-transform:uppercase}.navtitle{margin-bottom:12px;color:rgba(255,255,255,.54);font-size:11px;font-weight:950;text-transform:uppercase}.channels{display:grid;gap:8px}.chan{width:100%;min-height:48px;border:0;border-radius:16px;padding:8px 10px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:10px;color:rgba(255,255,255,.76);background:transparent;text-align:left;font-size:14px;font-weight:850}.chan.on{color:#fff;background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(57,255,20,.34)}.chan span{width:28px;height:28px;border-radius:10px;font-size:10px}.chan b{min-width:28px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:11px}.note{margin-top:auto;border-radius:22px;padding:18px;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.24)}.note strong,.eyebrow{color:var(--g);font-size:12px;font-weight:950;text-transform:uppercase}.note p{margin-top:8px;color:rgba(255,255,255,.74);font-size:13px;line-height:1.4;font-weight:700}.work{min-width:0;display:grid;grid-template-rows:auto auto 1fr;gap:20px}.top{min-height:94px;display:flex;align-items:center;justify-content:space-between;gap:20px}.top h2{margin-top:8px;font-size:clamp(34px,4vw,46px);line-height:1;font-weight:950}.top p:not(.eyebrow){margin-top:8px;color:var(--muted);font-size:15px;font-weight:700}.actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}.actions span,.actions button,.obs-actions button{min-height:42px;border:0;border-radius:999px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink);background:#fff;font-size:13px;font-weight:900;white-space:nowrap;box-shadow:inset 0 0 0 1px var(--line),0 10px 26px rgba(5,7,6,.08)}.actions .black,.obs-actions .black{color:#fff;background:var(--ink);box-shadow:0 14px 32px rgba(5,7,6,.2)}.actions button,.obs-actions button:first-child{background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.32)}.filters{display:grid;grid-template-columns:minmax(0,1fr)240px;gap:14px;align-items:center}.tabs,.filters input{min-height:62px;border-radius:24px;background:rgba(255,255,255,.8);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 18px 42px rgba(5,7,6,.08)}.tabs{padding:9px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.tabs button{border:0;border-radius:17px;color:var(--muted);background:transparent;font-size:12px;font-weight:900}.tabs .active{color:var(--ink);background:var(--g);box-shadow:0 10px 24px rgba(57,255,20,.28)}.filters input{width:100%;border:0;outline:0;padding:0 18px;color:var(--ink);font-weight:750}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:132px;gap:14px;align-content:start}.card{position:relative;border:0;border-radius:22px;padding:14px;overflow:hidden;display:grid;align-content:start;gap:10px;background:rgba(255,255,255,.96);box-shadow:0 18px 36px rgba(5,7,6,.11),inset 0 1px 0 rgba(255,255,255,.92);text-align:left;transform:perspective(900px) rotateX(3deg)}.card.selected,.card.hot{color:#fff;background:radial-gradient(circle at 92% 14%,rgba(57,255,20,.12),transparent 30%),linear-gradient(145deg,#050706,#121913)}.card.selected{box-shadow:0 24px 50px rgba(5,7,6,.2),0 0 0 2px var(--g),0 0 30px rgba(57,255,20,.18)}.head{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}.head>b{width:34px;height:34px;border-radius:12px;font-size:10px}.card:not(.selected):not(.hot) .head>b{color:var(--g);background:var(--ink)}.head strong,.head em,.msg{display:block}.head strong{font-size:13px}.head em{margin-top:2px;color:var(--muted);font-size:11px;font-style:normal;font-weight:850}.selected .head em,.hot .head em{color:rgba(255,255,255,.62)}.head i{width:10px;height:10px;border-radius:999px;background:var(--g);box-shadow:0 0 14px rgba(57,255,20,.9)}.msg{color:#3d453d;font-size:13px;line-height:1.25;font-weight:780}.selected .msg,.hot .msg{color:rgba(255,255,255,.88)}.tags{position:absolute;left:14px;right:14px;bottom:12px;display:flex;gap:8px}.tags em{min-width:64px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--muted);background:#edf2ec;font-size:10px;font-style:normal;font-weight:950}.selected .tags em,.hot .tags em{color:rgba(255,255,255,.82);background:rgba(255,255,255,.13)}.tags .gold{color:var(--ink)!important;background:var(--g)!important}.observer{padding:24px;align-self:start;display:flex;flex-direction:column;gap:18px}.inspector{display:grid;gap:16px;align-content:start}.observer h3,.agent-room h3{font-size:25px;line-height:1.05;font-weight:950}.observer p{margin-top:8px;color:rgba(255,255,255,.65);font-size:13px;line-height:1.42;font-weight:700}.summary{border-radius:22px;padding:18px;color:#fff;background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.24)}.summary span,.summary strong,.summary small{display:block}.summary span{color:rgba(5,7,6,.76);font-size:12px;font-weight:950;text-transform:uppercase}.summary strong{margin-top:16px;color:#fff;font-size:20px;line-height:1.1}.summary small{margin-top:6px;color:var(--ink);font-weight:900}.thread{display:grid;gap:12px;align-content:start}.thread p{max-width:88%;border-radius:18px;padding:12px 13px;color:rgba(255,255,255,.9);background:#223026;font-size:12px;line-height:1.35;font-weight:780}.thread .agent{margin-left:auto;color:var(--ink);background:var(--g)}.obs-actions{margin-top:auto;display:grid;gap:10px}.obs-actions button{width:100%}.obs-actions .white{background:#fff}.obs-actions span{min-height:36px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:12px;font-weight:850}.agent-room{padding:20px}.agent-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.agent-head p{margin-top:7px;color:rgba(255,255,255,.64);font-size:12px;line-height:1.35;font-weight:760}.agent-head>span{min-width:48px;height:30px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:12px;font-weight:950}.agent-grid{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.agent{min-height:98px;border:0;border-radius:18px;padding:11px;display:grid;align-content:start;gap:5px;color:rgba(255,255,255,.64);background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);text-align:left;touch-action:manipulation;user-select:none}.agent.on{color:#fff;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.45),0 0 24px rgba(57,255,20,.12)}.agent span{width:32px;height:26px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px;font-weight:950}.agent strong{font-size:12px;line-height:1.1}.agent em,.agent i{font-style:normal;font-size:10px;font-weight:850}.agent em{color:rgba(255,255,255,.62)}.agent i{width:max-content;border-radius:999px;padding:4px 8px;color:var(--ink);background:#fff}.hold-status{margin-top:12px;min-height:32px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:11px;font-weight:900}.agent-feed{margin-top:12px;display:grid;gap:9px}.room-line{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:start;margin:0}.room-line>b{width:34px;height:28px;border-radius:10px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:10px}.room-line span{border-radius:16px;padding:10px;color:rgba(255,255,255,.84);background:#223026;font-size:11px;line-height:1.34;font-weight:760}.room-line strong{display:block;margin-bottom:3px;color:#fff;font-size:11px}.empty-room{border-radius:16px;padding:12px;color:rgba(255,255,255,.74);background:#223026;font-size:12px;line-height:1.35;font-weight:800}.mobile{display:none}.stack{display:none;gap:14px}@media(max-width:1180px){.shell{grid-template-columns:220px minmax(0,1fr)}.desktop{display:none}.mobile{display:block}.stack{display:grid}.mobile .observer{min-height:unset}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){body{background:linear-gradient(135deg,#fff,#f6faf5)}.shell{min-height:100svh;padding:18px;display:block}.side{min-height:unset;border-radius:28px;padding:20px;display:block}.brand{margin-bottom:0}.navtitle,.channels,.note{display:none}.work{margin-top:24px;display:block}.top{display:block;min-height:unset}.top h2{font-size:30px}.top p:not(.eyebrow){font-size:13px}.actions{margin-top:14px;justify-content:flex-start}.actions>span,.actions>button{display:none}.filters{margin-top:18px;display:block}.tabs{min-height:40px;padding:0;display:flex;gap:8px;overflow-x:auto;background:transparent;box-shadow:none}.tabs button{min-width:58px;min-height:34px;padding:0 14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}.tabs .active{background:var(--g);box-shadow:none}.filters input{margin-top:12px;min-height:48px}.mobile{margin-top:20px}.mobile .observer,.mobile .agent-room{border-radius:26px;padding:20px}.mobile .observe-head,.mobile .thread{display:none}.obs-actions{margin-top:16px;grid-template-columns:1fr .72fr .62fr}.obs-actions button{min-height:38px;padding:0 12px}.obs-actions span{grid-column:1/-1}.agent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.grid{margin-top:26px;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:118px;gap:14px;padding-bottom:28px}.card{border-radius:20px;padding:12px;gap:8px}.head{grid-template-columns:30px 1fr auto;gap:8px}.head>b{width:30px;height:30px;border-radius:10px;font-size:9px}.head strong{font-size:12px}.head em{font-size:10px}.msg{font-size:11px}.tags em{min-width:56px;height:22px;font-size:9px}}
`;
