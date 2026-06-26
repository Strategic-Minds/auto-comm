# GitHub Repo Manifest

Repository: `Strategic-Minds/auto-comm`

## Top-Level Structure

- `apps/dashboard` - Vercel Next.js dashboard and API routes.
- `builder-docs` - Auto Builder command and provisioning documents.
- `config` - runtime configuration manifests.
- `docs` - canonical implementation-facing docs mirrored from Drive.
- `prompts` - AI assistant prompts and response policies.
- `schemas` - lead, campaign, consent, message, and event contracts.
- `workflows/n8n` - n8n workflow specs.
- `tests` - validation and smoke-test notes.

## Sync Rule

Drive remains canonical for planning. GitHub mirrors implementation-facing content. Vercel and Auto Builder should consume GitHub files only when Drive and GitHub are synchronized.
