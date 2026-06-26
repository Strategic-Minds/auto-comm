# Base44 Orchestrator Contract

## Role

Base44 is the apex orchestrator. It may coordinate LangChain, CrewAI, Supabase, Drive, n8n, GitHub, Vercel, and AUTO_BUILDER tasks.

## Required Inputs

Current Drive blueprint, GitHub manifest, Supabase schema map, Vercel provisioning plan, n8n workflow registry, and campaign/template registry.

## Required Outputs

Proposed action plan, risk classification, systems touched, rollback plan, validation checks, and receipt written to Drive.

## Sync Rule

Base44 must not treat live platform state as canonical by default. Drive is canonical planning, GitHub is implementation mirror, Vercel is runtime, Supabase is data plane, and AUTO_BUILDER is governed provisioning authority.
