-- Borobudur BnB — Supabase schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- before running seed.sql. Safe to re-run.
--
-- If you already ran an earlier version of this file (the one where photos
-- lived in a `hero`/`thumbs`/`media` jsonb column on each row), this version
-- drops those columns and moves every photo into its own row in a new
-- `images` table instead — so a room/activity/gallery can have any number
-- of photos added or removed, not just a fixed set replaced in place.
-- Re-run seed.sql afterwards to repopulate images for the new table.

-- ============================================================
-- TABLES
-- ============================================================

create extension if not exists pgcrypto; -- provides gen_random_uuid()

create table if not exists site_settings (
  id int primary key default 1,
  name text not null default '',
  tagline text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  address_short text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  map_embed text not null default '',
  constraint site_settings_singleton check (id = 1)
);

create table if not exists rooms (
  slug text primary key,
  sort_order int not null default 0,
  no text not null default '',
  kicker text not null default '',
  name text not null default '',
  lede text not null default '',
  cap_left text not null default '',
  cap_right text not null default '',
  specs jsonb not null default '[]'::jsonb,      -- [["Sleeps","2 guests"], ...]
  price text not null default '',
  per text not null default '',
  note text not null default '',
  story_label text not null default '',
  story_title text not null default '',
  paragraphs jsonb not null default '[]'::jsonb, -- ["paragraph one", "paragraph two"]
  highlights jsonb not null default '[]'::jsonb, -- ["highlight one", ...]
  list_meta jsonb not null default '[]'::jsonb,  -- ["2 guests", "32 m²", ...]
  list_desc text not null default '',
  list_price text not null default '',
  list_price_per text not null default ''
);
alter table rooms drop column if exists hero;
alter table rooms drop column if exists thumbs;

create table if not exists activities (
  slug text primary key,
  sort_order int not null default 0,
  no text not null default '',
  kicker text not null default '',
  name text not null default '',
  lede text not null default '',
  cap_left text not null default '',
  cap_right text not null default '',
  specs jsonb not null default '[]'::jsonb,
  price text not null default '',
  per text not null default '',
  note text not null default '',
  story_label text not null default '',
  story_title text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  list_meta jsonb not null default '[]'::jsonb,
  list_desc text not null default '',
  list_price text not null default '',
  list_price_per text not null default ''
);
alter table activities drop column if exists hero;
alter table activities drop column if exists thumbs;

create table if not exists workshops (
  id text primary key,
  sort_order int not null default 0,
  meta text not null default '',
  title text not null default '',
  text text not null default ''
);
alter table workshops drop column if exists media;

create table if not exists testimonials (
  id int primary key,
  sort_order int not null default 0,
  quote text not null default '',
  name text not null default '',
  place text not null default ''
);

create table if not exists facilities (
  no text primary key,
  sort_order int not null default 0,
  title text not null default '',
  text text not null default ''
);

-- Every photo on the site — room/activity hero & gallery thumbs, workshop
-- photos, and the curated Home/Facility galleries — lives here instead of
-- being embedded in the row it illustrates.
--   section:    'room' | 'activity' | 'workshop' | 'home_gallery' | 'facility_gallery'
--   entity_key: the room/activity slug or workshop id; null for the two
--               standalone galleries (they aren't tied to one entity)
--   role:       'hero' | 'thumb' | 'media' | 'gallery'
--     - 'hero'/'media' are single-slot (exactly 0 or 1 row) — replace only
--     - 'thumb'/'gallery' are multi-slot — can have any number of rows,
--       added or removed freely, ordered by sort_order
create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  entity_key text,
  role text not null default 'gallery',
  sort_order int not null default 0,
  image text not null default '',
  alt text not null default ''
);

create index if not exists images_lookup_idx on images (section, entity_key, role, sort_order);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) can read everything. Only a signed-in user (the
-- single admin account you create in Authentication) can write.
-- ============================================================

alter table site_settings enable row level security;
alter table rooms enable row level security;
alter table activities enable row level security;
alter table workshops enable row level security;
alter table testimonials enable row level security;
alter table facilities enable row level security;
alter table images enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['site_settings','rooms','activities','workshops','testimonials','facilities','images']
  loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);

    execute format('drop policy if exists "authenticated write" on %I', t);
    execute format(
      'create policy "authenticated write" on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
      t
    );
  end loop;
end $$;

-- ============================================================
-- STORAGE (content images uploaded from the admin editor)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

drop policy if exists "public read content-images" on storage.objects;
create policy "public read content-images"
  on storage.objects for select
  using (bucket_id = 'content-images');

drop policy if exists "authenticated upload content-images" on storage.objects;
create policy "authenticated upload content-images"
  on storage.objects for insert
  with check (bucket_id = 'content-images' and auth.role() = 'authenticated');

drop policy if exists "authenticated update content-images" on storage.objects;
create policy "authenticated update content-images"
  on storage.objects for update
  using (bucket_id = 'content-images' and auth.role() = 'authenticated');

drop policy if exists "authenticated delete content-images" on storage.objects;
create policy "authenticated delete content-images"
  on storage.objects for delete
  using (bucket_id = 'content-images' and auth.role() = 'authenticated');
