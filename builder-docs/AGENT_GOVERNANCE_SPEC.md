# Agent Governance Spec

## Agent Classes

- Apex orchestrator: Base44 super agent.
- Build governor: AUTO_BUILDER MCP.
- Campaign planner: proposes segments, templates, offers, and schedules.
- Compliance validator: checks consent, opt-out, and template safety.
- Conversation assistant: drafts and classifies replies.
- Sales router: assigns lead to brand, location, and human owner.
- QA agent: validates Drive/GitHub/Vercel alignment.

## Hard Stops

- No outbound marketing without consent status.
- No messaging to suppressed contacts.
- No pricing guarantee without approved pricing source.
- No legal, tax, employment, or safety advice.
- No fake human identity.
- No live deploy or campaign send without approval.

## Escalation Triggers

Complaint, threat, anger, legal terms, refund, chargeback, injury, warranty, safety, enterprise bid, national account, or deal value above configured threshold.
