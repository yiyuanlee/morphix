-- Morphix Phase 1 SaaS schema
-- Issue: https://github.com/yiyuanlee/morphix/issues/4
-- RLS policies are added in a follow-up migration (issue #6).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'zh' check (locale in ('zh', 'en')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'User profile metadata linked 1:1 with auth.users.';

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, locale)
  values (new.id, 'zh');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- plans — saved fitness plan snapshots
-- ---------------------------------------------------------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  actual_mode text not null check (actual_mode in ('lose', 'balance', 'gain')),
  input_snapshot jsonb not null,
  result_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.plans is 'Persisted Morphix plans per user.';
comment on column public.plans.input_snapshot is
'Form + preference payload. Shape documented in docs/database-schema.md and supabase/seed.sql.';
comment on column public.plans.result_snapshot is
'Computed metrics + summary metadata. Full HTML is not stored; regenerate from input when needed.';

create index plans_user_id_created_at_idx
  on public.plans (user_id, created_at desc);

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- weight_logs
-- ---------------------------------------------------------------------------
create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric(5, 1) not null check (weight_kg >= 30 and weight_kg <= 300),
  logged_at date not null default (timezone('utc', now()))::date,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.weight_logs is 'Daily weight entries for progress tracking.';

create index weight_logs_user_id_logged_at_idx
  on public.weight_logs (user_id, logged_at desc);

create unique index weight_logs_user_id_logged_at_unique_idx
  on public.weight_logs (user_id, logged_at);

-- ---------------------------------------------------------------------------
-- checkins — training day completion
-- ---------------------------------------------------------------------------
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid references public.plans (id) on delete set null,
  checkin_date date not null,
  completed boolean not null default true,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.checkins is 'Training completion marks keyed by calendar date.';

create index checkins_user_id_checkin_date_idx
  on public.checkins (user_id, checkin_date desc);

create unique index checkins_user_id_checkin_date_unique_idx
  on public.checkins (user_id, checkin_date);

create trigger checkins_set_updated_at
before update on public.checkins
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- subscriptions — Stripe mirror (service-role writes only in app code)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null check (
    status in (
      'trialing',
      'active',
      'past_due',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'unpaid',
      'paused'
    )
  ),
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.subscriptions is
'Stripe subscription mirror. Written by webhook handler using service role (issue #12).';

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_stripe_subscription_id_idx on public.subscriptions (stripe_subscription_id);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Enable RLS (policies added in issue #6)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.weight_logs enable row level security;
alter table public.checkins enable row level security;
alter table public.subscriptions enable row level security;
