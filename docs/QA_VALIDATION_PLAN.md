# QA Validation Plan

## Daily Validation

- Confirm no messages were sent to suppressed contacts.
- Confirm all campaign sends have template IDs.
- Confirm inbound messages have a conversation record.
- Confirm hot leads have handoff tasks.
- Confirm location routing has a valid target.
- Confirm AI responses were grounded or marked as fallback.
- Confirm Drive, GitHub, and Vercel planning docs have not drifted.

## Pre-Launch Gate

- Contact import deduped.
- Consent statuses assigned.
- WhatsApp templates approved.
- Supabase keys configured in Vercel.
- Twilio webhook verified.
- n8n workflow tested in dry run.
- Dashboard displays sample metrics.
- Human handoff channel tested.
- Rollback/pause control tested.
