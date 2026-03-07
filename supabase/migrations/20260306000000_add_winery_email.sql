alter table public.wineries
add column if not exists email text;

update public.wineries
set email = case name
  when 'Aridus Wine Company' then 'info@ariduswineco.com'
  when 'Arizona Stronghold Vineyards' then 'info@azstronghold.com'
  when 'Carlson Creek Tasting Room' then 'info@carlsoncreek.com'
  when 'LDV Winery Tasting Room' then 'info@ldvwinery.com'
  when 'Los Milics Vineyards' then 'scottsdale@losmilics.com'
  when 'Salvatore Vineyards Tasting Room' then 'info@passioncellars.com'
  when 'The Wine Collective of Scottsdale' then 'thewinecollectiveofscottsdale@gmail.com'
  else email
end
where email is null;
