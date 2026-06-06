# Morphix Phase 1 Database Schema

Migration: `supabase/migrations/20260606103000_phase1_schema.sql`  
Issue: [#4](https://github.com/yiyuanlee/morphix/issues/4)

## Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User metadata (1:1 with `auth.users`) |
| `plans` | Saved fitness plan input + computed summary |
| `weight_logs` | Body weight history |
| `checkins` | Training day completion |
| `subscriptions` | Stripe subscription mirror |

RLS is **enabled** on all tables; policies are defined in issue [#6](https://github.com/yiyuanlee/morphix/issues/6).

## Entity relationships

```
auth.users
  ├── profiles (1:1)
  ├── plans (1:n)
  ├── weight_logs (1:n)
  ├── checkins (1:n)
  └── subscriptions (1:1)
plans ──< checkins (optional plan_id)
```

## `plans.input_snapshot` (jsonb)

Matches the Morphix client form state (`app.js` → `saveToLocalStorage`).

| Field | Type | Example |
|-------|------|---------|
| `height` | number | `175` (cm) |
| `age` | number | `25` |
| `currentWeight` | number | `75` (kg) |
| `targetWeight` | number | `70` (kg) |
| `gender` | string | `"male"` \| `"female"` |
| `dailyTime` | number | `45` (minutes) |
| `frequency` | number | `3`–`7` (days/week) |
| `goal` | string | `"lose"` \| `"balance"` \| `"gain"` |
| `intensity` | string | `"mild"` \| `"balanced"` \| `"aggressive"` |
| `level` | string | `"beginner"` \| `"intermediate"` \| `"advanced"` |
| `lang` | string | `"zh"` \| `"en"` |

## `plans.result_snapshot` (jsonb)

Computed metrics returned by the plan engine. Store structured data only; re-render UI/PDF from snapshots in the client when possible.

| Field | Type | Notes |
|-------|------|-------|
| `bmi` | number | Current BMI |
| `bmiCategory` | string | `underweight` \| `normal` \| `overweight` \| `obese` |
| `bmr` | number | kcal/day |
| `tdee` | number | kcal/day |
| `targetCalories` | number | kcal/day |
| `proteinG` | number | grams/day |
| `carbG` | number | grams/day |
| `fatG` | number | grams/day |
| `calBurned` | number | kcal per session |
| `weeks` | number | Estimated weeks to goal |
| `actualMode` | string | Effective mode after weight-direction logic |
| `goalLabel` | string | Localized label |
| `levelLabel` | string | Localized label |
| `generatedAt` | string | ISO-8601 timestamp |

## Apply migrations

### Local (Supabase CLI)

```bash
# Requires issue #19: supabase init + supabase start
supabase db reset    # applies migrations + seed.sql
# or
supabase migration up
```

### Remote (linked project)

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Indexes

| Table | Index | Use case |
|-------|-------|----------|
| `plans` | `(user_id, created_at desc)` | Plan history |
| `weight_logs` | `(user_id, logged_at desc)` | Trend chart |
| `weight_logs` | unique `(user_id, logged_at)` | One entry per day |
| `checkins` | `(user_id, checkin_date desc)` | Weekly view |
| `checkins` | unique `(user_id, checkin_date)` | Upsert by date |
| `subscriptions` | `(user_id)`, `(stripe_subscription_id)` | Billing lookups |
