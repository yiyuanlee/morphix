-- Stripe webhook idempotency ledger for Morphix Pro billing.
-- Issue: https://github.com/yiyuanlee/morphix/issues/12

create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  stripe_created_at timestamptz,
  payload jsonb not null,
  processing_status text not null default 'processing' check (
    processing_status in ('processing', 'processed', 'failed')
  ),
  processing_error text,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.stripe_webhook_events is
'Stripe webhook idempotency ledger. Written only by the Cloudflare Worker service role handler.';

create index stripe_webhook_events_event_type_created_at_idx
  on public.stripe_webhook_events (event_type, created_at desc);

alter table public.stripe_webhook_events enable row level security;
