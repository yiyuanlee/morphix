-- Morphix Phase 1 RLS policies
-- Issue: https://github.com/yiyuanlee/morphix/issues/6
-- Depends on: 20260606103000_phase1_schema.sql

-- ---------------------------------------------------------------------------
-- profiles (PK id = auth.users.id)
-- ---------------------------------------------------------------------------
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Inserts happen via handle_new_user() trigger (security definer).
-- Deletes cascade from auth.users.

-- ---------------------------------------------------------------------------
-- plans
-- ---------------------------------------------------------------------------
create policy "plans_select_own"
on public.plans
for select
to authenticated
using (auth.uid() = user_id);

create policy "plans_insert_own"
on public.plans
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "plans_update_own"
on public.plans
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "plans_delete_own"
on public.plans
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- weight_logs
-- ---------------------------------------------------------------------------
create policy "weight_logs_select_own"
on public.weight_logs
for select
to authenticated
using (auth.uid() = user_id);

create policy "weight_logs_insert_own"
on public.weight_logs
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "weight_logs_update_own"
on public.weight_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "weight_logs_delete_own"
on public.weight_logs
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- checkins
-- ---------------------------------------------------------------------------
create policy "checkins_select_own"
on public.checkins
for select
to authenticated
using (auth.uid() = user_id);

create policy "checkins_insert_own"
on public.checkins
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (
    plan_id is null
    or exists (
      select 1
      from public.plans p
      where p.id = plan_id
        and p.user_id = auth.uid()
    )
  )
);

create policy "checkins_update_own"
on public.checkins
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    plan_id is null
    or exists (
      select 1
      from public.plans p
      where p.id = plan_id
        and p.user_id = auth.uid()
    )
  )
);

create policy "checkins_delete_own"
on public.checkins
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- subscriptions — read-only for clients; writes via service role (webhook)
-- service_role bypasses RLS in Supabase; no INSERT/UPDATE/DELETE policies here.
-- ---------------------------------------------------------------------------
create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Manual verification (run in Supabase SQL editor as each test user JWT)
-- See docs/database-schema.md § RLS testing
-- ---------------------------------------------------------------------------
-- 1. Sign in as User A → SELECT * FROM plans; should return only A rows.
-- 2. Sign in as User A → INSERT INTO plans (...) VALUES (..., user_b_id, ...);
--    should fail RLS WITH CHECK.
-- 3. service_role client (server) → upsert subscriptions; should succeed.
-- 4. authenticated client → INSERT INTO subscriptions (...); should fail (no policy).
