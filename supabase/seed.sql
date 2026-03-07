-- Scottsdale Wine Trail MVP seed

insert into public.wineries (
  name,
  slug,
  address,
  city,
  state,
  zip,
  lat,
  lng,
  description,
  phone,
  email,
  website
)
values
  (
    'Aridus Wine Company',
    'aridus-wine-company',
    '7173 E. Main Street',
    'Scottsdale',
    'AZ',
    '85251',
    33.4928431,
    -111.9267254,
    'Scottsdale tasting room for Aridus Wine Company.',
    '520-954-2676',
    'info@ariduswineco.com',
    'https://ariduswineco.com'
  ),
  (
    'Arizona Stronghold Vineyards',
    'arizona-stronghold-vineyards',
    '4225 N. Marshall Way, Ste #2',
    'Scottsdale',
    'AZ',
    '85251',
    33.4972728,
    -111.9286346,
    'Arizona Stronghold Vineyards tasting room in Scottsdale.',
    '480-779-1600',
    'info@azstronghold.com',
    'https://azstronghold.com'
  ),
  (
    'Carlson Creek Tasting Room',
    'carlson-creek-tasting-room',
    '4142 N. Marshall Way',
    'Scottsdale',
    'AZ',
    '85251',
    33.4956085,
    -111.9292911,
    'Carlson Creek Vineyard tasting room in Old Town Scottsdale.',
    '480-947-0636',
    'info@carlsoncreek.com',
    'https://carlsoncreek.com'
  ),
  (
    'LDV Winery Tasting Room',
    'ldv-winery-tasting-room',
    '7134 E. Stetson Dr., B-110',
    'Scottsdale',
    'AZ',
    '85251',
    33.4994348,
    -111.9278661,
    'LDV Winery tasting room serving Arizona-grown wines.',
    '480-664-4822',
    'info@ldvwinery.com',
    'https://ldvwinery.com'
  ),
  (
    'Los Milics Vineyards',
    'los-milics-vineyards',
    '4151 N. Marshall Way',
    'Scottsdale',
    'AZ',
    '85251',
    33.4959464,
    -111.9287280,
    'Los Milics Vineyards tasting room in Scottsdale.',
    '480-390-1668',
    'scottsdale@losmilics.com',
    'https://losmilics.com'
  ),
  (
    'Salvatore Vineyards Tasting Room',
    'salvatore-vineyards-tasting-room',
    '7064 E. 5th Ave',
    'Scottsdale',
    'AZ',
    '85251',
    33.4982043,
    -111.9291499,
    'Salvatore Vineyards tasting room and flights in Old Town.',
    '480-423-2901',
    'info@passioncellars.com',
    'https://salvatorevineyards.com'
  ),
  (
    'The Wine Collective of Scottsdale',
    'the-wine-collective-of-scottsdale',
    '4020 N. Scottsdale Rd. #104',
    'Scottsdale',
    'AZ',
    '85251',
    33.4943052,
    -111.9264455,
    'The Wine Collective of Scottsdale wine bar and tasting space.',
    '480-912-1746',
    'thewinecollectiveofscottsdale@gmail.com',
    'https://the-wine-collective.com'
  )
on conflict (slug) do update
set
  name = excluded.name,
  address = excluded.address,
  city = excluded.city,
  state = excluded.state,
  zip = excluded.zip,
  lat = excluded.lat,
  lng = excluded.lng,
  description = excluded.description,
  phone = excluded.phone,
  email = excluded.email,
  website = excluded.website;

with winery_ids as (
  select id, slug from public.wineries
)
insert into public.events (
  winery_id,
  title,
  description,
  start_date,
  end_date,
  type
)
select
  w.id,
  e.title,
  e.description,
  now() + e.offset_days,
  now() + e.offset_days + interval '2 hours',
  e.type
from winery_ids w
join (
  values
    ('aridus-wine-company', 'Sunset Tasting Flight', 'Guided tasting of current seasonal releases.', interval '3 days', 'tasting'),
    ('arizona-stronghold-vineyards', 'Winemaker Meet and Greet', 'Meet the Arizona Stronghold team and taste reserve pours.', interval '5 days', 'educational'),
    ('carlson-creek-tasting-room', 'Weekend Vineyard Showcase', 'Feature flight with Carlson Creek favorites.', interval '7 days', 'tasting'),
    ('ldv-winery-tasting-room', 'Old Town Wine Walk', 'Walk-up tasting experience with paired bites.', interval '9 days', 'tour'),
    ('los-milics-vineyards', 'Los Milics Release Night', 'New release pours and tasting notes.', interval '11 days', 'festival'),
    ('salvatore-vineyards-tasting-room', 'Chef Pairing Session', 'Wine and small-plate pairing session.', interval '13 days', 'educational'),
    ('the-wine-collective-of-scottsdale', 'Collector Cellar Picks', 'Special list tasting with cellar selections.', interval '15 days', 'tasting')
) as e(slug, title, description, offset_days, type)
  on e.slug = w.slug
where not exists (
  select 1
  from public.events existing
  where existing.winery_id = w.id
    and existing.title = e.title
);

with winery_ids as (
  select id, slug from public.wineries
)
insert into public.wines (
  winery_id,
  name,
  varietal,
  price,
  available
)
select
  w.id,
  wine.name,
  wine.varietal,
  wine.price,
  wine.available
from winery_ids w
join (
  values
    ('aridus-wine-company', 'Desert Bloom Rose', 'Rose', 18.00, true),
    ('aridus-wine-company', 'Willcox Cabernet', 'Cabernet Sauvignon', 28.00, true),
    ('arizona-stronghold-vineyards', 'Nachise Red Blend', 'Red Blend', 24.00, true),
    ('arizona-stronghold-vineyards', 'Dala Chardonnay', 'Chardonnay', 22.00, true),
    ('carlson-creek-tasting-room', 'Rule of Three Red', 'Red Blend', 26.00, true),
    ('carlson-creek-tasting-room', 'Chenon Blanc', 'Chenin Blanc', 19.00, true),
    ('ldv-winery-tasting-room', 'Petite Sirah Reserve', 'Petite Sirah', 32.00, true),
    ('ldv-winery-tasting-room', 'Rhone Ranger Blanc', 'White Blend', 21.00, true),
    ('los-milics-vineyards', 'Dos Amigos Tempranillo', 'Tempranillo', 30.00, true),
    ('los-milics-vineyards', 'Patio Viognier', 'Viognier', 20.00, false),
    ('salvatore-vineyards-tasting-room', 'Salvatore Sangiovese', 'Sangiovese', 27.00, true),
    ('salvatore-vineyards-tasting-room', 'Main Street Pinot Gris', 'Pinot Gris', 18.00, true),
    ('the-wine-collective-of-scottsdale', 'Collective House Red', 'House Blend', 16.00, true),
    ('the-wine-collective-of-scottsdale', 'Collective House White', 'House Blend', 16.00, true)
) as wine(slug, name, varietal, price, available)
  on wine.slug = w.slug
where not exists (
  select 1
  from public.wines existing
  where existing.winery_id = w.id
    and existing.name = wine.name
);
