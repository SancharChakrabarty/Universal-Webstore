-- ─────────────────────────────────────────────────────────────────────────────
-- 0007: Seed all brands, flavors, products, bundles, and fix storefront data flow
-- Run AFTER 0006. Safe to re-run (uses ON CONFLICT DO UPDATE / DO NOTHING).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Add missing columns to products if not already there ────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS available_strengths  int[]    NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_flavors    text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status               text     NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS price_3pack          numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_5pack          numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_10pack         numeric(10,2),
  ADD COLUMN IF NOT EXISTS strength_images      jsonb    NOT NULL DEFAULT '{}';

-- ── 1. BRANDS ────────────────────────────────────────────────────────────────
INSERT INTO brands (id, name, slug, logo_url, description) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'ALP',            'alp',          '/images/logos/alp.png',          'Bold Scandinavian fruit blends at full strength.'),
  ('b1000000-0000-0000-0000-000000000002', 'Copenhagen',     'copenhagen',   '/images/logos/copenhagen.png',   'A heritage tobacco-house name, reimagined tobacco-free.'),
  ('b1000000-0000-0000-0000-000000000003', 'Cuba',           'cuba',         '/images/logos/cuba.png',         'Rich, warm flavor profiles inspired by the Caribbean.'),
  ('b1000000-0000-0000-0000-000000000004', 'Ice Berg',       'ice-berg',     '/images/logos/iceberg.png',      'Sub-zero mint and menthol, built for an icy finish.'),
  ('b1000000-0000-0000-0000-000000000005', 'Killa',          'killa',        '/images/logos/killa.png',        'Extra strong nicopods for experienced users.'),
  ('b1000000-0000-0000-0000-000000000006', 'Lucy & Breakers','lucy-breakers','/images/logos/lucy-breakers.png','Easygoing, all-day flavors at a moderate strength.'),
  ('b1000000-0000-0000-0000-000000000007', 'Pablo',          'pablo',        '/images/logos/pablo.png',        'High-intensity, cult-favorite flavor drops.'),
  ('b1000000-0000-0000-0000-000000000008', 'Velo',           'velo',         '/images/logos/velo.png',         'Clean, modern pouches from one of Europe''s biggest names.'),
  ('b1000000-0000-0000-0000-000000000009', 'Zyn European',   'zyn-european', '/images/logos/zyn-european.png', 'The European Zyn lineup — wider flavors, higher strengths.'),
  ('b1000000-0000-0000-0000-000000000010', 'Zyn US',         'zyn-us',       '/images/logos/zyn-us.png',       'The original Zyn lineup, imported and ready to ship.')
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  logo_url    = EXCLUDED.logo_url,
  description = EXCLUDED.description;

-- ── 2. FLAVORS ───────────────────────────────────────────────────────────────
INSERT INTO flavors (id, name, slug) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Blueberry Lemonade',   'blueberry-lemonade'),
  ('f1000000-0000-0000-0000-000000000002', 'Island Peach',         'island-peach'),
  ('f1000000-0000-0000-0000-000000000003', 'Lemon Raspberry',      'lemon-raspberry'),
  ('f1000000-0000-0000-0000-000000000004', 'Mango Freeze',         'mango-freeze'),
  ('f1000000-0000-0000-0000-000000000005', 'Watermelon Kiwi',      'watermelon-kiwi'),
  ('f1000000-0000-0000-0000-000000000006', 'Apple Mint',           'apple-mint'),
  ('f1000000-0000-0000-0000-000000000007', 'Banana Milkshake',     'banana-milkshake'),
  ('f1000000-0000-0000-0000-000000000008', 'Blackcurrant Ice',     'blackcurrant-ice'),
  ('f1000000-0000-0000-0000-000000000009', 'Cola Ice',             'cola-ice'),
  ('f1000000-0000-0000-0000-000000000010', 'Cool Blueberry',       'cool-blueberry'),
  ('f1000000-0000-0000-0000-000000000011', 'Mango Mini',           'mango-mini'),
  ('f1000000-0000-0000-0000-000000000012', 'Red Fruit Fizz',       'red-fruit-fizz'),
  ('f1000000-0000-0000-0000-000000000013', 'Watermelon Medium',    'watermelon-medium'),
  ('f1000000-0000-0000-0000-000000000014', 'Cool Mint',            'cool-mint'),
  ('f1000000-0000-0000-0000-000000000015', 'Citrus',               'citrus'),
  ('f1000000-0000-0000-0000-000000000016', 'Coffee',               'coffee'),
  ('f1000000-0000-0000-0000-000000000017', 'Espresso',             'espresso'),
  ('f1000000-0000-0000-0000-000000000018', 'Mojito',               'mojito'),
  ('f1000000-0000-0000-0000-000000000019', 'Peppermint',           'peppermint'),
  ('f1000000-0000-0000-0000-000000000020', 'Wintergreen',          'wintergreen'),
  ('f1000000-0000-0000-0000-000000000021', 'Cinnamon',             'cinnamon'),
  ('f1000000-0000-0000-0000-000000000022', 'Original',             'original'),
  ('f1000000-0000-0000-0000-000000000023', 'Apple Cider',          'apple-cider'),
  ('f1000000-0000-0000-0000-000000000024', 'Apple Ice',            'apple-ice'),
  ('f1000000-0000-0000-0000-000000000025', 'Mint',                 'mint'),
  ('f1000000-0000-0000-0000-000000000026', 'Very Citrus',          'very-citrus'),
  ('f1000000-0000-0000-0000-000000000027', 'Mango',                'mango'),
  ('f1000000-0000-0000-0000-000000000028', 'Grape Ice',            'grape-ice'),
  ('f1000000-0000-0000-0000-000000000029', 'Frosted Mint',         'frosted-mint'),
  ('f1000000-0000-0000-0000-000000000030', 'Strawberry Watermelon','strawberry-watermelon'),
  ('f1000000-0000-0000-0000-000000000031', 'Spearmint',            'spearmint'),
  ('f1000000-0000-0000-0000-000000000032', 'Menthol',              'menthol'),
  ('f1000000-0000-0000-0000-000000000033', 'Tropical Burst',       'tropical-burst'),
  ('f1000000-0000-0000-0000-000000000034', 'Black Cherry',         'black-cherry'),
  ('f1000000-0000-0000-0000-000000000035', 'Vanilla Tobacco',      'vanilla-tobacco'),
  ('f1000000-0000-0000-0000-000000000036', 'Apple Juice',          'apple-juice'),
  ('f1000000-0000-0000-0000-000000000037', 'Pineapple',            'pineapple'),
  ('f1000000-0000-0000-0000-000000000038', 'Watermelon',           'watermelon'),
  ('f1000000-0000-0000-0000-000000000039', 'Cola',                 'cola'),
  ('f1000000-0000-0000-0000-000000000040', 'Ice Berries',          'ice-berries'),
  ('f1000000-0000-0000-0000-000000000041', 'Purple Grape',         'purple-grape'),
  ('f1000000-0000-0000-0000-000000000042', 'Strawberry Ice',       'strawberry-ice'),
  ('f1000000-0000-0000-0000-000000000043', 'Tropical Mango',       'tropical-mango'),
  ('f1000000-0000-0000-0000-000000000044', 'Watermelon Ice',       'watermelon-ice'),
  ('f1000000-0000-0000-0000-000000000045', 'Hot Peach',            'hot-peach'),
  ('f1000000-0000-0000-0000-000000000046', 'Hot Grape',            'hot-grape'),
  ('f1000000-0000-0000-0000-000000000047', 'Dragon Fruit',         'dragon-fruit'),
  ('f1000000-0000-0000-0000-000000000048', 'Lime Flame',           'lime-flame'),
  ('f1000000-0000-0000-0000-000000000049', 'Peppermint Freeze',    'peppermint-freeze'),
  ('f1000000-0000-0000-0000-000000000050', 'Wintery Watermelon',   'wintery-watermelon'),
  ('f1000000-0000-0000-0000-000000000051', 'Strawberry Kiwi',      'strawberry-kiwi'),
  ('f1000000-0000-0000-0000-000000000052', 'Watermelon Gum Mint',  'watermelon-gum-mint')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- ── 3. PRODUCTS ──────────────────────────────────────────────────────────────
-- ALP Products
INSERT INTO products (id, name, slug, brand_id, flavor_id, strength_mg, price, compare_at_price, stock_quantity, is_on_sale, is_featured, is_best_seller, is_new_arrival, status, image_urls, description, available_strengths, available_flavors, strength_images, price_3pack, price_5pack, price_10pack) VALUES

('p1000000-0000-0000-0000-000000000001',
 'ALP Blueberry Lemonade','alp-blueberry-lemonade',
 'b1000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001',
 12, 6.99, NULL, 140, false, true, false, false, 'active',
 ARRAY['/images/brands/alp/alp-blueberry-lemonade-12-mg.jpg'],
 'A tart, sun-bright blueberry lemonade pouch at full Scandinavian strength.',
 ARRAY[12], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000002',
 'ALP Island Peach','alp-island-peach',
 'b1000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000002',
 12, 6.99, NULL, 95, false, false, false, false, 'active',
 ARRAY['/images/brands/alp/alp-island-peach-12-mg.jpg'],
 'Ripe peach, smoothed out with a cool finish.',
 ARRAY[12], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000003',
 'ALP Lemon Raspberry','alp-lemon-raspberry',
 'b1000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000003',
 12, 5.99, 6.99, 60, true, false, false, false, 'active',
 ARRAY['/images/brands/alp/alp-lemon-rasperry-12-mg.jpg'],
 'Sharp raspberry over a citrus base.',
 ARRAY[12], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000004',
 'ALP Mango Freeze','alp-mango-freeze',
 'b1000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000004',
 12, 6.99, NULL, 210, false, false, true, false, 'active',
 ARRAY['/images/brands/alp/alp-mango-freeze.jpg'],
 'Tropical mango with a frosty mint trail.',
 ARRAY[6,12,16],
 ARRAY['Mango Freeze','Mango Ice','Mango Burst'],
 '{"6":"/images/brands/alp/alp-mango-freeze.jpg","12":"/images/brands/alp/alp-mango-freeze.jpg","16":"/images/brands/alp/alp-mango-freeze.jpg"}',
 19.49, 29.99, 54.99),

('p1000000-0000-0000-0000-000000000005',
 'ALP Watermelon Kiwi','alp-watermelon-kiwi',
 'b1000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000005',
 12, 6.99, NULL, 130, false, false, false, true, 'active',
 ARRAY['/images/brands/alp/alp-watermelon-kiwi-12-mg.jpg'],
 'Juicy watermelon and kiwi, picked for summer.',
 ARRAY[12], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Zyn European
('p1000000-0000-0000-0000-000000000006',
 'Zyn Apple Mint','zyn-eu-apple-mint',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000006',
 3, 5.49, NULL, 180, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-apple-mint-3-mg.jpg'],
 'A light, crisp apple-mint pairing for an everyday low-strength pouch.',
 ARRAY[3], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000007',
 'Zyn Banana Milkshake','zyn-eu-banana-milkshake',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000007',
 11, 5.99, NULL, 90, false, true, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-banna-milkshake-11-mg.jpg'],
 'Creamy banana, an only-in-Europe flavor exclusive.',
 ARRAY[11], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000008',
 'Zyn Blackcurrant Ice','zyn-eu-blackcurrant-ice',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000008',
 11, 5.99, NULL, 220, false, false, true, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-blackcurrant-ice-11-mg.jpg'],
 'Deep blackcurrant cut with a sharp menthol chill.',
 ARRAY[6,9,11],
 ARRAY['Blackcurrant Ice','Blackcurrant','Blackcurrant Mint'],
 '{"6":"/images/brands/zyn-european/zyn-blackcurrant-ice-11-mg.jpg","9":"/images/brands/zyn-european/zyn-blackcurrant-ice-11-mg.jpg","11":"/images/brands/zyn-european/zyn-blackcurrant-ice-11-mg.jpg"}',
 NULL, 27.49, 51.99),

('p1000000-0000-0000-0000-000000000009',
 'Zyn Cola Ice','zyn-eu-cola-ice',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000009',
 11, 5.49, 5.99, 75, true, false, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-cola-ice-11-mg.jpg'],
 'Classic cola, iced down.',
 ARRAY[11], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000010',
 'Zyn Cool Blueberry','zyn-eu-cool-blueberry',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000010',
 11, 5.99, NULL, 110, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-cool-blueberry-11mg.jpg'],
 'Sweet blueberry with a cooling menthol edge.',
 ARRAY[11], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000011',
 'Zyn Mango Mini','zyn-eu-mango-mini',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000011',
 6, 5.49, NULL, 160, false, false, false, true, 'active',
 ARRAY['/images/brands/zyn-european/zyn-mango-mini-6-mg.jpg'],
 'A slim-format mango pouch at a moderate strength.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000012',
 'Zyn Red Fruit Fizz','zyn-eu-red-fruit-fizz',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000012',
 11, 5.99, NULL, 88, false, true, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-red-fruit-fizz-11-mg.jpg'],
 'A fizzy mixed-berry blend, full strength.',
 ARRAY[11], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000013',
 'Zyn Watermelon Medium','zyn-eu-watermelon-medium',
 'b1000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000013',
 6, 5.49, NULL, 132, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-european/zyn-watermleon-medium-6-mg.jpg'],
 'Easygoing watermelon at a medium strength.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Zyn US
('p1000000-0000-0000-0000-000000000014',
 'Zyn Cool Mint','zyn-us-cool-mint',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000014',
 6, 4.99, NULL, 300, false, false, true, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-6-mg-cool-mint-us.jpg'],
 'The original. Clean mint, classic strength.',
 ARRAY[3,6],
 ARRAY[]::text[],
 '{"3":"/images/brands/zyn-us/zyn-mojito-3-mg.jpg","6":"/images/brands/zyn-us/zyn-6-mg-cool-mint-us.jpg"}',
 13.99, 21.99, 41.99),

('p1000000-0000-0000-0000-000000000015',
 'Zyn Citrus','zyn-us-citrus',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000015',
 6, 4.99, NULL, 140, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-citrus-6-mg.jpg'],
 'Bright citrus, true to the original US lineup.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000016',
 'Zyn Coffee','zyn-us-coffee',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000016',
 6, 4.99, NULL, 70, false, true, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-coffe-6-mg.jpg'],
 'Roasted coffee notes for the morning routine.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000017',
 'Zyn Espresso','zyn-us-espresso',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000017',
 6, 4.99, NULL, 65, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-espresso-6-mg.jpg'],
 'A darker, more concentrated coffee profile.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000018',
 'Zyn Mojito','zyn-us-mojito',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000018',
 3, 3.99, 4.49, 50, true, false, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-mojito-3-mg.jpg'],
 'Mint and lime, low strength for an all-day pouch.',
 ARRAY[3], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000019',
 'Zyn Peppermint','zyn-us-peppermint',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000019',
 6, 4.99, NULL, 175, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-peppermint-6-mg.jpg'],
 'Sharper and sweeter than cool mint.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000020',
 'Zyn Wintergreen','zyn-us-wintergreen',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000020',
 6, 4.99, NULL, 120, false, false, false, true, 'active',
 ARRAY['/images/brands/zyn-us/zyn-wintergreen-6-mg.jpg'],
 'A deeper, herbal wintergreen.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000021',
 'Zyn Cinnamon','zyn-us-cinnamon',
 'b1000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000021',
 6, 4.99, NULL, 58, false, false, false, false, 'active',
 ARRAY['/images/brands/zyn-us/zyn-cinamon-6-mg.jpg'],
 'Warm cinnamon spice, US-formula strength.',
 ARRAY[6], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Lucy & Breakers
('p1000000-0000-0000-0000-000000000022',
 'Breakers Original','breakers-original',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000022',
 8, 5.49, NULL, 140, false, false, false, false, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-8-mg.jpg'],
 'A balanced, all-purpose tobacco-free pouch.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000023',
 'Breakers Apple Cider','breakers-apple-cider',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000023',
 8, 5.49, NULL, 80, false, false, false, true, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-8-mg-apple-cidar.jpg'],
 'Warm spiced apple cider, moderate strength.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000024',
 'Breakers Apple Ice','breakers-apple-ice',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000024',
 8, 5.49, NULL, 92, false, false, false, false, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-8-mg-apple-ice.jpg'],
 'Crisp apple with a cool finish.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000025',
 'Breakers Mint','breakers-mint',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000025',
 8, 5.49, NULL, 200, false, false, true, false, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-8-mg-mint.jpg'],
 'Smooth, everyday mint at a moderate strength.',
 ARRAY[8],
 ARRAY['Mint','Spearmint','Wintergreen'],
 '{}', NULL, 24.99, 46.99),

('p1000000-0000-0000-0000-000000000026',
 'Breakers Very Citrus','breakers-very-citrus',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000026',
 8, 4.99, 5.49, 64, true, false, false, false, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-8-mg-verry-citrus.jpg'],
 'A bright citrus mix, sharper than the original.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000027',
 'Breakers Mango','breakers-mango',
 'b1000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000027',
 8, 5.49, NULL, 110, false, true, false, false, 'active',
 ARRAY['/images/brands/lucy-breakers/breakers-mango-8-mg.jpg'],
 'Ripe mango, smoothed for daily wear.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Killa
('p1000000-0000-0000-0000-000000000028',
 'Killa Grape Ice','killa-grape-ice',
 'b1000000-0000-0000-0000-000000000005','f1000000-0000-0000-0000-000000000028',
 16, 6.49, NULL, 70, false, true, false, false, 'active',
 ARRAY['/images/brands/killa/chatgpt-image-jun-20-2026-08-14-26-pm.jpg'],
 'Extra-strong grape, iced down hard.',
 ARRAY[16,22],
 ARRAY[]::text[],
 '{"16":"/images/brands/killa/chatgpt-image-jun-20-2026-08-14-26-pm.jpg","22":"/images/brands/killa/chatgpt-image-jun-20-2026-08-22-03-pm.jpg"}',
 17.99, 27.99, 51.99),

('p1000000-0000-0000-0000-000000000029',
 'Killa Frosted Mint','killa-frosted-mint',
 'b1000000-0000-0000-0000-000000000005','f1000000-0000-0000-0000-000000000029',
 16, 6.49, NULL, 55, false, false, true, false, 'active',
 ARRAY['/images/brands/killa/chatgpt-image-jun-20-2026-08-22-03-pm.jpg'],
 'Ice-cold mint at extra strength.',
 ARRAY[16,22],
 ARRAY[]::text[],
 '{"16":"/images/brands/killa/chatgpt-image-jun-20-2026-08-22-03-pm.jpg","22":"/images/brands/killa/chatgpt-image-jun-20-2026-08-29-38-pm-1.jpg"}',
 NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000030',
 'Killa Strawberry Watermelon','killa-strawberry-watermelon',
 'b1000000-0000-0000-0000-000000000005','f1000000-0000-0000-0000-000000000030',
 16, 5.99, 6.49, 40, true, false, false, true, 'active',
 ARRAY['/images/brands/killa/chatgpt-image-jun-20-2026-08-41-20-pm.jpg'],
 'Strawberry and watermelon, exclusive extra-strong blend.',
 ARRAY[16], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Cuba
('p1000000-0000-0000-0000-000000000031',
 'Cuba Apple Juice','cuba-apple-juice',
 'b1000000-0000-0000-0000-000000000003','f1000000-0000-0000-0000-000000000036',
 43, 5.99, NULL, 60, false, false, false, true, 'active',
 ARRAY['/images/brands/cuba/cuba-apple-juice-43-mg.jpg'],
 'Crisp apple juice flavor at extreme strength — for the bold.',
 ARRAY[43], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000032',
 'Cuba Cola','cuba-cola',
 'b1000000-0000-0000-0000-000000000003','f1000000-0000-0000-0000-000000000039',
 43, 5.99, NULL, 45, false, false, false, true, 'active',
 ARRAY['/images/brands/cuba/cuba-cola-43-mg.jpg'],
 'Classic cola taste packed into an ultra-strong pouch.',
 ARRAY[43], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000033',
 'Cuba Pineapple','cuba-pineapple',
 'b1000000-0000-0000-0000-000000000003','f1000000-0000-0000-0000-000000000037',
 43, 5.99, NULL, 50, false, true, false, false, 'active',
 ARRAY['/images/brands/cuba/cuba-pineapple-43-mg.jpg'],
 'Tropical pineapple at Cuba''s signature extreme strength.',
 ARRAY[43], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000034',
 'Cuba Watermelon','cuba-watermelon',
 'b1000000-0000-0000-0000-000000000003','f1000000-0000-0000-0000-000000000038',
 43, 5.49, 5.99, 35, true, false, false, false, 'active',
 ARRAY['/images/brands/cuba/cuba-watermelon-43-mg.jpg'],
 'Juicy watermelon with a knockout nicotine hit.',
 ARRAY[43], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Ice Berg
('p1000000-0000-0000-0000-000000000035',
 'Ice Berg Strawberry Kiwi','ice-berg-strawberry-kiwi',
 'b1000000-0000-0000-0000-000000000004','f1000000-0000-0000-0000-000000000051',
 35, 5.99, NULL, 38, false, false, false, true, 'active',
 ARRAY['/images/brands/ice-berg/ice-berg-strawbey-kwii-35-mg.jpg'],
 'Strawberry kiwi at sub-zero Ice Berg intensity.',
 ARRAY[35], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000036',
 'Ice Berg Watermelon Gum Mint','ice-berg-watermelon-gum-mint',
 'b1000000-0000-0000-0000-000000000004','f1000000-0000-0000-0000-000000000052',
 35, 5.99, NULL, 42, false, true, false, false, 'active',
 ARRAY['/images/brands/ice-berg/ice-berg-watermelon-gum-mint-35-mg.jpg'],
 'Watermelon, bubblegum, and mint — a triple-threat Ice Berg original.',
 ARRAY[35], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Velo
('p1000000-0000-0000-0000-000000000037',
 'Velo Ice Berries','velo-ice-berries',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000040',
 10, 5.49, NULL, 120, false, true, false, false, 'active',
 ARRAY['/images/brands/velo/velo-ice-berries-10-mg.jpg'],
 'Mixed berries with an icy cool finish.',
 ARRAY[10], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000038',
 'Velo Purple Grape','velo-purple-grape',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000041',
 10, 5.49, NULL, 95, false, false, false, false, 'active',
 ARRAY['/images/brands/velo/velo-purple-grape-10-mg.jpg'],
 'Rich, deep grape flavor at medium strength.',
 ARRAY[10], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000039',
 'Velo Strawberry Ice','velo-strawberry-ice',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000042',
 10, 5.49, NULL, 80, false, false, false, true, 'active',
 ARRAY['/images/brands/velo/velo-strawbery-ice-10-mg.jpg'],
 'Sweet strawberry with a cool icy finish.',
 ARRAY[10], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000040',
 'Velo Tropical Mango','velo-tropical-mango',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000043',
 10, 5.49, NULL, 110, false, false, true, false, 'active',
 ARRAY['/images/brands/velo/velo-tropcial-mango-10-mg.jpg'],
 'Sun-ripe tropical mango at medium strength.',
 ARRAY[10], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000041',
 'Velo Watermelon Ice','velo-watermelon-ice',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000044',
 10, 5.49, NULL, 75, false, false, false, false, 'active',
 ARRAY['/images/brands/velo/velo-watermleon-ice-10-mg.jpg'],
 'Refreshing watermelon with a crisp icy edge.',
 ARRAY[10], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000042',
 'Velo Hot Peach','velo-hot-peach',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000045',
 8, 5.49, NULL, 60, false, false, false, true, 'active',
 ARRAY['/images/brands/velo/velo-hot-peach-8-mg.jpg'],
 'Warm, ripe peach flavor for a smooth all-day experience.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000043',
 'Velo Hot Grape','velo-hot-grape',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000046',
 8, 5.49, NULL, 55, false, false, false, false, 'active',
 ARRAY['/images/brands/velo/velo-hot-grape-8-mg.jpg'],
 'Intense grape with a warm lingering kick.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000044',
 'Velo Dragon Fruit','velo-dragon-fruit',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000047',
 8, 5.49, NULL, 65, false, true, false, false, 'active',
 ARRAY['/images/brands/velo/velo-hot-dragom-fruit-8mg.jpg'],
 'Exotic dragon fruit flavor at a smooth moderate strength.',
 ARRAY[8], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000045',
 'Velo Lime Flame','velo-lime-flame',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000048',
 14, 5.99, NULL, 70, false, false, false, true, 'active',
 ARRAY['/images/brands/velo/velo-lime-flame-14-mg.jpg'],
 'Fiery lime with a zesty, sharp finish at higher strength.',
 ARRAY[14], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000046',
 'Velo Peppermint Freeze','velo-peppermint-freeze',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000049',
 17, 5.99, NULL, 50, false, false, false, false, 'active',
 ARRAY['/images/brands/velo/velo-peppermint-freeze-17-mg.jpg'],
 'Intense peppermint freeze at high strength.',
 ARRAY[17], ARRAY[]::text[], '{}', NULL, NULL, NULL),

('p1000000-0000-0000-0000-000000000047',
 'Velo Wintery Watermelon','velo-wintery-watermelon',
 'b1000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000050',
 17, 5.99, NULL, 45, false, false, false, true, 'active',
 ARRAY['/images/brands/velo/velo-wintery-watermelon-17-mg.jpg'],
 'A cold-weather take on watermelon at high strength.',
 ARRAY[17], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Copenhagen
('p1000000-0000-0000-0000-000000000048',
 'Copenhagen Spearmint','copenhagen-spearmint',
 'b1000000-0000-0000-0000-000000000002','f1000000-0000-0000-0000-000000000031',
 9, 5.49, NULL, 40, false, false, false, true, 'active',
 ARRAY[]::text[],
 'A heritage spearmint profile, tobacco-free.',
 ARRAY[9], ARRAY[]::text[], '{}', NULL, NULL, NULL),

-- Pablo (no images yet, keeping as placeholders)
('p1000000-0000-0000-0000-000000000049',
 'Pablo Black Cherry','pablo-black-cherry',
 'b1000000-0000-0000-0000-000000000007','f1000000-0000-0000-0000-000000000034',
 24, 6.99, NULL, 30, false, true, false, true, 'active',
 ARRAY[]::text[],
 'High-intensity black cherry for experienced users.',
 ARRAY[24], ARRAY[]::text[], '{}', NULL, NULL, NULL)

ON CONFLICT (slug) DO UPDATE SET
  name               = EXCLUDED.name,
  brand_id           = EXCLUDED.brand_id,
  flavor_id          = EXCLUDED.flavor_id,
  strength_mg        = EXCLUDED.strength_mg,
  price              = EXCLUDED.price,
  compare_at_price   = EXCLUDED.compare_at_price,
  stock_quantity     = EXCLUDED.stock_quantity,
  is_on_sale         = EXCLUDED.is_on_sale,
  is_featured        = EXCLUDED.is_featured,
  is_best_seller     = EXCLUDED.is_best_seller,
  is_new_arrival     = EXCLUDED.is_new_arrival,
  status             = EXCLUDED.status,
  image_urls         = EXCLUDED.image_urls,
  description        = EXCLUDED.description,
  available_strengths= EXCLUDED.available_strengths,
  available_flavors  = EXCLUDED.available_flavors,
  strength_images    = EXCLUDED.strength_images,
  price_3pack        = EXCLUDED.price_3pack,
  price_5pack        = EXCLUDED.price_5pack,
  price_10pack       = EXCLUDED.price_10pack;

-- ── 4. BUNDLES ───────────────────────────────────────────────────────────────
INSERT INTO bundles (id, name, slug, description, image_url, bundle_price) VALUES
  ('bn100000-0000-0000-0000-000000000001', 'Mint Starter Pack',      'mint-starter-pack',      'Five mint and menthol favorites to find your strength sweet spot.',          '/images/brands/zyn-us/zyn-6-mg-cool-mint-us.jpg', 22.99),
  ('bn100000-0000-0000-0000-000000000002', 'Fruit Explorer Bundle',  'fruit-explorer-bundle',  'A fruit-forward sampler pulling from four different European brands.',        '/images/brands/alp/alp-mango-freeze.jpg',          26.99),
  ('bn100000-0000-0000-0000-000000000003', 'Extra Strong Sampler',   'extra-strong-sampler',   'For experienced users — three of our strongest pouches in one box.',          '/images/brands/killa/chatgpt-image-jun-20-2026-08-22-03-pm.jpg', 18.99)
ON CONFLICT (slug) DO UPDATE SET
  name         = EXCLUDED.name,
  description  = EXCLUDED.description,
  image_url    = EXCLUDED.image_url,
  bundle_price = EXCLUDED.bundle_price;

-- ── 5. BUNDLE PRODUCTS ───────────────────────────────────────────────────────
INSERT INTO bundle_products (bundle_id, product_id) VALUES
  ('bn100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000014'),
  ('bn100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000019'),
  ('bn100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000020'),
  ('bn100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000006'),
  ('bn100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000025'),
  ('bn100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000004'),
  ('bn100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000012'),
  ('bn100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000027'),
  ('bn100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000028'),
  ('bn100000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000028'),
  ('bn100000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000029'),
  ('bn100000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000035')
ON CONFLICT DO NOTHING;

-- ── 6. RLS: ensure anon/authenticated can read all product data ───────────────
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands    ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read"       ON products;
DROP POLICY IF EXISTS "brands_public_read"         ON brands;
DROP POLICY IF EXISTS "flavors_public_read"        ON flavors;
DROP POLICY IF EXISTS "bundles_public_read"        ON bundles;
DROP POLICY IF EXISTS "bundle_products_public_read" ON bundle_products;

CREATE POLICY "products_public_read"        ON products        FOR SELECT USING (true);
CREATE POLICY "brands_public_read"          ON brands          FOR SELECT USING (true);
CREATE POLICY "flavors_public_read"         ON flavors         FOR SELECT USING (true);
CREATE POLICY "bundles_public_read"         ON bundles         FOR SELECT USING (true);
CREATE POLICY "bundle_products_public_read" ON bundle_products FOR SELECT USING (true);

-- Service role gets full access for admin panel
GRANT ALL ON products, brands, flavors, bundles, bundle_products TO service_role;
GRANT SELECT ON products, brands, flavors, bundles, bundle_products TO anon, authenticated;

-- ── 7. WELCOME10 discount code (ensure it exists) ────────────────────────────
INSERT INTO discount_codes (code, discount_type, discount_value, is_active)
VALUES ('WELCOME10', 'percent', 10, true)
ON CONFLICT (code) DO UPDATE SET is_active = true, discount_value = 10;

