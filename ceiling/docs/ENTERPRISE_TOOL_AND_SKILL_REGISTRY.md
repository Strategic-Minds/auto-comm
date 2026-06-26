# Enterprise Tool And Skill Registry

## Core Tools

| Tool | Role | Governance |
|---|---|---|
| Google Drive | Canonical planning and documentation control plane | Drive is source of truth for approved blueprints |
| GitHub | Implementation mirror and deployment source | Mirrors approved Drive docs |
| AUTO_BUILDER MCP | Governed provisioning and build orchestration | Dry-run first, approval for protected actions |
| Vercel | Dashboard, APIs, crons, validation agents | Deploy only from approved GitHub state |
| Supabase | Operational data and audit system | RLS, service-role guardrails, audit events |
| n8n | Workflow automation | Dry-run campaign mode before sends |
| Twilio / WhatsApp | Customer communication transport | Consent, opt-out, templates, signature checks |
| Base44 | Apex autonomous orchestrator | Must obey Drive/GitHub/provisioning sync rule |
| AI Gateway / OpenAI | Model routing and AI capabilities | Use evals, tool restrictions, escalation rules |

## Required Skills

Contact hygiene, consent classification, campaign planning, WhatsApp template governance, handoff triage, location routing, lead scoring, digital bid intake, product/training recommendation, RAG grounding, response QA, revenue attribution, executive reporting, and incident response.
