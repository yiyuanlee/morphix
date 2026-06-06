## Summary
Set up Supabase for Morphix SaaS MVP: project, environments (dev/prod), and secrets wiring for local + Cloudflare/Vercel deploys.

## Acceptance criteria
- [ ] Supabase project created with separate dev/prod (or branches) strategy documented
- [ ] `.env.example` documents required vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Local dev can connect to Supabase from the app
- [ ] Production secrets stored in deployment platform (not committed)
- [ ] README section added: SaaS backend setup

## Technical notes
- Prefer Supabase CLI for migrations
- Keep existing static Morphix calculator working without auth until frontend gate lands

## Estimate
2-3 days

## Blocks
None (start here)

## Milestone
Phase 1 Week 1-2
