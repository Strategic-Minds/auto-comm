# Evals And Guardrails Blueprint

## Eval Suites

1. Consent and suppression compliance.
2. Brand accuracy.
3. RAG grounding.
4. Pricing safety.
5. Escalation detection.
6. Lead scoring consistency.
7. Location routing accuracy.
8. Conversation quality.
9. Campaign copy quality.
10. Human handoff summary accuracy.

## Minimum Passing Gates

No suppressed contact receives outbound messages. No unapproved pricing is generated. STOP/unsubscribe is handled correctly. High-risk conversations escalate. Lead routing chooses a valid brand and location. AI answers cite an approved internal source when required.

## Regression Tests

Run before new campaign launch, prompt update, RAG source update, Supabase schema migration, Vercel deployment, or agent permission change.
