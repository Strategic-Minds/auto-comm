# Vercel Dashboard Spec

## Dashboard Panels

1. Daily command center
2. Campaign funnel
3. Hot lead queue
4. Location routing map
5. Conversation review
6. Consent and suppression monitor
7. Template health
8. AI validation panel
9. Auto Builder job status
10. Financial attribution

## API Routes

- `POST /api/webhooks/whatsapp`
- `GET /api/cron/daily-validation`
- `POST /api/agent/lead-score`
- `POST /api/agent/campaign-review`
- `POST /api/agent/location-route`

## Operator Mockup

```text
AUTO COMM COMMAND CENTER
Replies: 34 | Hot Leads: 7 | Booked Calls: 3 | Opt-outs: 2
Imported 500 -> Reachable 430 -> Replied 52 -> Qualified 18 -> Booked 6
[HOT] Miami contractor -> Epoxy supply coupon -> XPS Xpress
[HOT] Campus facility manager -> Digital bid request -> National Epoxy Pros
Template Quality: Healthy | Suppression Sync: Current | Daily Validation: Pass
```
