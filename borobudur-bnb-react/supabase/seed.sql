-- Borobudur BnB — initial content seed
-- Run schema.sql first. Safe to re-run: each block deletes its own rows
-- before inserting, so re-running this file resets content back to these
-- defaults (any admin edits made since are overwritten).
--
-- Image URLs point at the same Unsplash photos used by the placeholder
-- site (https://images.unsplash.com/<id> / https://plus.unsplash.com/<id>).
-- Replace them with real property photos whenever you're ready — either
-- by pasting a new URL or uploading a file from the /admin editor.

-- ============================================================
-- SITE SETTINGS
-- ============================================================
delete from site_settings where id = 1;
insert into site_settings (id, name, tagline, phone, email, address, address_short, instagram, facebook, map_embed)
values (
  1,
  $$Borobudur BnB$$,
  $$Magelang · Est. 2016$$,
  $$+62 813 9000 0123$$,
  $$hello@borobudurbnb.id$$,
  $$Jl. Balaputradewa No. 7, Dusun Ngaran II, Borobudur, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553, Indonesia$$,
  $$Jl. Balaputradewa No. 7, Dusun Ngaran II, Borobudur, Magelang, Central Java 56553$$,
  $$https://instagram.com$$,
  $$https://facebook.com$$,
  $$https://www.google.com/maps?q=Borobudur+Temple,+Jl.+Badrawati,+Borobudur,+Magelang,+Central+Java&hl=en&z=15&output=embed$$
);

-- ============================================================
-- ROOMS
-- ============================================================
delete from rooms where slug in ('joglo','garden','cottage','rooftop');

insert into rooms (slug, sort_order, no, kicker, name, lede, hero, thumbs, cap_left, cap_right, specs, price, per, note, story_label, story_title, paragraphs, highlights, list_meta, list_desc, list_price, list_price_per)
values (
  'joglo', 1, '01', $$Most Booked · Sleeps 2$$, $$Joglo Heritage Suite$$,
  $$Our signature room, built inside a genuine reclaimed teak joglo frame over eighty years old. Wooden shutters open onto the rice fields.$$,
  $${"image": "https://images.unsplash.com/photo-1584132905271-512c958d674a?q=80&w=1800&auto=format&fit=crop", "alt": "Joglo Heritage Suite bedroom with white linen"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1759223607861-f0ef3e617739?q=80&w=1200&auto=format&fit=crop", "alt": "Ensuite bathroom"},
    {"image": "https://images.unsplash.com/photo-1631340729644-8b8aad1e9dba?q=80&w=1200&auto=format&fit=crop", "alt": "View toward Borobudur Temple"},
    {"image": "https://images.unsplash.com/photo-1754597302822-4b96f3442d3f?q=80&w=1200&auto=format&fit=crop", "alt": "Reading corner"}
  ]$$,
  $$The Joglo Suite$$, $$32 m² · Rice-field view$$,
  $$[["Sleeps","2 guests · 1 king bed"],["Size","32 m² + private veranda"],["View","Rice fields"],["Comfort","AC · Ensuite · Hot water"],["Included","Breakfast · Sunrise walk · Wi-Fi"]]$$,
  $$Rp 650.000$$, $$/ night$$, $$2 of 8 rooms left this week$$,
  $$In the Room$$, $$Eighty years of teak, one quiet morning$$,
  $$[
    "The joglo frame was rescued from a house in Salaman and re-raised here beam by beam. Under its high ceiling: a king bed dressed in white cotton, a writing desk by the shutters, and a veranda with two rattan chairs facing the paddies.",
    "Mornings arrive slowly — coffee tray at the door from 5:30, mist lifting off the fields, and the temple bells if the wind is right."
  ]$$,
  $$[
    "Daily coffee & tea tray with Magelang beans",
    "Cotton batik robes and river-stone bathroom",
    "Veranda breakfast on request — no extra charge"
  ]$$,
  $$["2 guests","32 m²","Rice-field view","Most booked"]$$,
  $$Our signature room, framed by a genuine eighty-year-old teak joglo. Wooden shutters open onto the rice fields.$$,
  $$Rp 650.000$$, $$night$$
),
(
  'garden', 2, '02', $$Best Value · Sleeps 2$$, $$Garden View Room$$,
  $$Our most affordable room, opening directly onto the pool garden — and just as close to the temple as every other room in the house.$$,
  $${"image": "https://images.unsplash.com/photo-1754597302822-4b96f3442d3f?q=80&w=1800&auto=format&fit=crop", "alt": "Garden View Room cozy interior"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?q=80&w=1200&auto=format&fit=crop", "alt": "Pool garden outside the room"},
    {"image": "https://images.unsplash.com/photo-1759223607861-f0ef3e617739?q=80&w=1200&auto=format&fit=crop", "alt": "Bathroom detail"}
  ]$$,
  $$The Garden Room$$, $$24 m² · Pool garden$$,
  $$[["Sleeps","2 guests · 1 queen bed"],["Size","24 m²"],["View","Garden & pool"],["Comfort","Ceiling fan · Ensuite · Hot water"],["Included","Breakfast · Sunrise walk · Wi-Fi"]]$$,
  $$Rp 480.000$$, $$/ night$$, $$Free upgrade to AC on request, subject to availability$$,
  $$In the Room$$, $$Three steps from bed to pool$$,
  $$[
    "The garden rooms sit in a single-storey row along the frangipani hedge — each with its own small terrace, two coffee chairs, and a straight line to the pool ladder.",
    "Inside it's deliberately simple: a firm queen bed, cotton linen, a fan that keeps the night air moving, and a river-stone shower with reliably hot water."
  ]$$,
  $$[
    "Direct pool access from your terrace",
    "Quietest rates in high season — book early",
    "Same breakfast, same sunrise walk as every room"
  ]$$,
  $$["2 guests","24 m²","Pool garden"]$$,
  $$Simple, spotless, and opening straight onto the pool garden — just as close to the temple as every other room in the house.$$,
  $$Rp 480.000$$, $$night$$
),
(
  'cottage', 3, '03', $$For Four Guests · 2 Bedrooms$$, $$Family Cottage$$,
  $$A standalone two-bedroom cottage at the edge of our garden, facing the rice terrace — the quietest option on the property.$$,
  $${"image": "https://plus.unsplash.com/premium_photo-1697730050329-e11a8eb63c69?q=80&w=1800&auto=format&fit=crop", "alt": "Family Cottage beside the rice terrace"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1584132905271-512c958d674a?q=80&w=1200&auto=format&fit=crop", "alt": "Master bedroom in the cottage"},
    {"image": "https://images.unsplash.com/photo-1754597302822-4b96f3442d3f?q=80&w=1200&auto=format&fit=crop", "alt": "Second bedroom"},
    {"image": "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?q=80&w=1200&auto=format&fit=crop", "alt": "Shared garden and pool nearby"}
  ]$$,
  $$The Cottage$$, $$48 m² · Rice terrace$$,
  $$[["Sleeps","4 guests · 2 bedrooms"],["Size","48 m² + private terrace"],["View","Rice terrace"],["Comfort","AC · Kitchenette · Ensuite"],["Included","Breakfast · Sunrise walk · Wi-Fi"]]$$,
  $$Rp 890.000$$, $$/ night$$, $$Extra bed available for a 5th guest — Rp 150.000/night$$,
  $$In the Cottage$$, $$Room for the whole crew to slow down$$,
  $$[
    "The cottage stands apart from the main house, behind its own gate in the banana grove. A king room and a twin room share a small sitting area, with a kitchenette for warming baby food or making midnight tea.",
    "The terrace looks straight over the rice terrace — breakfast can be served there, and kids can watch the ducks work the paddies while you finish your coffee."
  ]$$,
  $$[
    "Two true bedrooms — not a curtain divider",
    "Kitchenette with kettle, fridge & basic cookware",
    "Private terrace breakfast for four, on request"
  ]$$,
  $$["4 guests","48 m²","2 bedrooms","Private terrace"]$$,
  $$A standalone two-bedroom cottage at the garden's edge, facing the rice terrace — the quietest option on the property.$$,
  $$Rp 890.000$$, $$night$$
),
(
  'rooftop', 4, '04', $$Best View · One Room Only$$, $$Rooftop Sunrise Room$$,
  $$Our only room with a private rooftop terrace facing Borobudur directly — no tour required to catch the sunrise.$$,
  $${"image": "https://images.unsplash.com/photo-1620549146396-9024d914cd99?q=80&w=1800&auto=format&fit=crop", "alt": "View of Borobudur Temple from the rooftop terrace"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1591674585153-ca78d0339b09?q=80&w=1200&auto=format&fit=crop", "alt": "Sunrise silhouette from the rooftop"},
    {"image": "https://images.unsplash.com/photo-1759223607861-f0ef3e617739?q=80&w=1200&auto=format&fit=crop", "alt": "Ensuite bathroom"}
  ]$$,
  $$The Rooftop Room$$, $$28 m² + terrace$$,
  $$[["Sleeps","2 guests · 1 king bed"],["Size","28 m² + rooftop terrace"],["View","Borobudur Temple, direct"],["Comfort","AC · Ensuite · Hot water"],["Included","Breakfast · Sunrise walk · Wi-Fi"]]$$,
  $$Rp 750.000$$, $$/ night$$, $$One room of this type — books out weeks ahead in high season$$,
  $$In the Room$$, $$Sunrise without leaving your slippers$$,
  $$[
    "A private stair leads from the room to your own rooftop: two lounge chairs, a telescope, and the temple floating over the treeline. Set the alarm for 5:10 and watch first light without joining a single queue.",
    "Downstairs is a calm king room with blackout curtains for post-sunrise naps, and the same river-stone bathroom as the Joglo Suite."
  ]$$,
  $$[
    "Private rooftop with telescope & lounge chairs",
    "Blackout curtains — sunrise on your terms",
    "Thermos of ginger tea delivered at 5 am on request"
  ]$$,
  $$["2 guests","28 m²","Direct temple view"]$$,
  $$Our only room with a private rooftop terrace facing Borobudur directly — no tour required to catch the sunrise.$$,
  $$Rp 750.000$$, $$night$$
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
delete from activities where slug in ('horse-riding','andong-tour','vw-tour','atv','rafting');

insert into activities (slug, sort_order, no, kicker, name, lede, hero, thumbs, cap_left, cap_right, specs, price, per, note, story_label, story_title, paragraphs, highlights, list_meta, list_desc, list_price, list_price_per)
values (
  'horse-riding', 1, '01', $$Land · 1.5 Hours · Beginner Friendly$$, $$Village Horseback Ride$$,
  $$A slow trail through rice paddies, bamboo groves and hamlet lanes — the same paths our grandparents rode, at the same golden hours.$$,
  $${"image": "https://images.unsplash.com/photo-1546700990-7b6416f2d90c?q=80&w=1800&auto=format&fit=crop", "alt": "Rider on a brown horse in open country"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1609128231746-356e747a53bc?q=80&w=1200&auto=format&fit=crop", "alt": "Guided ride along a quiet country road"},
    {"image": "https://images.unsplash.com/photo-1633767979501-6225d151ba70?q=80&w=1200&auto=format&fit=crop", "alt": "Golden-hour ride at the end of the day"}
  ]$$,
  $$The paddies route$$, $$Ngaran — Wanurejo$$,
  $$[["Duration","1.5 hours, guided"],["Departs","Daily 06:00 & 15:30"],["Level","Beginner friendly · min age 8"],["Includes","Horse, helmet, guide, water"],["Meet at","BnB front garden"]]$$,
  $$Rp 250.000$$, $$/ person$$, $$Book by 8 pm for the next morning's sunrise slot$$,
  $$The Experience$$, $$Ride the paths made before roads$$,
  $$[
    "Our neighbour Pak Widodo keeps four calm, village-raised horses — the kind that have carried children to school and rice to market. He leads every ride himself, at walking pace, with a second handler for first-timers, right through the garden and out along the paddy dikes.",
    "The morning slot leaves in the cool mist and catches the temple's silhouette from the paddy dikes; the afternoon slot ends with golden light over the Menoreh hills — and either way, you're back at the house in time for a plate from the garden kitchen."
  ]$$,
  $$[
    "Rice-paddy dikes with a clear line of sight to Borobudur",
    "A stop at the bamboo bridge over the Sileng stream",
    "Photos taken by your guide — sent over WhatsApp after the ride"
  ]$$,
  $$["1.5 hours","Beginner friendly","Daily 06:00 & 15:30"]$$,
  $$A gentle guided trail through rice paddies and hamlet lanes on calm, village-raised horses.$$,
  $$Rp 250.000$$, $$person$$
),
(
  'andong-tour', 2, '02', $$Land · 2 Hours · Family Friendly$$, $$Village Andong Tour$$,
  $$Climb into a hand-painted horse cart and let someone else do the walking — a route we mapped ourselves, through paddies most visitors never see.$$,
  $${"image": "https://images.unsplash.com/photo-1721048061987-d4b37f6ec11b?q=80&w=1800&auto=format&fit=crop", "alt": "Horse-drawn cart travelling a quiet country road"}$$,
  $$[
    {"image": "https://plus.unsplash.com/premium_photo-1697730050329-e11a8eb63c69?q=80&w=1200&auto=format&fit=crop", "alt": "Rice paddies along the andong route"},
    {"image": "https://images.unsplash.com/photo-1546700990-7b6416f2d90c?q=80&w=1200&auto=format&fit=crop", "alt": "Horse resting in the village"}
  ]$$,
  $$The exclusive loop$$, $$Ngaran — smallholder farms$$,
  $$[["Duration","2 hours, guided"],["Capacity","Per cart · 3–4 adults"],["Route","Rice paddies, fish ponds, home industries"],["Includes","Driver, tea break & snack"],["Best for","Families, first-timers, slow mornings"]]$$,
  $$Rp 300.000$$, $$/ cart$$, $$Two carts available — book both for larger groups$$,
  $$The Experience$$, $$A route we drew ourselves$$,
  $$[
    "The andong sets off through lanes still dominated by rice paddies and backyard ponds of ornamental fish, at the unhurried pace only a horse can set. Midway, you'll stop at a smallholder's house tucked between the fields — part farm, part living classroom on local plants — a favourite with children.",
    "Along the way you'll pass a handful of home industries and a small greenhouse, and if the timing is right, a whole parade of ducks being walked home from the paddies. The driver stops wherever you want a photo."
  ]$$,
  $$[
    "A stop at a village smallholder's plant garden, ideal for kids",
    "Home industries and a greenhouse along the route",
    "Tea break with a light snack, included"
  ]$$,
  $$["2 hours","Seats 3–4","Family friendly"]$$,
  $$A horse-cart ride along an exclusive village route — rice paddies, fish ponds, a smallholder plant farm and tea break.$$,
  $$Rp 300.000$$, $$cart$$
),
(
  'vw-tour', 3, '03', $$Road · 2.5 Hours · Up to 4 Guests$$, $$VW Classic Village Tour$$,
  $$An open-top classic Volkswagen, a driver who grew up here, and two and a half unhurried hours of back roads, hidden viewpoints and village workshops.$$,
  $${"image": "https://images.unsplash.com/photo-1619021977849-f802cdcabc76?q=80&w=1800&auto=format&fit=crop", "alt": "Classic white Volkswagen on a tree-lined dirt road"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1761231558155-8bd3812a681a?q=80&w=1200&auto=format&fit=crop", "alt": "Vintage Volkswagen driving a scenic countryside road"},
    {"image": "https://plus.unsplash.com/premium_photo-1697730050329-e11a8eb63c69?q=80&w=1200&auto=format&fit=crop", "alt": "Rice terraces along the tour route"}
  ]$$,
  $$The countryside loop$$, $$Borobudur — Punthuk Setumbu$$,
  $$[["Duration","2.5 hours, door to door"],["Departs","Daily 08:00 & 14:00"],["Capacity","Per car · up to 4 guests"],["Includes","Driver-guide, fuel, water, rain canopy"],["Excludes","Entrance tickets & parking fees"]]$$,
  $$Rp 450.000$$, $$/ car$$, $$Two cars available — combine them for groups of up to 8$$,
  $$The Experience$$, $$The village, at 30 km/h$$,
  $$[
    "The tour runs in a lovingly kept classic Volkswagen — top down when the sky allows, canopy up when it doesn't. Your driver-guide picks you up at the front gate and takes the small roads, past tobacco sheds and chili fields, toward whichever hidden, thoroughly Instagrammable corner of Borobudur you fancy.",
    "Popular stops include a quirky roadside church tower, the Svargabhumi rice-field park, and a photogenic reclaimed junkyard park, alongside the Punthuk Setumbu viewpoint and village home industries — tell your driver what you'd like to see and the route bends around it. Entrance tickets and parking at each stop are paid on the spot and not included in the tour price."
  ]$$,
  $$[
    "Driver's choice of hidden, photogenic Borobudur backroads",
    "Punthuk Setumbu viewpoint and village home industries",
    "Open-top or canopy-up — your call, any weather"
  ]$$,
  $$["2.5 hours","Up to 4 guests","Daily 08:00 & 14:00"]$$,
  $$An open-top classic Volkswagen, a local driver-guide, and the countryside at an unhurried 30 km/h.$$,
  $$Rp 450.000$$, $$car$$
),
(
  'atv', 4, '04', $$Land · 1.5–3.5 Hours · Family Friendly$$, $$ATV Adventure$$,
  $$Handlebars, mud, and a local guide who knows every shortcut through the paddies, the bamboo forest and the riverside villages around Borobudur.$$,
  $${"image": "https://images.unsplash.com/photo-1506797848948-339596317992?q=80&w=1800&auto=format&fit=crop", "alt": "Rider kicking up dust on an ATV quad bike"}$$,
  $$[
    {"image": "https://plus.unsplash.com/premium_photo-1697730050329-e11a8eb63c69?q=80&w=1200&auto=format&fit=crop", "alt": "Rice paddies crossed on the ATV route"},
    {"image": "https://images.unsplash.com/photo-1631340729644-8b8aad1e9dba?q=80&w=1200&auto=format&fit=crop", "alt": "Borobudur Temple, one of the route's photo stops"}
  ]$$,
  $$Two routes$$, $$Funventure — Nature Explorer$$,
  $$[["Funventure","1.5–2.5 hours · mandala spot, village tour, bee farm"],["Nature Explorer","2.5–3.5 hours · adds Pawon Temple, civet-coffee farm, riverside trail"],["Level","Beginner friendly, guided throughout"],["Includes","ATV, helmet, local guide"],["Meet at","BnB front garden"]]$$,
  $$Rp 300.000$$, $$/ person, Funventure$$, $$Nature Explorer package from Rp 450.000/person — ask us for details$$,
  $$The Experience$$, $$Two routes, one very muddy grin$$,
  $$[
    "Every ATV ride is guided by someone from the village, weaving through rice paddies, a stretch of bamboo forest and a handful of home industries and honey farms along the way — no experience needed, just a helmet and a sense of humour.",
    "Funventure is the shorter loop: a mandala-shaped photo spot, a tour through the village, and a stop at a local bee farm. Nature Explorer runs longer and goes further — the same mandala photo stop, plus a visit to Pawon Temple, a civet-coffee (kopi luwak) home industry, and a stretch tracing the riverbank."
  ]$$,
  $$[
    "Mandala-shaped photo spot on every route",
    "Nature Explorer adds Pawon Temple and a kopi luwak farm visit",
    "Local guide the whole way — no experience required"
  ]$$,
  $$["1.5–3.5 hours","Two route options","Family friendly"]$$,
  $$Guided ATV riding through paddies, bamboo forest and riverside villages — two packages, from a short loop to a longer nature run.$$,
  $$Rp 300.000$$, $$person$$
),
(
  'rafting', 5, '05', $$River · 3 Hours · Grade II–III$$, $$Elo River Rafting$$,
  $$Three hours door-to-door on friendly grade II–III water twenty minutes from the house — big enough to soak you, gentle enough for first-timers and kids.$$,
  $${"image": "https://images.unsplash.com/photo-1599443380179-33737c17ca81?q=80&w=1800&auto=format&fit=crop", "alt": "Group paddling a raft down river rapids"}$$,
  $$[
    {"image": "https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?q=80&w=1200&auto=format&fit=crop", "alt": "Rafting team paddling through white water"},
    {"image": "https://images.unsplash.com/photo-1760904652241-36ad6b4e752f?q=80&w=1200&auto=format&fit=crop", "alt": "Raft manoeuvring past rocks in the rapids"},
    {"image": "https://images.unsplash.com/photo-1629248457649-b082812aea6c?q=80&w=1200&auto=format&fit=crop", "alt": "Paddlers on calm water between rapids"}
  ]$$,
  $$The Elo run$$, $$Grade II–III · ~3 hrs door-to-door$$,
  $$[["Duration","3 hours, door to door"],["River","Elo · grade II–III, safe for children"],["Capacity","Max 4 guests per boat"],["Includes","Pickup & drop-off, guide, toilets & changing rooms, coconut break"],["Level","No experience needed"]]$$,
  $$Rp 350.000$$, $$/ person$$, $$Pickup and drop-off at Borobudur BnB included$$,
  $$The Experience$$, $$The river does the hard work$$,
  $$[
    "We partner with a licensed operator on the Elo — the calmer sibling of the Progo — whose guides are experienced and whose boats carry a maximum of four guests. We pick you up at the house and drop you back at the end, with proper toilet and changing facilities at the start point.",
    "The run alternates splashy rapids with slower pools under bamboo and old bridges; halfway through there’s a break for young coconut water and a snack before the final stretch."
  ]$$,
  $$[
    "Experienced guides, max 4 guests per boat",
    "Young coconut water break mid-river",
    "Pickup and drop-off at Borobudur BnB, included"
  ]$$,
  $$["3 hours","Grade II–III","Max 4 / boat"]$$,
  $$Friendly white water on the Elo River — pickup and drop-off included, plus a riverside coconut stop.$$,
  $$Rp 350.000$$, $$person$$
);

-- ============================================================
-- WORKSHOPS
-- ============================================================
delete from workshops where id in ('batik','pottery','silver','gamelan');

insert into workshops (id, sort_order, media, meta, title, text)
values
(
  'batik', 1,
  $${"image": "https://images.unsplash.com/photo-1721361467569-f8edbf851f44?q=80&w=1200&auto=format&fit=crop", "alt": "Artisan hand-drawing wax batik onto cloth"}$$,
  $$Craft · ~2 hours$$, $$Batik Class$$,
  $$Learn the wax-and-dye technique behind Java's best-known textile art, guided by a local artisan — from sketch to a finished cloth of your own.$$
),
(
  'pottery', 2,
  $${"image": "https://images.unsplash.com/photo-1753164726043-31e583f8a9b8?q=80&w=1200&auto=format&fit=crop", "alt": "Hands shaping clay on a pottery wheel"}$$,
  $$Craft · ~2 hours$$, $$Pottery Workshop$$,
  $$Get your hands into local clay and shape your own piece on the wheel — no experience needed, just patience and a willingness to get a little muddy.$$
),
(
  'silver', 3,
  $${"image": "https://images.unsplash.com/photo-1715374033196-0ff662284a7e?q=80&w=1200&auto=format&fit=crop", "alt": "Craftsperson at work on a piece of jewellery"}$$,
  $$Craft · ~2 hours$$, $$Silver Jewellery Making$$,
  $$Design and make your own ring, earrings or pendant with a local silversmith, using the traditional techniques of nearby workshops — yours to take home.$$
),
(
  'gamelan', 4,
  $${"image": "https://images.unsplash.com/photo-1745575358033-315414a79595?q=80&w=1200&auto=format&fit=crop", "alt": "Traditional Javanese gamelan instruments"}$$,
  $$Craft · ~1.5 hours$$, $$Gamelan Class$$,
  $$Try your hand at gong, kenong and gambang with a local gamelan group, and learn the basics of Java's centuries-old orchestral tradition.$$
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
delete from testimonials where id in (0, 1, 2);

insert into testimonials (id, sort_order, quote, name, place)
values
(
  0, 1,
  $$The sunrise tour alone was worth the flight to Java. Ibu Sri had ginger tea waiting when we got back, and our room looked straight over the rice fields.$$,
  $$Elena Marchetti$$, $$Milan, Italy$$
),
(
  1, 2,
  $$Booked direct on WhatsApp, got a better rate than the booking sites, and the family treated us like relatives. The cottage was perfect for our two kids.$$,
  $$James Tanoto$$, $$Singapore$$
),
(
  2, 3,
  $$Walking distance to the temple meant we skipped the tour-bus traffic entirely. Simple, spotless room, incredible breakfast, and the pool after a hot day.$$,
  $$Sarah Klein$$, $$Melbourne, Australia$$
);

-- ============================================================
-- FACILITIES
-- ============================================================
delete from facilities where no in ('01','02','03','04','05','06','07','08','09','10','11','12','13','14');

insert into facilities (no, sort_order, title, text)
values
('01', 1, $$Sunrise temple tour$$, $$Daily 04:15 guided walk to Borobudur's east gate — included free with every booking.$$),
('02', 2, $$Kolam Kungkum soaking pool$$, $$A cedar soaking tub behind a bamboo screen in the garden — book it for your group, up to six adults.$$),
('03', 3, $$Garden swimming pool$$, $$Freshwater pool open 7 am – 9 pm, framed by frangipani trees and rice-field views.$$),
('04', 4, $$Home-cooked breakfast$$, $$Served 6:30 – 10 am on the veranda: nasi goreng, tropical fruit, Magelang-grown coffee.$$),
('05', 5, $$Free fibre Wi-Fi$$, $$100 Mbps reaching every room, the pool deck and the joglo pavilion.$$),
('06', 6, $$Landscaped garden grounds$$, $$Sprawling lawns, shade trees and quiet corners for a book or a nap between activities.$$),
('07', 7, $$Free private parking$$, $$Gated, on-site parking for cars, scooters and tour vans, watched overnight.$$),
('08', 8, $$Bicycle & scooter rental$$, $$Rp 50K/day bicycles, Rp 90K/day scooters — helmets included, booked at the front desk.$$),
('09', 9, $$Airport & station transfer$$, $$Pickup from Yogyakarta Airport (YIA, ~1 hr) or Tugu Station, arranged on request.$$),
('10', 10, $$Laundry service$$, $$Same-day wash & fold, Rp 20K/kg — handy after a dusty day exploring the region.$$),
('11', 11, $$Joglo common pavilion$$, $$An open-air teak pavilion for breakfast, board games, or an evening beer with other guests.$$),
('12', 12, $$Garden pavilion & celebrations$$, $$Reunions, community retreats and small garden weddings hosted in our pavilion and lawn — ask for a walkthrough.$$),
('13', 13, $$24-hour local hosting$$, $$The family lives on-site — someone is always around for questions, big or small.$$),
('14', 14, $$Travel desk$$, $$Train, bus and driver bookings onward to Yogyakarta, Solo, or the Dieng Plateau.$$);
