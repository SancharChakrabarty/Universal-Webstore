-- Adds admin-controlled product variant fields:
-- per-product available strengths, available flavors (denormalized text,
-- separate from the canonical `flavors` table used for catalog grouping),
-- and 5-pack/20-pack pricing.
-- Run after 0001_init.sql.

alter table products
  add column if not exists available_strengths integer[] not null default '{}',
  add column if not exists available_flavors text[] not null default '{}',
  add column if not exists price_20pack numeric(10,2),
  add column if not exists pack20_discount_percent numeric(5,2) not null default 12;

-- Backfill existing rows so available_strengths always at least contains
-- the product's own strength_mg (keeps the storefront selector from ever
-- rendering empty for pre-existing data).
update products
set available_strengths = array[strength_mg]
where available_strengths = '{}';
