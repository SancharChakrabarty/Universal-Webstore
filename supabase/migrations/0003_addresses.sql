-- Customer-saved addresses. Billing and shipping are stored as separate
-- rows (type = 'billing' | 'shipping') rather than a single combined
-- address per customer, per product requirement.
-- Run after 0001_init.sql / 0002_product_variants.sql.

create table if not exists addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  type text not null check (type in ('billing', 'shipping')),
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'US',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_addresses_customer_id on addresses(customer_id);

alter table addresses enable row level security;

-- Customers can only ever see/manage their own addresses.
drop policy if exists "addresses_select_own" on addresses;
create policy "addresses_select_own" on addresses
  for select using (auth.uid() = customer_id);

drop policy if exists "addresses_insert_own" on addresses;
create policy "addresses_insert_own" on addresses
  for insert with check (auth.uid() = customer_id);

drop policy if exists "addresses_update_own" on addresses;
create policy "addresses_update_own" on addresses
  for update using (auth.uid() = customer_id);

drop policy if exists "addresses_delete_own" on addresses;
create policy "addresses_delete_own" on addresses
  for delete using (auth.uid() = customer_id);
