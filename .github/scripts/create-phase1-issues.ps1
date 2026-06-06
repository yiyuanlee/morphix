# Creates Phase 1 SaaS MVP GitHub issues (idempotent-ish: run once)
$Repo = "yiyuanlee/morphix"
$Milestone = "Phase 1: SaaS MVP"

function New-MorphixIssue {
  param(
    [string]$Title,
    [string]$Body,
    [string[]]$Labels
  )
  $labelArgs = $Labels | ForEach-Object { "--label", $_ }
  gh issue create -R $Repo --title $Title --body $Body --milestone $Milestone @labelArgs
}

$issues = @(
  @{
    Title = "[Infra] Initialize Supabase project and environment configuration"
    Labels = @("phase-1", "infra")
    Body = @"
## Summary
Set up Supabase for Morphix SaaS MVP: project, environments (dev/prod), and secrets wiring for local + Cloudflare/Vercel deploys.

## Acceptance criteria
- [ ] Supabase project created with separate dev/prod (or branches) strategy documented
- [ ] `.env.example` documents required vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Local dev can connect to Supabase from the app
- [ ] Production secrets stored in deployment platform (not committed)
- [ ] README section added: "SaaS backend setup"

## Technical notes
- Prefer Supabase CLI for migrations
- Keep existing static Morphix calculator working without auth until frontend gate lands

## Estimate
2–3 days

## Blocks
None (start here)
"@
  },
  @{
    Title = "[DB] Design Phase 1 database schema and migrations"
    Labels = @("phase-1", "infra")
    Body = @"
## Summary
Design and implement Postgres schema for authenticated users, saved plans, weight logs, check-ins, and subscription mirror table.

## Acceptance criteria
- [ ] Migration files checked into repo (e.g. `supabase/migrations/`)
- [ ] Tables created:
  - `profiles` (extends auth.users: display_name, locale, onboarding_completed)
  - `plans` (user_id, input snapshot JSON, result snapshot JSON, created_at)
  - `weight_logs` (user_id, weight_kg, logged_at, note optional)
  - `checkins` (user_id, plan_id optional, date, completed boolean, notes optional)
  - `subscriptions` (user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end)
- [ ] Indexes on `user_id`, `logged_at`, `date`
- [ ] Seed script or SQL comments documenting JSON shape for plan payloads

## Dependencies
- Depends on # (Supabase init issue — link after creation)

## Estimate
2–3 days
"@
  },
  @{
    Title = "[Auth] Configure Supabase Auth (email + Google OAuth)"
    Labels = @("phase-1", "auth")
    Body = @"
## Summary
Enable user authentication via Supabase Auth with email magic link (or email/password) and Google OAuth.

## Acceptance criteria
- [ ] Email sign-in enabled with redirect URLs for local + production
- [ ] Google OAuth provider configured and tested
- [ ] Auth callback route implemented (`/auth/callback`)
- [ ] Session refresh handled on page load
- [ ] Logout clears session client-side and server-side cookies (if SSR)

## Dependencies
- Supabase project initialized
- Database schema with `profiles` table + trigger on signup

## Estimate
2 days
"@
  },
  @{
    Title = "[Security] Implement Row Level Security (RLS) policies"
    Labels = @("phase-1", "auth", "infra")
    Body = @"
## Summary
Lock down all user data with Supabase RLS so users can only read/write their own rows.

## Acceptance criteria
- [ ] RLS enabled on `profiles`, `plans`, `weight_logs`, `checkins`, `subscriptions`
- [ ] Policies: SELECT/INSERT/UPDATE/DELETE scoped to `auth.uid() = user_id`
- [ ] `subscriptions` writes restricted to service role (webhook only)
- [ ] Manual test: User A cannot read User B data via Supabase client
- [ ] Policy tests documented in migration comments or README

## Dependencies
- Database schema migration merged

## Estimate
1–2 days
"@
  },
  @{
    Title = "[API] Plan persistence — save, load, and list user plans"
    Labels = @("phase-1", "infra")
    Body = @"
## Summary
Persist generated fitness plans to Supabase so logged-in users can access history across devices.

## Acceptance criteria
- [ ] API/service layer: `savePlan()`, `getPlan(id)`, `listPlans(limit)`
- [ ] Stores both input state (height, weight, goal, etc.) and rendered result metadata
- [ ] Free tier: keep latest 1 plan; Pro tier: unlimited (gate can be stubbed until billing lands)
- [ ] Error handling for offline / unauthenticated users
- [ ] Unit tests or integration test script for CRUD

## Dependencies
- RLS policies in place

## Estimate
2–3 days
"@
  },
  @{
    Title = "[API] Weight logs and training check-ins persistence"
    Labels = @("phase-1", "infra")
    Body = @"
## Summary
Backend persistence for weight tracking and daily/weekly training check-ins.

## Acceptance criteria
- [ ] `weight_logs`: create, list by date range, delete entry
- [ ] `checkins`: upsert by date, list week view, streak calculation helper
- [ ] Validation: weight 30–300 kg, date not in future
- [ ] Pro-only gate hook prepared (free users: read-only or last 7 days — decide in issue comments)

## Dependencies
- Database schema + RLS

## Estimate
2 days
"@
  },
  @{
    Title = "[Frontend] Authentication UI and session management"
    Labels = @("phase-1", "frontend", "auth")
    Body = @"
## Summary
Add login/signup/logout UI integrated with Supabase Auth, matching Morphix visual design.

## Acceptance criteria
- [ ] Nav shows Login / Sign up when logged out; avatar menu when logged in
- [ ] Auth modal or dedicated `/login` page (mobile-friendly)
- [ ] Loading and error states for auth actions
- [ ] Session persisted across refresh; redirect back to calculator after login
- [ ] i18n strings for auth copy (zh/en)

## Dependencies
- Supabase Auth configured

## Estimate
3–4 days
"@
  },
  @{
    Title = "[Frontend] Cloud plan sync with localStorage fallback"
    Labels = @("phase-1", "frontend")
    Body = @"
## Summary
After generating a plan, logged-in users auto-save to cloud; guests keep localStorage behavior.

## Acceptance criteria
- [ ] On `generatePlan()`, if authenticated → save to Supabase
- [ ] On app load, authenticated users restore latest saved inputs from cloud
- [ ] Merge strategy documented: cloud wins on login, offer import from localStorage once
- [ ] "Saved to cloud" / "Sign in to sync" UX feedback
- [ ] Works on mobile

## Dependencies
- Plan persistence API
- Auth UI

## Estimate
2–3 days
"@
  },
  @{
    Title = "[Billing] Configure Stripe products, prices, and 7-day trial"
    Labels = @("phase-1", "billing")
    Body = @"
## Summary
Create Stripe Product/Price objects for Morphix Pro (monthly + annual) with 7-day free trial.

## Acceptance criteria
- [ ] Stripe test mode products created: Pro Monthly, Pro Annual
- [ ] Prices documented in README or internal doc (IDs redacted in repo, stored in env)
- [ ] 7-day trial configured on subscription prices
- [ ] Customer portal enabled for self-service cancel/update payment
- [ ] `.env.example` includes `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs

## Dependencies
- Supabase project (for linking stripe_customer_id on profile/subscription)

## Estimate
1 day
"@
  },
  @{
    Title = "[Billing] Stripe Checkout session flow"
    Labels = @("phase-1", "billing", "frontend")
    Body = @"
## Summary
Implement Upgrade to Pro flow using Stripe Checkout (hosted page).

## Acceptance criteria
- [ ] Pricing page CTA opens Checkout Session (monthly + annual options)
- [ ] `client_reference_id` or metadata includes Supabase `user_id`
- [ ] Success URL → onboarding or dashboard with confirmation toast
- [ ] Cancel URL → pricing page without error state
- [ ] Logged-out users prompted to sign in before checkout

## Dependencies
- Stripe products configured
- Auth UI

## Estimate
2 days
"@
  },
  @{
    Title = "[Billing] Stripe webhook handler and subscription sync"
    Labels = @("phase-1", "billing", "infra")
    Body = @"
## Summary
Handle Stripe webhooks to keep `subscriptions` table and user Pro status in sync.

## Acceptance criteria
- [ ] Endpoint deployed (Cloudflare Worker or Supabase Edge Function)
- [ ] Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Updates `subscriptions.status` and `current_period_end`
- [ ] Idempotent processing (store processed event IDs)
- [ ] Webhook signature verification
- [ ] Tested with Stripe CLI locally

## Dependencies
- Stripe products configured
- `subscriptions` table + service role access

## Estimate
3 days
"@
  },
  @{
    Title = "[Billing] Pro feature gate (server + client)"
    Labels = @("phase-1", "billing", "frontend")
    Body = @"
## Summary
Centralize Pro entitlement checks so premium features cannot be bypassed client-side only.

## Acceptance criteria
- [ ] `isPro(user)` helper reads subscription status (active/trialing = Pro)
- [ ] Client hides/disabled Pro UI for free users with upgrade prompt
- [ ] Server/RLS or Edge Function rejects Pro-only writes for free users
- [ ] Feature matrix implemented:
  - Free: 1 saved plan, watermarked PDF, no weight history export
  - Pro: unlimited plans, no watermark, full weight/check-in history
- [ ] Grace period behavior defined for `past_due` status

## Dependencies
- Webhook subscription sync
- Plan persistence

## Estimate
2 days
"@
  },
  @{
    Title = "[Feature] Weight tracking UI with trend chart"
    Labels = @("phase-1", "frontend", "enhancement")
    Body = @"
## Summary
Allow Pro users to log weight and view a trend chart vs target weight line.

## Acceptance criteria
- [ ] Quick-add weight form (date + kg) in results/dashboard area
- [ ] SVG or Chart.js line chart: actual weight + target weight reference line
- [ ] List view of recent entries with delete
- [ ] Empty state for new users
- [ ] Mobile responsive
- [ ] i18n (zh/en)

## Dependencies
- Weight logs API
- Pro feature gate (can show teaser for free users)

## Estimate
3–4 days
"@
  },
  @{
    Title = "[Feature] Weekly training check-in UI"
    Labels = @("phase-1", "frontend", "enhancement")
    Body = @"
## Summary
Weekly calendar/checklist for users to mark training days complete and see streak stats.

## Acceptance criteria
- [ ] Week view aligned to user's plan training days (from generated schedule)
- [ ] Toggle complete/incomplete per day
- [ ] Display: completed count this week, current streak
- [ ] Data persisted via checkins API
- [ ] Reminder copy: "Mark today done" (no push notifications in Phase 1)

## Dependencies
- Checkins API
- Cloud plan sync (needs active plan reference)

## Estimate
3 days
"@
  },
  @{
    Title = "[Product] Pricing page — Free vs Pro comparison"
    Labels = @("phase-1", "frontend")
    Body = @"
## Summary
Public pricing page that converts free calculator users to Pro trials.

## Acceptance criteria
- [ ] Route: `/pricing` (or `#pricing` section with dedicated URL)
- [ ] Comparison table: Free vs Pro features (aligned with feature gate issue)
- [ ] Monthly / annual toggle with savings badge
- [ ] FAQ: trial, cancel anytime, refund policy link
- [ ] CTA wires to Stripe Checkout
- [ ] i18n (zh/en)

## Dependencies
- Stripe Checkout flow

## Estimate
2 days
"@
  },
  @{
    Title = "[Product] New user onboarding flow"
    Labels = @("phase-1", "frontend")
    Body = @"
## Summary
Guide new signups from account creation → first plan → optional Pro trial.

## Acceptance criteria
- [ ] Post-signup 3-step onboarding: profile basics → generate first plan → save to cloud
- [ ] `profiles.onboarding_completed` flag set when done
- [ ] Skip option available
- [ ] Post-checkout success path merges into onboarding
- [ ] Track completion rate (analytics event)

## Dependencies
- Auth UI
- Cloud plan sync

## Estimate
2–3 days
"@
  },
  @{
    Title = "[Product] Pro-only: plan history and watermark-free PDF export"
    Labels = @("phase-1", "frontend", "billing")
    Body = @"
## Summary
Deliver tangible Pro value through plan archive and clean PDF exports.

## Acceptance criteria
- [ ] Plan history page: list past plans with date + goal summary, tap to view
- [ ] Free users see latest plan only; older plans show upgrade lock
- [ ] PDF export adds Morphix watermark + "Upgrade to remove" for free users
- [ ] Pro PDF: no watermark, includes generation date and user goal
- [ ] Export still works offline for cached plan (graceful degradation)

## Dependencies
- Plan persistence
- Pro feature gate

## Estimate
2 days
"@
  },
  @{
    Title = "[Legal] Privacy Policy and Terms of Service pages"
    Labels = @("phase-1", "documentation")
    Body = @"
## Summary
Add legal pages required before accepting payments and storing health-related user data.

## Acceptance criteria
- [ ] `/privacy` and `/terms` routes with zh/en content
- [ ] Covers: data collected, Supabase/Stripe processors, retention, deletion request, health disclaimer
- [ ] Footer links on all pages
- [ ] Checkout and signup checkbox: "I agree to Terms and Privacy Policy"
- [ ] Account deletion flow documented (even if manual via email in Phase 1)

## Dependencies
None (can parallelize early)

## Estimate
1–2 days
"@
  },
  @{
    Title = "[Analytics] Conversion funnel tracking"
    Labels = @("phase-1", "infra", "enhancement")
    Body = @"
## Summary
Instrument key events to measure Phase 1 funnel: visit → plan → signup → trial → paid.

## Acceptance criteria
- [ ] Plausible or PostHog integrated (privacy-friendly, cookie-light)
- [ ] Events tracked:
  - `plan_generated`
  - `pdf_exported`
  - `signup_completed`
  - `checkout_started`
  - `subscription_active`
  - `weight_logged`
  - `checkin_completed`
- [ ] No PII in event payloads
- [ ] Dashboard or doc listing funnel definitions

## Dependencies
Can start early; subscription events need billing

## Estimate
1 day
"@
  },
  @{
    Title = "[Launch] Phase 1 E2E QA checklist and soft launch"
    Labels = @("phase-1", "documentation")
    Body = @"
## Summary
End-to-end verification before public Pro launch.

## Acceptance criteria
- [ ] QA checklist document in repo (`docs/phase1-qa.md`)
- [ ] Test paths covered:
  - Guest: generate plan, localStorage, watermarked PDF
  - Signup → onboarding → cloud save
  - Checkout (test card) → Pro unlock
  - Webhook cancel → Pro revoked
  - Weight log + checkin persist across reload
  - Mobile smoke test (iOS Safari + Android Chrome)
- [ ] Production Stripe switched from test mode
- [ ] Support email configured (e.g. support@morphix.app)
- [ ] Soft launch announcement draft (PH / 社群)

## Dependencies
All other Phase 1 issues

## Estimate
2–3 days
"@
  }
)

foreach ($issue in $issues) {
  Write-Host "Creating: $($issue.Title)"
  New-MorphixIssue -Title $issue.Title -Body $issue.Body -Labels $issue.Labels
  Start-Sleep -Milliseconds 500
}

Write-Host "Done."
