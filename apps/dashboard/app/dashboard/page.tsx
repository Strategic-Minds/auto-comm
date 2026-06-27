"use client";

import { useMemo, useState } from "react";

const channels = [
  ["all", "All", "ALL", 128],
  ["wa", "WhatsApp", "WA", 48],
  ["fb", "Facebook", "FB", 20],
  ["ig", "Instagram", "IG", 31],
  ["tt", "TikTok", "TT", 17],
  ["sc", "Snapchat", "SC", 12]
] as const;

const conversations = [
  ["maya-wa", "wa", "WA", "Maya R.", "ARIA Support", "02:14", "Asking if WhatsApp approvals can control social posts before they go live.", "Live", "Approval", "Positive", ["Can it approve posts from WhatsApp before they go live?", "Yes. I can route each publish request to your approval queue first.", "Can I watch the agent conversation while it happens?", "Yes. Auto Chat shows each active thread as a live card."]],
  ["devon-ig", "ig", "IG", "Devon P.", "Sales Agent", "04:51", "Lead replied to a reel and wants pricing for a social automation build.", "Hot", "Lead", "Interested", ["Saw the automation reel. What does setup cost?", "It depends on channels and volume. Want the MVP or enterprise path?"]],
  ["linda-fb", "fb", "FB", "Linda K.", "Service Agent", "01:06", "Complaint detected. Draft recovery reply is waiting for manager review.", "Risk", "Review", "Frustrated", ["This is taking too long. I need a real answer.", "I hear you. I am flagging this for direct review now."]],
  ["jay-tt", "tt", "TT", "Jay M.", "Content Agent", "06:33", "Creator asked for the clip schedule. Agent is sending draft options.", "TikTok", "Draft", "Neutral", ["When do the clips go out?", "I have three draft windows ready. Want morning or evening priority?"]],
  ["omar-wa", "wa", "WA", "Omar S.", "Booking Agent", "03:18", "Customer confirmed availability. Agent is collecting final requirements.", "Ready", "CRM", "Positive", ["Friday works.", "Perfect. What kind of space are you working with?"]],
  ["nia-sc", "sc", "SC", "Nia B.", "Social Agent", "00:44", "Snap response received. Agent is qualifying demo interest.", "Snap", "Qualify", "Curious", ["Can I see a demo?", "Yes. Are you looking for WhatsApp, Instagram, or both?"]],
  ["alex-ig", "ig", "IG", "Alex T.", "DM Agent", "09:21", "Technical question about memory sync and handoff receipts.", "Support", "Normal", "Neutral", ["Where does the memory get stored?", "The app writes conversation state and audit receipts before handoff."]],
  ["priya-wa", "wa", "WA", "Priya C.", "ARIA Sales", "02:57", "Lead asked for a build timeline. Agent is comparing MVP vs enterprise.", "Buyer", "Quote", "Buyer", ["How long would the first build take?", "MVP is usually the fastest path. Enterprise adds full governance."]],
  ["marcus-fb", "fb", "FB", "Marcus G.", "Inbox Agent", "07:40", "Invoice resend request found. Agent needs approval to send.", "Finance", "Hold", "Neutral", ["Can you resend the invoice?", "I found it. I need approval before sending account details."]],
  ["elle-tt", "tt", "TT", "Elle V.", "Trend Agent", "05:12", "Inbound comment thread is being summarized for a content opportunity.", "Trend", "Watch", "Positive", ["This would make a good follow-up video.", "Agreed. I am summarizing the thread for review."]],
  ["sam-wa", "wa", "WA", "Sam W.", "Onboarding", "08:05", "Agent is walking customer through connecting their WhatsApp number.", "Setup", "Guide", "Neutral", ["Where do I paste the webhook?", "Open the WhatsApp sender settings, then paste the Vercel webhook URL."]],
  ["rae-sc", "sc", "SC", "Rae L.", "Promo Agent", "01:36", "New campaign reply. Agent is checking eligibility before sending offer.", "New", "Offer", "Interested", ["Is the offer still open?", "I am checking eligibility first so I do not send the wrong details."]]
] as const;

const priority = new Set(["Live", "Hot", "Risk", "Ready", "Buyer", "New"]);

export default function DashboardPage() {
  const [channel, setChannel] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(conversations[0][0]);
  const [action, setAction] = useState("Watching live");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => (channel === "all" || c[1] === channel) && (!q || c.join(" ").toLowerCase().includes(q)));
  }, [channel, query]);

  const selected = conversations.find((c) => c[0] === selectedId) ?? visible[0] ?? conversations[0];

  return (
    <main className="shell">
      <aside className="side">
        <div className="brand"><b>A</b><div><h1>Auto Chat</h1><p>Live monitor</p></div></div>
        <p className="navtitle">Open channels</p>
        <div className="channels">{channels.map((c) => <button className={channel === c[0] ? "chan on" : "chan"} key={c[0]} onClick={() => setChannel(c[0])}><span>{c[2]}</span>{c[1]}<b>{c[3]}</b></button>)}</div>
        <div className="note"><strong>Grid mode</strong><p>Cards stay compact, then open a full observer view when selected.</p></div>
      </aside>

      <section className="work">
        <header className="top">
          <div><p className="eyebrow">Live customer communications</p><h2>Conversation wall</h2><p>Observe agents talking with customers across WhatsApp, Facebook, Instagram, TikTok, and Snapchat.</p></div>
          <div className="actions"><span>Dense</span><span className="black">Escalations 9</span><button onClick={() => setAction("Observing selected")}>Observe selected</button></div>
        </header>
        <div className="filters">
          <div className="tabs">{channels.map((c) => <button className={channel === c[0] ? "active" : ""} key={c[0]} onClick={() => setChannel(c[0])}>{c[1]} {c[3]}</button>)}</div>
          <input onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, agent, issue..." value={query} />
        </div>
        <div className="mobile"><Observer action={action} conversation={selected} setAction={setAction} /></div>
        <section className="grid">{visible.map((c) => <button className={`${selected[0] === c[0] ? "card selected" : "card"} ${c[8] === "Review" ? "hot" : ""}`} key={c[0]} onClick={() => { setSelectedId(c[0]); setAction("Watching live"); }}><span className="head"><b>{c[2]}</b><span><strong>{c[3]}</strong><em>{c[4]} - {c[5]}</em></span><i /></span><span className="msg">{c[6]}</span><span className="tags"><em className={priority.has(c[7]) ? "gold" : ""}>{c[7]}</em><em>{c[8]}</em></span></button>)}</section>
      </section>

      <aside className="desktop"><Observer action={action} conversation={selected} setAction={setAction} /></aside>
      <style>{css}</style>
    </main>
  );
}

function Observer({ conversation, action, setAction }: { conversation: (typeof conversations)[number]; action: string; setAction: (value: string) => void }) {
  const channelName = channels.find((c) => c[0] === conversation[1])?.[1] ?? "Channel";
  return (
    <div className="observer">
      <div className="observe-head"><h3>Observe selected</h3><p>Watch the live thread, approve the next reply, take over, or pause the agent.</p></div>
      <div className="summary"><span>{channelName} live</span><strong>{conversation[3]} with {conversation[4]}</strong><small>Intent: {conversation[8]} - Sentiment: {conversation[9]}</small></div>
      <div className="thread">{conversation[10].map((line, i) => <p className={i % 2 ? "agent" : ""} key={line}>{i % 2 ? "Agent" : "Customer"}: {line}</p>)}</div>
      <div className="obs-actions"><button onClick={() => setAction("Approved next reply")}>Approve next reply</button><button className="white" onClick={() => setAction("Human takeover active")}>Take over</button><button className="black" onClick={() => setAction("Agent paused")}>Pause</button><span>{action}</span></div>
    </div>
  );
}

const css = `
:root{--g:#39ff14;--ink:#050706;--muted:#687168;--line:rgba(5,7,6,.12)}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 18% 8%,rgba(57,255,20,.16),transparent 26%),linear-gradient(135deg,#fff 0%,#f7faf5 54%,#edf2eb 100%);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}button{cursor:pointer}.shell{min-height:100svh;padding:32px;display:grid;grid-template-columns:232px minmax(0,1fr)310px;gap:28px}.side,.observer{border-radius:28px;color:#fff;background:radial-gradient(circle at 18% 88%,rgba(57,255,20,.16),transparent 26%),linear-gradient(150deg,#050706,#111713);box-shadow:22px 28px 60px rgba(5,7,6,.25)}.side{padding:24px;display:flex;flex-direction:column;min-height:calc(100svh - 64px)}.brand{display:flex;align-items:center;gap:12px;margin-bottom:34px}.brand>b,.chan span,.head>b{display:grid;place-items:center;color:var(--ink);background:var(--g);font-weight:950}.brand>b{width:44px;height:44px;border-radius:14px;box-shadow:0 0 28px rgba(57,255,20,.72)}h1,h2,h3,p{margin:0}.brand h1{font-size:24px;line-height:1;font-weight:950}.brand p{margin-top:4px;color:rgba(255,255,255,.65);font-size:11px;font-weight:850;text-transform:uppercase}.navtitle{margin-bottom:12px;color:rgba(255,255,255,.54);font-size:11px;font-weight:950;text-transform:uppercase}.channels{display:grid;gap:8px}.chan{width:100%;min-height:48px;border:0;border-radius:16px;padding:8px 10px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:10px;color:rgba(255,255,255,.76);background:transparent;text-align:left;font-size:14px;font-weight:850}.chan.on{color:#fff;background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(57,255,20,.34)}.chan span{width:28px;height:28px;border-radius:10px;font-size:10px}.chan b{min-width:28px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--ink);background:var(--g);font-size:11px}.note{margin-top:auto;border-radius:22px;padding:18px;background:rgba(57,255,20,.16);box-shadow:inset 0 0 0 1px rgba(57,255,20,.24)}.note strong,.eyebrow{color:var(--g);font-size:12px;font-weight:950;text-transform:uppercase}.note p{margin-top:8px;color:rgba(255,255,255,.74);font-size:13px;line-height:1.4;font-weight:700}.work{min-width:0;display:grid;grid-template-rows:auto auto 1fr;gap:20px}.top{min-height:94px;display:flex;align-items:center;justify-content:space-between;gap:20px}.top h2{margin-top:8px;font-size:clamp(34px,4vw,46px);line-height:1;font-weight:950}.top p:not(.eyebrow){margin-top:8px;color:var(--muted);font-size:15px;font-weight:700}.actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}.actions span,.actions button,.obs-actions button{min-height:42px;border:0;border-radius:999px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink);background:#fff;font-size:13px;font-weight:900;white-space:nowrap;box-shadow:inset 0 0 0 1px var(--line),0 10px 26px rgba(5,7,6,.08)}.actions .black,.obs-actions .black{color:#fff;background:var(--ink);box-shadow:0 14px 32px rgba(5,7,6,.2)}.actions button,.obs-actions button:first-child{background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.32)}.filters{display:grid;grid-template-columns:minmax(0,1fr)240px;gap:14px;align-items:center}.tabs,.filters input{min-height:62px;border-radius:24px;background:rgba(255,255,255,.8);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9),0 18px 42px rgba(5,7,6,.08)}.tabs{padding:9px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.tabs button{border:0;border-radius:17px;color:var(--muted);background:transparent;font-size:12px;font-weight:900}.tabs .active{color:var(--ink);background:var(--g);box-shadow:0 10px 24px rgba(57,255,20,.28)}.filters input{width:100%;border:0;outline:0;padding:0 18px;color:var(--ink);font-weight:750}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:132px;gap:14px;align-content:start}.card{position:relative;border:0;border-radius:22px;padding:14px;overflow:hidden;display:grid;align-content:start;gap:10px;background:rgba(255,255,255,.96);box-shadow:0 18px 36px rgba(5,7,6,.11),inset 0 1px 0 rgba(255,255,255,.92);text-align:left;transform:perspective(900px) rotateX(3deg)}.card.selected,.card.hot{color:#fff;background:radial-gradient(circle at 92% 14%,rgba(57,255,20,.12),transparent 30%),linear-gradient(145deg,#050706,#121913)}.card.selected{box-shadow:0 24px 50px rgba(5,7,6,.2),0 0 0 2px var(--g),0 0 30px rgba(57,255,20,.18)}.head{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}.head>b{width:34px;height:34px;border-radius:12px;font-size:10px}.card:not(.selected):not(.hot) .head>b{color:var(--g);background:var(--ink)}.head strong,.head em,.msg{display:block}.head strong{font-size:13px}.head em{margin-top:2px;color:var(--muted);font-size:11px;font-style:normal;font-weight:850}.selected .head em,.hot .head em{color:rgba(255,255,255,.62)}.head i{width:10px;height:10px;border-radius:999px;background:var(--g);box-shadow:0 0 14px rgba(57,255,20,.9)}.msg{color:#3d453d;font-size:13px;line-height:1.25;font-weight:780}.selected .msg,.hot .msg{color:rgba(255,255,255,.88)}.tags{position:absolute;left:14px;right:14px;bottom:12px;display:flex;gap:8px}.tags em{min-width:64px;height:24px;border-radius:999px;display:grid;place-items:center;color:var(--muted);background:#edf2ec;font-size:10px;font-style:normal;font-weight:950}.selected .tags em,.hot .tags em{color:rgba(255,255,255,.82);background:rgba(255,255,255,.13)}.tags .gold{color:var(--ink)!important;background:var(--g)!important}.observer{padding:24px;align-self:stretch;min-height:calc(100svh - 64px);display:flex;flex-direction:column;gap:18px}.observer h3{font-size:25px;line-height:1.05;font-weight:950}.observer p{margin-top:8px;color:rgba(255,255,255,.65);font-size:13px;line-height:1.42;font-weight:700}.summary{border-radius:22px;padding:18px;color:#fff;background:var(--g);box-shadow:0 16px 36px rgba(57,255,20,.24)}.summary span,.summary strong,.summary small{display:block}.summary span{color:rgba(5,7,6,.76);font-size:12px;font-weight:950;text-transform:uppercase}.summary strong{margin-top:16px;color:#fff;font-size:20px;line-height:1.1}.summary small{margin-top:6px;color:var(--ink);font-weight:900}.thread{display:grid;gap:12px;align-content:start}.thread p{max-width:88%;border-radius:18px;padding:12px 13px;color:rgba(255,255,255,.9);background:#223026;font-size:12px;line-height:1.35;font-weight:780}.thread .agent{margin-left:auto;color:var(--ink);background:var(--g)}.obs-actions{margin-top:auto;display:grid;gap:10px}.obs-actions button{width:100%}.obs-actions .white{background:#fff}.obs-actions span{min-height:36px;border-radius:14px;display:grid;place-items:center;color:rgba(255,255,255,.76);background:rgba(255,255,255,.08);font-size:12px;font-weight:850}.mobile{display:none}@media(max-width:1120px){.shell{grid-template-columns:220px minmax(0,1fr)}.desktop{display:none}.mobile{display:block}.mobile .observer{min-height:unset}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){body{background:linear-gradient(135deg,#fff,#f6faf5)}.shell{min-height:100svh;padding:18px;display:block}.side{min-height:unset;border-radius:28px;padding:20px;display:block}.brand{margin-bottom:0}.navtitle,.channels,.note{display:none}.work{margin-top:24px;display:block}.top{display:block;min-height:unset}.top h2{font-size:30px}.top p:not(.eyebrow){font-size:13px}.actions{display:none}.filters{margin-top:18px;display:block}.tabs{min-height:40px;padding:0;display:flex;gap:8px;overflow-x:auto;background:transparent;box-shadow:none}.tabs button{min-width:58px;min-height:34px;padding:0 14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}.tabs .active{background:var(--g);box-shadow:none}.filters input{margin-top:12px;min-height:48px}.mobile{margin-top:20px}.mobile .observer{border-radius:26px;padding:20px}.mobile .observe-head,.mobile .thread{display:none}.obs-actions{margin-top:16px;grid-template-columns:1fr .72fr .62fr}.obs-actions button{min-height:38px;padding:0 12px}.obs-actions span{grid-column:1/-1}.grid{margin-top:26px;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:118px;gap:14px;padding-bottom:28px}.card{border-radius:20px;padding:12px;gap:8px}.head{grid-template-columns:30px 1fr auto;gap:8px}.head>b{width:30px;height:30px;border-radius:10px;font-size:9px}.head strong{font-size:12px}.head em{font-size:10px}.msg{font-size:11px}.tags em{min-width:56px;height:22px;font-size:9px}}
`;
