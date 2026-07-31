-- ============================================================
-- Borobudur Home Furniture — Supabase schema
--
-- Run this whole file once in the Supabase Dashboard's SQL Editor
-- (Project -> SQL Editor -> New query -> paste -> Run). It is
-- idempotent: safe to re-run if something fails partway through.
--
-- It creates:
--   1. public.products      — the product catalog table
--   2. Row Level Security    — public can read, only signed-in
--                              (authenticated) users can write
--   3. product-photos bucket — for the admin gallery uploader
--   4. Storage policies       — public can read, only signed-in
--                              users can upload/update/delete
--   5. The 12 demo products, so the site looks identical to the
--      localStorage version immediately after switching over
--   6. public.site_content   — editorial copy for Home/Catalog/
--                              Contact and site-wide contact details,
--                              edited from /admin/content
--   7. Row Level Security for site_content — same public-read,
--      authenticated-write pattern as products
--   8. The default copy for all 12 content sections, matching what
--      the site shows out of the box
--
-- After running this, follow the rest of README.md's "Moving to
-- Supabase" section: create an admin user under Authentication,
-- get your API keys, and set them as env vars.
-- ============================================================


-- 1. Table -----------------------------------------------------

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null default 0,
  images jsonb not null default '[]'::jsonb,
  tag text,
  featured boolean not null default false,
  short text not null default '',
  description text not null default '',
  dimensions text not null default '',
  material text not null default '',
  finish text not null default '',
  lead_time text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit from the admin panel.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();


-- 2. Row Level Security -----------------------------------------
-- The public site (anonymous visitors) only ever reads. The admin
-- panel writes after signing in via Supabase Auth, so writes are
-- restricted to the 'authenticated' role.

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

drop policy if exists "Authenticated users can insert products" on public.products;
create policy "Authenticated users can insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update products" on public.products;
create policy "Authenticated users can update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
  on public.products for delete
  to authenticated
  using (true);


-- 3. Storage bucket for gallery photos ---------------------------

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;


-- 4. Storage policies ---------------------------------------------
-- Public read (so photos actually display on the public site),
-- authenticated-only write (so only signed-in admins can upload).

drop policy if exists "Public can read product photos" on storage.objects;
create policy "Public can read product photos"
  on storage.objects for select
  using (bucket_id = 'product-photos');

drop policy if exists "Authenticated users can upload product photos" on storage.objects;
create policy "Authenticated users can upload product photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-photos');

drop policy if exists "Authenticated users can update product photos" on storage.objects;
create policy "Authenticated users can update product photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-photos');

drop policy if exists "Authenticated users can delete product photos" on storage.objects;
create policy "Authenticated users can delete product photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-photos');


-- 5. Seed data ------------------------------------------------------
-- The same 12 demo products the site ships with, so nothing looks
-- empty immediately after switching over. Safe to skip or delete
-- this section if you'd rather start from an empty catalog and add
-- everything through the admin panel instead.

insert into public.products
  (id, name, category, price, images, tag, featured, short, description, dimensions, material, finish, lead_time)
values
  ('arjuna-lounge-chair', 'Arjuna Lounge Chair', 'Seating', 4850000, '["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'Best Seller', true, 'An upholstered lounge chair on a solid teak frame with a light silhouette.', 'Arjuna is a lounge chair built on a solid teak frame, its reclined back angled for long, unhurried evenings. Traditional mortise-and-tenon joints are cut by hand in our Yogyakarta workshop, then finished in a natural matte that keeps the grain visible.', '65 × 78 × 82 cm', 'Grade-A solid teak, premium upholstery', 'Natural matte / Walnut dark', 'In stock at our showroom'),
  ('srikandi-dining-chair', 'Srikandi Dining Chair', 'Seating', 1950000, '["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, false, 'A slatted-back dining chair — light in the hand, solid underfoot.', 'Srikandi pairs a vertical slatted back with a generous seat. Its quiet profile sits comfortably with almost any dining table, from Scandinavian to Japandi interiors, and its solid-wood joinery is built for daily use.', '45 × 52 × 88 cm', 'Solid teak / mahogany', 'Natural matte / Black stain', 'In stock at our showroom'),
  ('bima-sofa', 'Bima Three-Seat Sofa', 'Seating', 12500000, '["https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'Featured', true, 'A three-seater with an exposed teak base and loose cushions.', 'Bima is a three-seat sofa whose solid teak base stays visible along the arms and rail — the wood is the point. Premium foam cushions in removable linen covers can be re-covered in the fabric of your choice.', '210 × 85 × 78 cm', 'Solid teak frame, premium foam', 'Linen upholstery (custom colours)', 'Made to order, 4–6 weeks'),
  ('shinta-coffee-table', 'Shinta Coffee Table', 'Tables', 3250000, '["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, true, 'A round coffee table cut from a single teak board.', 'Shinta''s top is cut from a single teak board with a softly rounded edge. The splayed legs keep it visually light while staying firmly planted — a calm centrepiece for a minimalist living room.', '120 × 60 × 42 cm', 'Grade-A solid teak', 'Natural matte', 'In stock at our showroom'),
  ('rama-dining-table', 'Rama Dining Table', 'Tables', 8900000, '["https://images.unsplash.com/photo-1519643381401-22c77e60520e?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'Best Seller', true, 'A six-seat dining table with a 4 cm solid teak top.', 'Rama is built from a 4 cm-thick teak top on full end-frame legs — a plain statement about simplicity and strength. Available in 160, 180 and 200 cm lengths, or made to measure for your room.', '180 × 90 × 76 cm', 'Solid teak, 4 cm top', 'Natural matte / Smoked oak', 'In stock & made to order'),
  ('nakula-console', 'Nakula Console Table', 'Storage', 4200000, '["https://images.unsplash.com/photo-1597072689227-8882273e8f6a?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, false, 'A slim two-drawer console for hallways and entryways.', 'Nakula is a slim console with two drawers on traditional wooden runners. At just 35 cm deep it slips into hallways and entries without giving up storage — or quietly doubles as a small writing desk.', '120 × 35 × 80 cm', 'Solid teak & teak veneer', 'Natural matte / Black stain', 'Made to order, 3–4 weeks'),
  ('dewi-bed', 'Dewi Bed Frame', 'Bedroom', 9800000, '["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'Featured', true, 'A tall-headboard bed with calm lines and a low profile.', 'Dewi carries a tall panelled headboard over a low platform that makes the whole room feel larger. The solid teak frame assembles without visible bolts. Available in queen and king, or fully custom sizes.', '170 × 210 × 110 cm (Queen)', 'Solid teak & teak panels', 'Natural matte / Walnut dark', 'Made to order, 4–6 weeks'),
  ('sadewa-nightstand', 'Sadewa Nightstand', 'Bedroom', 2150000, '["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, false, 'A two-drawer nightstand on slender tapered legs.', 'The companion to our Dewi bed, Sadewa holds two drawers on smooth traditional wooden runners. Compact on the floor, generous enough for everything a bedside needs.', '45 × 40 × 55 cm', 'Solid teak', 'Natural matte / Walnut dark', 'In stock at our showroom'),
  ('gatot-wardrobe', 'Gatot Wardrobe', 'Bedroom', 14500000, '["https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, false, 'A two-door wardrobe with a configurable interior.', 'Gatot is a two-door wardrobe with recessed wooden pulls. The interior — hanging rail, shelves and drawers — is configured to how you actually dress. A three-door version is available on request.', '120 × 60 × 210 cm', 'Solid teak & teak panels', 'Natural matte / Smoked oak', 'Made to order, 5–7 weeks'),
  ('kresna-bookshelf', 'Kresna Bookshelf', 'Storage', 5600000, '["https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'New', false, 'An open four-tier shelf with architectural proportions.', 'Kresna is an open four-tier shelf in a thick teak frame. Its firm proportions read as architecture against a wall — for books, ceramics, or whatever you collect.', '95 × 35 × 180 cm', 'Solid teak', 'Natural matte / Black stain', 'In stock & made to order'),
  ('laksmana-sideboard', 'Laksmana Sideboard', 'Storage', 7800000, '["https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200&auto=format&fit=crop"]'::jsonb, 'New', true, 'A long, low three-door sideboard with quiet horizontal lines.', 'Laksmana runs long and low — a three-door sideboard with adjustable shelving behind every door. Equally at home as a dining-room credenza or a media cabinet in the living room.', '180 × 45 × 75 cm', 'Solid teak & teak veneer', 'Natural matte / Walnut dark', 'In stock & made to order'),
  ('drupadi-stool', 'Drupadi Stool', 'Seating', 1450000, '["https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop"]'::jsonb, NULL, false, 'A solid-wood stool that works anywhere in the house.', 'Drupadi is a simple solid-wood stool with through-tenon joinery — extra seating at the dining table, a bedside perch, or a stand for a favourite plant. Simple objects, done properly, last the longest.', '38 × 38 × 45 cm', 'Solid teak', 'Natural matte', 'In stock at our showroom')
on conflict (id) do nothing;


-- 6. Site content table -----------------------------------------
-- One row per "section" (home_hero, home_about, contact_cta, etc.)
-- holding that section's fields as jsonb. See src/data/content.js
-- for the exact shape of each section's content, and
-- src/data/contentSchema.js for how /admin/content renders them.

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();


-- 7. Row Level Security for site_content ---------------------------
-- Same pattern as products: public reads, only signed-in
-- (authenticated) users write.

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Authenticated users can insert site content" on public.site_content;
create policy "Authenticated users can insert site content"
  on public.site_content for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update site content" on public.site_content;
create policy "Authenticated users can update site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete site content" on public.site_content;
create policy "Authenticated users can delete site content"
  on public.site_content for delete
  to authenticated
  using (true);


-- 8. Default content ------------------------------------------------
-- The same copy the site ships with, so nothing looks empty or
-- reverts to placeholder text immediately after switching over.

insert into public.site_content (key, content)
values
  ('home_hero', '{"eyebrow":"Est. 2016 — Yogyakarta","title":"Solid wood,","titleEmphasis":"made to last.","ctaLabel":"Explore the Collection","backgroundImage":"https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=2000&auto=format&fit=crop","metaItems":["Grade-A Teak","Ready Stock & Custom","Showroom in Yogyakarta"]}'::jsonb),
  ('home_about', '{"eyebrow":"About Us","title":"A decade of working wood, patiently.","paragraph1":"Founded in 2016 in Yogyakarta, Borobudur Home Furniture grew from a small workshop into a manufacturer with its own showroom. Wood is where we are strongest: we select, dry, cut and join every board ourselves.","paragraph2":"Visit the showroom and take a ready-made piece home the same day — or sit down with our team and have something custom built precisely for your space.","image":"https://images.unsplash.com/photo-1611021061285-16c871740efa?q=80&w=1200&auto=format&fit=crop","facts":[{"number":"10","label":"Years of Craft"},{"number":"500+","label":"Custom Projects"},{"number":"1","label":"Showroom in Jogja"}]}'::jsonb),
  ('home_values', '{"eyebrow":"What We Stand On","title":"Wood first. Everything else follows.","items":[{"title":"Solid Wood, No Shortcuts","desc":"Grade-A Javanese teak and mahogany, kiln-dried in-house to below 12% moisture so every piece stays true for decades."},{"title":"Honest Joinery","desc":"Mortise-and-tenon joints cut by hand, the way Javanese carpenters have built for generations. Screws are a last resort, never the structure."},{"title":"Responsibly Sourced","desc":"Timber from legal, plantation-grown Javanese forests — traceable from the log yard to your living room."},{"title":"Built Beyond Trends","desc":"Quiet designs and a 10-year structural guarantee. Furniture you keep, repair, and hand down — not replace."}]}'::jsonb),
  ('home_range', '{"eyebrow":"Product Range","title":"Four lines, one design language.","items":[{"category":"Seating","desc":"Lounge chairs, dining chairs, sofas and stools on solid teak frames."},{"category":"Tables","desc":"Dining and coffee tables cut from single teak boards."},{"category":"Bedroom","desc":"Beds, nightstands and wardrobes with calm, quiet lines."},{"category":"Storage","desc":"Sideboards, consoles and shelving that keep things in order."}]}'::jsonb),
  ('home_featured', '{"eyebrow":"Featured","title":"Selected pieces from the showroom."}'::jsonb),
  ('home_cta', '{"eyebrow":"Custom Furniture","title":"Have your own size or design? We build it.","paragraph":"From a single chair to furnishing an entire home — tell us what you need and our team will walk with you from sketch to installation.","buttonLabel":"Start a Consultation"}'::jsonb),
  ('home_contact', '{"eyebrow":"Contact Us","title":"Visit our showroom in Yogyakarta.","paragraph":"Feel the grain and the weight of the joinery for yourself. The showroom is open every day, and our team is happy to help you choose.","buttonLabel":"Contact & Directions"}'::jsonb),
  ('catalog_hero', '{"eyebrow":"Catalog","title":"The collection.","paragraph":"Every piece is made in our Yogyakarta workshop from selected solid wood. In-stock pieces can leave the showroom with you today; the rest are made to order."}'::jsonb),
  ('catalog_cta', '{"eyebrow":"Can''t find the right fit?","title":"We also build custom furniture.","paragraph":"Dimensions, timber and finish — every detail tailored to your space.","buttonLabel":"Custom Consultation"}'::jsonb),
  ('contact_hero', '{"eyebrow":"Contact Us","title":"Let''s talk.","paragraph":"Ask about availability, book a showroom visit, or start a custom furniture consultation. We usually reply within one working day."}'::jsonb),
  ('contact_cta', '{"eyebrow":"Since 2016","title":"Ten years, one standard: honest handwork.","paragraph":"Visit the showroom and judge the quality with your own hands.","buttonLabel":"View the Collection"}'::jsonb),
  ('site_settings', '{"tagline":"Borobudur Home Furniture — solid wood furniture manufacturer in Yogyakarta since 2016.","whatsappNumber":"6281227160160","whatsappDisplay":"+62 812-2716-0160","email":"hello@borobudurhomefurniture.com","addressStreet":"Jl. Parangtritis Km 6.5, Sewon","addressCity":"Bantul, Yogyakarta 55188","addressMapsUrl":"https://maps.google.com/?q=Jl.+Parangtritis+Km+6.5+Sewon+Bantul+Yogyakarta","hours":["Monday – Saturday, 9am – 5pm","Sunday, 10am – 3pm"]}'::jsonb),
  ('site_branding', '{"logoImage":"","brandMark":"BHF","brandName":"Borobudur Home Furniture","footerNote":"Handcrafted in Yogyakarta."}'::jsonb)
on conflict (key) do nothing;
