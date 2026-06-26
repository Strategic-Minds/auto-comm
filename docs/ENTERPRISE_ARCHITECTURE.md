# Enterprise Architecture

## Control Plane

Google Drive is the planning authority. Every build action should reference Drive documents for scope, compliance, prompts, templates, workflow specs, and validation requirements.

## Implementation Plane

GitHub repository `Strategic-Minds/auto-comm` mirrors implementation-facing assets: Vercel app/dashboard scaffold, API route specs, n8n workflow specs, Supabase schema contracts, WhatsApp template registry, AI assistant prompt pack, Auto Builder command documents, and validation checklist.

## Runtime Plane

Vercel hosts `/dashboard`, `/api/webhooks/whatsapp`, `/api/cron/daily-validation`, and future agent endpoints. n8n runs contact import, consent segmentation, outbound dispatch, inbound routing, human handoff notifications, daily metrics sync, and Drive/Supabase audit receipts.

## AI Roles

Intent classifier, lead scorer, response drafter, human handoff summarizer, campaign QA validator, compliance checker, location router, and RAG-grounded company/product/training assistant.

## Governance Pattern

Autonomy is bounded by policy: customer-facing messaging must respect consent, template, and opt-out rules; high-risk messages require human review; live platform provisioning uses dry-run-first Auto Builder jobs.
