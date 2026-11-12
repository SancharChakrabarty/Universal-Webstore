-- ─────────────────────────────────────────────────────────────────────────────
-- 0006: Pack size prices · per-strength images · discount codes
-- Run after 0005_customers_update_policy.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Replace the old 5-pack/20-pack system with explicit per-pack prices ──
-- price_1pack  = total price for 1 can   (same as the existing `price` column)
-- price_3pack  = total price for 3 cans  (null → price * 3, no discount)
-- price_5pack  = total price for 5 cans  (null → price * 5)
-- price_10pack = total price for 10 cans (null → price * 10)
-- The old price_20pack / pack20_discount_percent columns are kept so no data
-- is lost, but the storefront no longer reads them.

alter table products
  add column if not exists price_3pack  numeric(10,2),
  add column if not exists price_5pack  numeric(10,2),
  add column if not exists price_10pack numeric(10,2);

-- ── 2. Per-strength product images ──────────────────────────────────────────
-- Stored as JSONB: { "6": "https://…", "12": "https://…" }
-- Key is the strength in mg (as a text string), value is the image URL.
-- Empty object = no per-strength images → fall back to the product's
-- first image_urls entry.

alter table products
  add column if not exists strength_images jsonb not null default '{}';

-- ── 3. Discount / promo codes ───────────────────────────────────────────────

create table if not exists discount_codes (
  id            uuid primary key default uuid_generate_v4(),
  code          text not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null,
  expires_at    timestamptz,
  usage_limit   int,
  usage_count   int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint discount_codes_code_unique unique (code)
);

-- Seed the WELCOME10 code the signup flow will hand out automatically.
insert into discount_codes (code, discount_type, discount_value, is_active)
values ('WELCOME10', 'percent', 10, true)
on conflict (code) do nothing;

-- RLS: customers can only SELECT (to validate a code at checkout);
-- all writes go through the service-role (admin panel + trigger).

alter table discount_codes enable row level security;

drop policy if exists "discount_codes_select_active" on discount_codes;
create policy "discount_codes_select_active" on discount_codes
  for select using (is_active = true);

grant select on discount_codes to anon, authenticated;
grant all    on discount_codes to service_role;
