# n8n Workflow Specs

## Contact Import

1. Deduplicate by phone, email, and company.
2. Normalize phone to E.164.
3. Assign consent status.
4. Assign source: PCU attendee, contractor, store lead, website lead, partner, manual.
5. Write to Supabase.
6. Generate import receipt in Drive.

## Outbound Campaign

1. Select eligible segment.
2. Confirm template and consent.
3. Check suppression list.
4. Send via WhatsApp/Twilio.
5. Log send event.
6. Wait for response.
7. Branch into qualification, nurture, opt-out, or handoff.

## Inbound Routing

1. Receive webhook.
2. Verify signature.
3. Store raw message.
4. Classify intent.
5. Score lead.
6. Route to brand/location.
7. Reply or draft for approval.
8. Create handoff task when required.
