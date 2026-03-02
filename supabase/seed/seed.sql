-- Seed 5 example wineries
insert into wineries (name, slug, address, city, state, zip, lat, lng, description, hero_image_url, phone, website, hours_json, tags)
values
(
  'Aridus Wine Company',
  'aridus-wine-company',
  '1126 N Pinal Ave',
  'Casa Grande',
  'AZ',
  '85122',
  32.8795,
  -111.7575,
  'Aridus Wine Company crafts elegant, terroir-driven wines from Arizona''s premier appellations. Their tasting room in Scottsdale showcases the depth and character of Arizona viticulture.',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
  '(520) 836-1700',
  'https://www.aridus.com',
  '{"Mon":"Closed","Tue":"11am–6pm","Wed":"11am–6pm","Thu":"11am–6pm","Fri":"11am–8pm","Sat":"10am–8pm","Sun":"11am–5pm"}',
  ARRAY['red','white','estate']
),
(
  'Carlson Creek Vineyard',
  'carlson-creek-vineyard',
  '7175 E Camelback Rd',
  'Scottsdale',
  'AZ',
  '85251',
  33.5027,
  -111.9277,
  'Family-owned and passionately dedicated to Arizona wine, Carlson Creek Vineyard produces distinctive reds and whites that reflect the unique character of the state''s high-altitude appellations.',
  'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=800',
  '(928) 649-8463',
  'https://carlsoncreek.com',
  '{"Mon":"Closed","Tue":"Closed","Wed":"11am–6pm","Thu":"11am–6pm","Fri":"11am–8pm","Sat":"10am–8pm","Sun":"11am–5pm"}',
  ARRAY['red','rosé','family-owned']
),
(
  'LDV Winery',
  'ldv-winery',
  '7750 E Main St',
  'Scottsdale',
  'AZ',
  '85251',
  33.4947,
  -111.9129,
  'LDV Winery blends old-world winemaking techniques with Arizona''s extraordinary growing conditions. Their award-winning blends and single varietals are celebrated across the Southwest.',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  '(480) 722-0313',
  'https://www.ldvwinery.com',
  '{"Mon":"Closed","Tue":"11am–5pm","Wed":"11am–5pm","Thu":"11am–5pm","Fri":"11am–7pm","Sat":"10am–7pm","Sun":"11am–5pm"}',
  ARRAY['red','blends','award-winning']
),
(
  'Chateau Tumbleweed',
  'chateau-tumbleweed',
  '1235 N Beaver St',
  'Flagstaff',
  'AZ',
  '86001',
  35.2027,
  -111.6533,
  'Nestled at 7,000 feet in northern Arizona, Chateau Tumbleweed is a boutique urban winery using grapes sourced from premium Arizona vineyards. Known for playful labels and serious wine.',
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800',
  '(928) 226-8000',
  'https://chateautumbleweed.com',
  '{"Mon":"Closed","Tue":"Closed","Wed":"3pm–8pm","Thu":"3pm–8pm","Fri":"12pm–9pm","Sat":"12pm–9pm","Sun":"12pm–6pm"}',
  ARRAY['boutique','white','high-altitude']
),
(
  'Sand-Reckoner Vineyards',
  'sand-reckoner-vineyards',
  '6900 E Princess Dr',
  'Scottsdale',
  'AZ',
  '85255',
  33.6872,
  -111.9048,
  'Sand-Reckoner is an explorer''s winery—seeking out the finest Arizona fruit and crafting wines that challenge and delight. Named after Archimedes, they take an intellectual approach to winemaking.',
  'https://images.unsplash.com/photo-1472691997714-aeace19f8b3a?w=800',
  '(520) 508-1313',
  'https://sand-reckoner.com',
  '{"Mon":"Closed","Tue":"Closed","Wed":"11am–6pm","Thu":"11am–6pm","Fri":"11am–7pm","Sat":"10am–7pm","Sun":"11am–5pm"}',
  ARRAY['red','white','exploratory']
);

-- Seed events (using the wineries we just inserted)
with w as (select id, slug from wineries)
insert into events (winery_id, title, description, start_date, end_date, type)
select
  w.id,
  e.title,
  e.description,
  e.start_date::timestamptz,
  e.end_date::timestamptz,
  e.type
from w
join (values
  ('aridus-wine-company',      'Arizona Harvest Tasting',       'Join us for a special vertical tasting of our harvest-selection reds, guided by our head winemaker.', '2026-04-12 14:00:00-07', '2026-04-12 17:00:00-07', 'tasting'),
  ('carlson-creek-vineyard',   'Family Vineyard Tour',          'A guided tour of the vineyards with a 5-wine tasting flight and meet the winemakers behind the magic.', '2026-05-03 11:00:00-07', '2026-05-03 14:00:00-07', 'tour'),
  ('ldv-winery',               'Southwest Wine Festival',       'An outdoor festival celebrating the best of Arizona wine alongside local food vendors, live music, and more.', '2026-06-07 12:00:00-07', '2026-06-07 20:00:00-07', 'festival'),
  ('chateau-tumbleweed',       'Wine & Cheese Education Class', 'Learn the art of wine and cheese pairing in this intimate class led by our sommelier.', '2026-04-25 18:00:00-07', '2026-04-25 20:00:00-07', 'educational'),
  ('sand-reckoner-vineyards',  'Explorer''s Release Party',     'Be first to taste the newest releases from Sand-Reckoner. Live music, small bites, and great wine.', '2026-05-17 16:00:00-07', '2026-05-17 21:00:00-07', 'tasting')
) as e(slug, title, description, start_date, end_date, type)
on w.slug = e.slug;

-- Seed wines
with w as (select id, slug from wineries)
insert into wines (winery_id, name, varietal, price, available)
select
  w.id,
  wn.name,
  wn.varietal,
  wn.price,
  wn.available
from w
join (values
  ('aridus-wine-company',     'Cochise Courage Cabernet',  'Cabernet Sauvignon', 42.00, true),
  ('aridus-wine-company',     'Riesling Reserve',          'Riesling',           28.00, true),
  ('carlson-creek-vineyard',  'Malvasia Bianca',           'Malvasia Bianca',    30.00, true),
  ('carlson-creek-vineyard',  'Heritage Red',              'Blend',              38.00, false),
  ('ldv-winery',              'Rusted Lion',               'Blend',              48.00, true),
  ('ldv-winery',              'Petite Sirah',              'Petite Sirah',       36.00, true),
  ('chateau-tumbleweed',      'Clarkdale White',           'Roussanne',          32.00, true),
  ('chateau-tumbleweed',      'Yavapai Sunset',            'Grenache Rosé',      26.00, true),
  ('sand-reckoner-vineyards', 'Dos Cabezas Red',           'Blend',              44.00, true),
  ('sand-reckoner-vineyards', 'Willcox Viognier',          'Viognier',           34.00, false)
) as wn(slug, name, varietal, price, available)
on w.slug = wn.slug;
