# Phase 1 SaaS MVP — Issue Backlog

Milestone: [Phase 1: SaaS MVP](https://github.com/yiyuanlee/morphix/milestone/1) (target: 2026-07-31)

## Recommended execution order

### Week 1–2 · Foundation
| Order | Issue | Title |
|------:|-------|-------|
| 1 | [#19](https://github.com/yiyuanlee/morphix/issues/19) | Initialize Supabase project and environment configuration |
| 2 | [#4](https://github.com/yiyuanlee/morphix/issues/4) | Design Phase 1 database schema and migrations |
| 3 | [#5](https://github.com/yiyuanlee/morphix/issues/5) | Configure Supabase Auth (email + Google OAuth) |
| 4 | [#6](https://github.com/yiyuanlee/morphix/issues/6) | Implement Row Level Security (RLS) policies |
| 5 | [#23](https://github.com/yiyuanlee/morphix/issues/23) | Privacy Policy and Terms of Service pages *(parallel)* |
| 6 | [#17](https://github.com/yiyuanlee/morphix/issues/17) | Conversion funnel tracking *(parallel)* |

### Week 3–4 · Data layer + Auth UI
| Order | Issue | Title |
|------:|-------|-------|
| 7 | [#7](https://github.com/yiyuanlee/morphix/issues/7) | Plan persistence — save, load, and list user plans |
| 8 | [#8](https://github.com/yiyuanlee/morphix/issues/8) | Weight logs and training check-ins persistence |
| 9 | [#9](https://github.com/yiyuanlee/morphix/issues/9) | Authentication UI and session management |
| 10 | [#20](https://github.com/yiyuanlee/morphix/issues/20) | Cloud plan sync with localStorage fallback |

### Week 5–6 · Billing
| Order | Issue | Title |
|------:|-------|-------|
| 11 | [#10](https://github.com/yiyuanlee/morphix/issues/10) | Configure Stripe products, prices, and 7-day trial |
| 12 | [#11](https://github.com/yiyuanlee/morphix/issues/11) | Stripe Checkout session flow |
| 13 | [#12](https://github.com/yiyuanlee/morphix/issues/12) | Stripe webhook handler and subscription sync |
| 14 | [#13](https://github.com/yiyuanlee/morphix/issues/13) | Pro feature gate (server + client) |
| 15 | [#15](https://github.com/yiyuanlee/morphix/issues/15) | Pricing page — Free vs Pro comparison |

### Week 7–8 · Retention features + Launch
| Order | Issue | Title |
|------:|-------|-------|
| 16 | [#14](https://github.com/yiyuanlee/morphix/issues/14) | Weight tracking UI with trend chart |
| 17 | [#21](https://github.com/yiyuanlee/morphix/issues/21) | Weekly training check-in UI |
| 18 | [#22](https://github.com/yiyuanlee/morphix/issues/22) | Pro-only: plan history and watermark-free PDF export |
| 19 | [#16](https://github.com/yiyuanlee/morphix/issues/16) | New user onboarding flow |
| 20 | [#18](https://github.com/yiyuanlee/morphix/issues/18) | Phase 1 E2E QA checklist and soft launch |

## Dependency graph (simplified)

```
#19 Supabase init
  └─ #4 Schema
       ├─ #5 Auth
       │    └─ #9 Auth UI
       │         └─ #20 Cloud sync
       ├─ #6 RLS
       │    ├─ #7 Plans API
       │    └─ #8 Weight/Checkin API
       └─ #10 Stripe config
            ├─ #11 Checkout
            └─ #12 Webhook
                 └─ #13 Pro gate
                      ├─ #14 Weight UI
                      ├─ #21 Check-in UI
                      ├─ #22 PDF/History
                      └─ #15 Pricing page
                           └─ #16 Onboarding
                                └─ #18 Launch QA
```

## Labels

- `phase-1` — all Phase 1 issues
- `infra` / `auth` / `billing` / `frontend` — work stream

## Recreate issues

Issue bodies live in `.github/issues/`. Use `--body-file` with `gh issue create` (see `.github/scripts/create-phase1-issues.ps1`).
