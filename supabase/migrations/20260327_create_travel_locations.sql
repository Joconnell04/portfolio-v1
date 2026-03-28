create table if not exists public.travel_locations (
  slug text primary key,
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists travel_locations_sort_order_idx
  on public.travel_locations (sort_order asc, name asc);

insert into public.travel_locations (slug, name, latitude, longitude, image_url, sort_order)
values
  ('bangkok', 'Bangkok', 13.7563, 100.5018, 'https://source.unsplash.com/featured/1600x1000/?bangkok,thailand,city,night', 1),
  ('taipei', 'Taipei', 25.033, 121.5654, 'https://source.unsplash.com/featured/1600x1000/?taipei,taiwan,city,night', 2),
  ('abu-dhabi', 'Abu Dhabi', 24.4539, 54.3773, 'https://source.unsplash.com/featured/1600x1000/?abu-dhabi,uae,city,skyline', 3),
  ('chicago', 'Chicago', 41.8781, -87.6298, 'https://source.unsplash.com/featured/1600x1000/?chicago,illinois,skyline,night', 4)
on conflict (slug) do update set
  name = excluded.name,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();
