-- Pouch Club — initial schema
-- Run this in the Supabase SQL editor or via `supabase db push`.

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Brands
-- ─────────────────────────────────────────────
create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Flavors
-- ─────────────────────────────────────────────
create table if not exists flavors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  brand_id uuid references brands(id) on delete set null,
  flavor_id uuid references flavors(id) on delete set null,
  strength_mg int not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_quantity int not null default 0,
  is_on_sale boolean not null default false,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft')),
  image_urls text[] not null default '{}',
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_flavor on products(flavor_id);
create index if not exists idx_products_strength on products(strength_mg);
create index if not exists idx_products_on_sale on products(is_on_sale) where is_on_sale = true;
create index if not exists idx_products_featured on products(is_featured) where is_featured = true;
create index if not exists idx_products_best_seller on products(is_best_seller) where is_best_seller = true;
create index if not exists idx_products_new_arrival on products(is_new_arrival) where is_new_arrival = true;
create index if not exists idx_products_status on products(status);

-- ─────────────────────────────────────────────
-- Bundles
-- ─────────────────────────────────────────────
create table if not exists bundles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  bundle_price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists bundle_products (
  bundle_id uuid references bundles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (bundle_id, product_id)
);

-- ─────────────────────────────────────────────
-- Customers (synced with Supabase Auth)
-- ─────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Orders
-- ─────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_orders_status on orders(status);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null
);

-- ─────────────────────────────────────────────
-- Reviews
-- ─────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  product_id uuid references products(id) on delete set null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Site settings (key/value, editable from admin)
-- ─────────────────────────────────────────────
create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

insert into site_settings (key, value) values
  ('announcement_text', '"Free shipping on all orders over $100"'),
  ('free_shipping_threshold', '100'),
  ('hero_heading', '"Europe''s Finest. Delivered to You."'),
  ('hero_subheading', '"Your home for premium nicotine pouches from the world''s best brands."'),
  ('low_stock_threshold', '20'),
  ('contact_email', '"support@pouchclub.com"'),
  ('social_links', '{"instagram": "", "tiktok": ""}')
on conflict (key) do nothing;

create table if not exists hero_images (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  sort_order int not null default 0
);

-- ─────────────────────────────────────────────
-- Newsletter subscribers + contact messages
-- ─────────────────────────────────────────────
create table if not exists subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Strength ranges (admin-editable tiers)
-- ─────────────────────────────────────────────
create table if not exists strength_ranges (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  min_mg int not null,
  max_mg int not null,
  tile_image_url text,
  sort_order int not null default 0
);

insert into strength_ranges (label, min_mg, max_mg, sort_order) values
  ('3–6 mg', 3, 6, 1),
  ('8–11 mg', 8, 11, 2),
  ('12–15 mg', 12, 15, 3),
  ('15–20 mg', 15, 20, 4),
  ('20–30 mg', 20, 30, 5),
  ('30–50 mg', 30, 50, 6)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Admin audit log
-- ─────────────────────────────────────────────
create table if not exists admin_activity_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references customers(id) on delete set null,
  action text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table brands enable row level security;
alter table flavors enable row level security;
alter table products enable row level security;
alter table bundles enable row level security;
alter table bundle_products enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;
alter table hero_images enable row level security;
alter table strength_ranges enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscribers enable row level security;
alter table contact_messages enable row level security;
alter table admin_activity_log enable row level security;

-- Public can read catalog data
create policy "Public read brands" on brands for select using (true);
create policy "Public read flavors" on flavors for select using (true);
create policy "Public read active products" on products for select using (status = 'active');
create policy "Public read active bundles" on bundles for select using (is_active = true);
create policy "Public read bundle_products" on bundle_products for select using (true);
create policy "Public read featured reviews" on reviews for select using (is_featured = true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read hero_images" on hero_images for select using (true);
create policy "Public read strength_ranges" on strength_ranges for select using (true);

-- Anyone can submit a newsletter signup / contact message, nobody can read others' rows back
create policy "Anyone can subscribe" on subscribers for insert with check (true);
create policy "Anyone can send a contact message" on contact_messages for insert with check (true);

-- Customers can see only their own profile / orders
create policy "Customers read own profile" on customers for select using (auth.uid() = id);
create policy "Customers read own orders" on orders for select using (customer_id = auth.uid());
create policy "Customers read own order_items" on order_items
  for select using (order_id in (select id from orders where customer_id = auth.uid()));

-- Admins (is_admin = true on customers) get full read/write via service-role
-- in the admin app; no broad client-side write policies are granted here on
-- purpose — all admin writes should go through the server using the
-- Supabase service role key, never the anon key.
