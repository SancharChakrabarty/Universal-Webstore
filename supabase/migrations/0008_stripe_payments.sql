-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0008: Stripe payment support
-- Run in Supabase SQL Editor after 0007_seed_all_data.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add stripe_payment_intent_id column to orders (idempotent)
alter table orders
  add column if not exists stripe_payment_intent_id text;

-- 2. Unique index so we never double-record a payment intent
create unique index if not exists idx_orders_stripe_pi
  on orders(stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

-- 3. Service role must be able to insert orders (webhook handler uses service role)
--    RLS is enabled on orders, so we need an explicit policy.
--    Drop first to avoid "already exists" errors on re-runs.
drop policy if exists "Service role insert orders" on orders;
create policy "Service role insert orders" on orders
  for insert
  with check (true);  -- service role bypasses RLS entirely; this is belt-and-suspenders

-- 4. Also allow service role to insert order_items
drop policy if exists "Service role insert order_items" on order_items;
create policy "Service role insert order_items" on order_items
  for insert
  with check (true);

-- 5. Grant insert to authenticated role as well (for logged-in users)
grant insert on orders to authenticated;
grant insert on order_items to authenticated;
grant insert on orders to service_role;
grant insert on order_items to service_role;
