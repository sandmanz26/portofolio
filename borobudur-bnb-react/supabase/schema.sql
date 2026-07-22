-- Borobudur BnB — Supabase schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- before running seed.sql.

-- ============================================================
-- TABLES
-- ============================================================

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
  hero jsonb not null default '{}'::jsonb,      -- { "image": "https://...", "alt": "..." }
  thumbs jsonb not null default '[]'::jsonb,     -- [{ "image": "https://...", "alt": "..." }, ...]
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

create table if not exists activities (
  slug text primary key,
  sort_order int not null default 0,
  no text not null default '',
  kicker text not null default '',
  name text not null default '',
  lede text not null default '',
  hero jsonb not null default '{}'::jsonb,
  thumbs jsonb not null default '[]'::jsonb,
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

create table if not exists workshops (
  id text primary key,
  sort_order int not null default 0,
  media jsonb not null default '{}'::jsonb, -- { "image": "https://...", "alt": "..." }
  meta text not null default '',
  title text not null default '',
  text text not null default ''
);

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

do $$
declare
  t text;
begin
  foreach t in array array['site_settings','rooms','activities','workshops','testimonials','facilities']
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
