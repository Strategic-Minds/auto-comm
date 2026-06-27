"use client";

import { useMemo, useState } from "react";

type ChannelKey = "all" | "wa" | "fb" | "ig" | "tt" | "sc";
type Thread = {
  id: string;
  channel: ChannelKey;
  label: string;
  customer: string;
  owner: string;
  age: string;
  status: string;
  risk: "low" | "medium" | "high";
  summary: string;
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
  ["Active threads", "156", "+18 in 10 min"],
  ["Human review", "11", "4 high risk"],
  ["Agent lanes", "5", "live sync"],
  ["Avg response", "42s", "inside SLA"]
];

const threads: Thread[] = [
  { id: "maya", channel: "wa", label: "WA", customer: "Maya R.", owner: "ARIA Support", age: "02:14", status: "Approval", risk: "low", summary: "Wants WhatsApp approval before social posts go live." },
  { id: "devon", channel: "ig", label: "IG", customer: "Devon P.", owner: "Sales Agent", age: "04:51", status: "Hot lead", risk: "medium", summary: "Asked for automation pricing from an Instagram reel." },
  { id: "linda", channel: "fb", label: "FB", customer: "Linda K.", owner: "Service Agent", age: "01:06", status: "Review", risk: "high", summary: "Complaint detected. Recovery reply is held for manager approval." },
  { id: "jay", channel: "tt", label: "TT", customer: "Jay M.", owner: "Content Agent", age: "06:33", status: "Draft", risk: "low", summary: "Creator asked for the clip schedule and campaign timing." },
  { id: "omar", channel: "wa", label: "WA", customer: "Omar S.", owner: "Booking Agent", age: "03:18", status: "Ready", risk: "low", summary: "Availability confirmed. Requirements are being collected." },
  { id: "nia", channel: "sc", label: "SC", customer: "Nia B.", owner: "Social Agent", age: "00:44", status: "Qualify", risk: "low", summary: "Snap response received. Demo interest is being qualified." },
  { id: "priya", channel: "wa", label: "WA", customer: "Priya C.", owner: "ARIA Sales", age: "02:57", status: "Quote", risk: "medium", summary: "Lead asked for build timeline and MVP versus enterprise split." },
  { id: "brent", channel: "wa", label: "WA", customer: "Brent H.", owner: "Compliance Guard", age: "00:58", status: "Consent", risk: "high", summary: "Consent question detected before outbound enrollment." },
  { id: "elle", channel: "tt", label: "TT", customer: "Elle V.", owner: "Trend Agent", age: "05:12", status: "Watch", risk: "low", summary: "Comment thread is being summarized for a content opportunity." },
  { id: "alex", channel: "ig", label: "IG", customer: "Alex T.", owner: "DM Agent", age: "09:21", status: "Support", risk: "low", summary: "Technical question about memory sync and audit receipts." }
];

const agents = [
  ["APX", "Base44 APEX", "routing"],
  ["GPT", "GPT Strategist", "active"],
  ["ARI", "ARIA Support", "live"],
  ["SOC", "Social Pilot", "drafting"],
  ["GRD", "Compliance Guard", "watching"]
];

export default function HomePage() {
  const [channel, setChannel] = useState<ChannelKey>("all");
  const [selectedId, setSelectedId] = useState(threads[0].id);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesChannel = channel === "all" || thread.channel === channel;
      const text = [thread.customer, thread.owner, thread.summary, thread.status, thread.risk].join(" ").toLowerCase();
      return matchesChannel && (!q || text.includes(q));
    });
  }, [channel, query]);

  const selected = threads.find((thread) => thread.id === selectedId) ?? visible[0] ?? threads[0];

  return (
    <main className="site-shell">
      <nav className="top-nav">
        <a className="brand" href="/"><b>A</b><span><strong>Auto Chat</strong><em>Enterprise communications</em></span></a>
        <div className="nav-actions"><a href="/desktop">Desktop</a><a href="/pwa">PWA</a><a className="primary" href="/api/agents">Agents API</a></div>
      </nav>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Unified desktop and mobile website</p>
          <h1>Live customer communications command center</h1>
          <p>Monitor WhatsApp, Facebook, Instagram, TikTok, and Snapchat conversations with agent routing, approvals, and escalation control in one responsive surface.</p>
        </div>
        <div className="hero-status">
          <span>System health</span><strong>96%</strong><em>All channels online</em>
        </div>
      </section>

      <section className="metrics">{metrics.map(([label, value, detail]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong><em>{detail}</em></div>)}</section>

      <section className="console">
        <aside className="channels">
          <div className="section-title"><span>Queues</span><strong>Channels</strong></div>
          {channels.map((item) => <button className={channel === item.key ? "channel active" : "channel"} key={item.key} onClick={() => setChannel(item.key)}><span>{item.label.slice(0, 2).toUpperCase()}</span>{item.label}<b>{item.count}</b></button>)}
        </aside>

        <section className="workspace">
          <div className="controlbar"><div><span>Conversation wall</span><strong>{visible.length} visible threads</strong></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, agent, risk..." /></div>
          <div className="thread-grid">{visible.map((thread) => <button className={selected.id === thread.id ? `thread selected risk-${thread.risk}` : `thread risk-${thread.risk}`} key={thread.id} onClick={() => setSelectedId(thread.id)}><span className="thread-head"><b>{thread.label}</b><span><strong>{thread.customer}</strong><em>{thread.owner} - {thread.age}</em></span><i /></span><span className="summary">{thread.summary}</span><span className="tags"><em>{thread.status}</em><em>{thread.risk}</em></span></button>)}</div>
        </section>

        <aside className="inspector">
          <div className="selected-card"><span>{selected.label} selected</span><h2>{selected.customer}</h2><p>{selected.summary}</p><div><b>{selected.status}</b><b className="blue">{selected.risk} risk</b></div></div>
          <div className="agent-room"><div className="section-title"><span>Multi-agent room</span><strong>Live routing</strong></div>{agents.map(([badge, name, status]) => <div className="agent" key={name}><b>{badge}</b><span><strong>{name}</strong><em>{status}</em></span></div>)}</div>
        </aside>
      </section>

      <style>{css}</style>
    </main>
  );
}

const css = `
:root{--green:#39ff14;--blue:#2f7bff;--ink:#050706;--muted:#637063;--line:rgba(5,7,6,.1)}*{box-sizing:border-box}body{margin:0;background:linear-gradient(135deg,#f8fbf7,#edf4f1);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}.site-shell{min-height:100svh;padding:20px;display:grid;gap:16px}.top-nav{min-height:64px;border-radius:18px;padding:10px 12px 10px 14px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:#050706;color:#fff;box-shadow:0 16px 42px rgba(5,7,6,.18)}.brand{display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none}.brand>b{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:var(--ink);background:var(--green);font-weight:950;box-shadow:0 0 24px rgba(57,255,20,.6)}.brand strong,.brand em{display:block}.brand strong{font-size:22px;line-height:1;font-weight:950}.brand em{margin-top:4px;color:rgba(255,255,255,.62);font-style:normal;font-size:11px;font-weight:900;text-transform:uppercase}.nav-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nav-actions a{min-height:38px;border-radius:999px;padding:0 14px;display:inline-flex;align-items:center;color:rgba(255,255,255,.78);background:rgba(255,255,255,.08);font-size:12px;font-weight:900;text-decoration:none}.nav-actions .primary{color:#fff;background:var(--blue)}.hero-panel{min-height:180px;border-radius:24px;padding:24px;display:grid;grid-template-columns:minmax(0,1fr)230px;gap:18px;align-items:end;background:radial-gradient(circle at 85% 15%,rgba(47,123,255,.24),transparent 28%),linear-gradient(145deg,#050706,#101713);color:#fff;box-shadow:0 18px 48px rgba(5,7,6,.18)}h1,h2,p{margin:0}.eyebrow{color:var(--blue);font-size:12px;font-weight:950;text-transform:uppercase}.hero-copy h1{margin-top:10px;max-width:820px;font-size:clamp(34px,5vw,62px);line-height:.96;font-weight:950}.hero-copy p:not(.eyebrow){margin-top:14px;max-width:760px;color:rgba(255,255,255,.72);font-size:15px;line-height:1.45;font-weight:700}.hero-status{border-radius:20px;padding:18px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.hero-status span,.hero-status em{display:block;color:rgba(255,255,255,.66);font-size:12px;font-style:normal;font-weight:850}.hero-status strong{display:block;margin:10px 0 6px;color:var(--green);font-size:46px;line-height:1;font-weight:950}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{min-height:82px;border-radius:18px;padding:14px;background:#fff;box-shadow:0 12px 32px rgba(5,7,6,.07),inset 0 0 0 1px rgba(5,7,6,.06);border-top:3px solid var(--blue)}.metric:nth-child(even){border-top-color:var(--green)}.metric span,.metric em{display:block;color:var(--muted);font-size:11px;font-style:normal;font-weight:850}.metric strong{display:block;margin:6px 0 5px;font-size:26px;line-height:1;font-weight:950}.console{display:grid;grid-template-columns:230px minmax(0,1fr)330px;gap:14px;align-items:start}.channels,.workspace,.inspector>div{border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(5,7,6,.08),inset 0 0 0 1px rgba(5,7,6,.06)}.channels{padding:14px;display:grid;gap:8px}.section-title span,.controlbar span,.selected-card>span{display:block;color:var(--blue);font-size:11px;font-weight:950;text-transform:uppercase}.section-title strong,.controlbar strong{display:block;margin-top:3px;font-size:18px;font-weight:950}.channel{min-height:44px;border:0;border-radius:13px;padding:7px 9px;display:grid;grid-template-columns:30px 1fr auto;gap:9px;align-items:center;color:var(--muted);background:transparent;text-align:left;font-size:13px;font-weight:850;cursor:pointer}.channel span,.thread-head>b,.agent>b{display:grid;place-items:center;color:#fff;background:var(--blue);font-weight:950}.channel span{width:30px;height:30px;border-radius:10px;font-size:10px}.channel b{min-width:30px;height:24px;border-radius:999px;display:grid;place-items:center;color:#fff;background:#111;font-size:11px}.channel.active{color:#fff;background:#050706}.channel.active span{color:var(--ink);background:var(--green)}.workspace{padding:14px}.controlbar{display:grid;grid-template-columns:minmax(0,1fr)260px;gap:10px;align-items:center;margin-bottom:12px}.controlbar input{width:100%;min-height:44px;border:0;border-radius:14px;outline:0;padding:0 14px;background:#f2f6f3;color:var(--ink);font-weight:750}.thread-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}.thread{position:relative;min-height:126px;border:0;border-radius:16px;padding:12px;display:grid;align-content:start;gap:8px;overflow:hidden;background:#fdfefd;box-shadow:inset 0 0 0 1px rgba(5,7,6,.08);text-align:left;cursor:pointer}.thread:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:var(--blue)}.thread.risk-high:before{background:#ff5252}.thread.selected{color:#fff;background:linear-gradient(145deg,#050706,#121913);box-shadow:0 18px 36px rgba(5,7,6,.2),0 0 0 2px var(--blue)}.thread-head{display:grid;grid-template-columns:32px 1fr auto;gap:9px;align-items:center}.thread-head>b{width:32px;height:32px;border-radius:10px;font-size:10px}.thread.selected .thread-head>b{color:var(--ink);background:var(--green)}.thread-head strong,.thread-head em,.summary{display:block}.thread-head strong{font-size:13px}.thread-head em{margin-top:2px;color:var(--muted);font-size:10px;font-style:normal;font-weight:850}.thread.selected .thread-head em{color:rgba(255,255,255,.62)}.thread-head i{width:9px;height:9px;border-radius:999px;background:var(--green);box-shadow:0 0 12px rgba(57,255,20,.9)}.summary{color:#334033;font-size:12px;line-height:1.3;font-weight:760}.thread.selected .summary{color:rgba(255,255,255,.86)}.tags{position:absolute;left:12px;right:12px;bottom:10px;display:flex;gap:6px}.tags em{min-width:58px;height:22px;border-radius:999px;display:grid;place-items:center;color:var(--muted);background:#edf3ef;font-size:9px;font-style:normal;font-weight:950}.thread.selected .tags em{color:rgba(255,255,255,.82);background:rgba(255,255,255,.12)}.inspector{display:grid;gap:12px}.selected-card,.agent-room{padding:16px;background:#050706!important;color:#fff!important;border-top:3px solid var(--blue)}.selected-card h2{margin-top:6px;font-size:28px;line-height:1;font-weight:950}.selected-card p{margin-top:10px;color:rgba(255,255,255,.7);font-size:13px;line-height:1.42;font-weight:740}.selected-card div{margin-top:16px;display:flex;gap:8px;flex-wrap:wrap}.selected-card b{min-height:32px;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;color:var(--ink);background:var(--green);font-size:11px;font-weight:950}.selected-card .blue{color:#fff;background:var(--blue)}.agent-room{display:grid;gap:10px}.agent{min-height:50px;border-radius:14px;padding:9px;display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:center;background:rgba(255,255,255,.08)}.agent>b{width:34px;height:30px;border-radius:10px;font-size:10px}.agent strong,.agent em{display:block}.agent strong{font-size:12px}.agent em{margin-top:2px;color:rgba(255,255,255,.62);font-style:normal;font-size:10px;font-weight:850}@media(max-width:1100px){.console{grid-template-columns:200px minmax(0,1fr)}.inspector{grid-column:1/-1;grid-template-columns:1fr 1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.hero-panel{grid-template-columns:1fr}}@media(max-width:760px){.site-shell{padding:12px;gap:12px}.top-nav{align-items:flex-start}.nav-actions{justify-content:flex-start}.hero-panel{min-height:unset;padding:18px;border-radius:20px}.hero-copy h1{font-size:34px}.metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.metric{min-height:74px}.console{display:block}.channels,.workspace,.inspector{margin-top:10px}.channels{grid-template-columns:repeat(2,minmax(0,1fr))}.section-title{grid-column:1/-1}.channel{min-height:40px}.controlbar{display:block}.controlbar input{margin-top:10px}.thread-grid{grid-template-columns:1fr}.inspector{display:block}.selected-card,.agent-room{margin-top:10px}.brand em{display:none}}@media(max-width:460px){.top-nav{display:grid}.nav-actions a{flex:1;justify-content:center}.metrics{grid-template-columns:1fr}.channels{grid-template-columns:1fr}.hero-status strong{font-size:38px}}
`;
