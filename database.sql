-- ============================================
-- Cambodia Travel Website Database Schema
-- ============================================
-- Copy and paste this entire content into your Supabase SQL Editor
-- Then click "Run" to create the database schema
-- ============================================

-- Create the places table
create table if not exists places (
  id uuid default gen_random_uuid() primary key,
  name_km text not null,
  name_en text not null,
  province_km text not null,
  province_en text not null,
  description_km text not null,
  description_en text not null,
  keywords text[] default array[]::text[],
  coordinates jsonb default null,
  map_link text not null,
  images text[] default array[]::text[],
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create an index for better search performance
create index if not exists places_keywords_idx on places using gin(keywords);
create index if not exists places_province_km_idx on places(province_km);
create index if not exists places_province_en_idx on places(province_en);
create index if not exists places_name_km_idx on places(name_km);
create index if not exists places_name_en_idx on places(name_en);

-- Enable Row Level Security
alter table places enable row level security;

-- Allow public read access to all places
create policy "Allow public read access"
on places for select
using (true);

-- Allow authenticated users to insert places
create policy "Allow authenticated insert"
on places for insert
with check (auth.uid() is not null);

-- Allow authenticated users to update places
create policy "Allow authenticated update"
on places for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- Allow authenticated users to delete places
create policy "Allow authenticated delete"
on places for delete
using (auth.uid() is not null);

-- ============================================
-- SAMPLE DATA (Optional)
-- Uncomment the INSERT statements below to add sample places
-- ============================================

-- -- Angkor Wat, Siem Reap
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'អង្គរវត្ត', 'Angkor Wat',
--   'សៀមរាប', 'Siem Reap',
--   'អង្គរវត្តគឺជាប្រាសាទដ៏ធំបំផុតក្នុងពិភពលោក សាងសង់ក្នុងសតវត្សរ៍ទី១២ ជាមរតកពិភពលោករបស់យូណេស្កូ។',
--   'Angkor Wat is the largest religious monument in the world, built in the early 12th century and designated a UNESCO World Heritage Site.',
--   ARRAY['temple', 'ancient', 'heritage', 'UNESCO', 'cultural', 'landmark'],
--   'https://maps.google.com/?q=13.3667,103.8667',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Angkor_Wat_Temple.jpg/1280px-Angkor_Wat_Temple.jpg'],
--   314
-- );

-- -- Royal Palace, Phnom Penh
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'វិមានព្រះបរមរាជវាំង', 'Royal Palace',
--   'ភ្នំពេញ', 'Phnom Penh',
--   'វិមានព្រះបរមរាជវាំងគឺជាបេតិកភណ្ឌដ៏ស្រស់ស្អាតនៃស្ថាបត្យកម្មខ្មែរបុរាណ ស្ថិតនៅក្នុងរាជធានីភ្នំពេញ។',
--   'The Royal Palace is a stunning complex of Khmer classical architecture and the official residence of the King of Cambodia in Phnom Penh.',
--   ARRAY['palace', 'royal', 'historic', 'architecture', 'cultural'],
--   'https://maps.google.com/?q=11.5564,104.9282',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Royal_Palace%2C_Phnom_Penh.jpg/1280px-Royal_Palace%2C_Phnom_Penh.jpg'],
--   0
-- );

-- -- Tonlé Sap Lake, Siem Reap
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'បឹងទន្លេសាប', 'Tonlé Sap Lake',
--   'សៀមរាប', 'Siem Reap',
--   'បឹងទន្លេសាបគឺជាបឹងទឹកសាប់ធំបំផុតនៅអាស៊ីអាគ្នេយ៍ ហើយជាទីលំនៅរបស់សហគមន៍រស់នៅលើទឹក។',
--   'Tonlé Sap is the largest freshwater lake in Southeast Asia, a UNESCO Biosphere Reserve supporting floating villages and rich wildlife.',
--   ARRAY['lake', 'nature', 'wildlife', 'floating village', 'UNESCO', 'ecosystem'],
--   'https://maps.google.com/?q=12.8,104.85',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Tonle_Sap_Lake.jpg/1280px-Tonle_Sap_Lake.jpg'],
--   295
-- );

-- -- Bayon Temple, Siem Reap
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'ប្រាសាទបាយ័ន', 'Bayon Temple',
--   'សៀមរាប', 'Siem Reap',
--   'ប្រាសាទបាយ័នល្បី​ល្បាញ​ដោយ​មុខ​ព្រះ​ស្រណោះ​ជាច្រើន​រាប់ ដែល​ត្រូវ​បាន​ចែក​ចាយ​ពេញ​ប្រាសាទ​ ស្ថិតនៅ​ក​ណ្ដាល​នគរ​អង្គរ​ធំ​។',
--   'Bayon Temple is renowned for its massive stone faces carved across its towers, located at the center of the ancient city of Angkor Thom.',
--   ARRAY['temple', 'ancient', 'heritage', 'sculpture', 'Angkor', 'cultural'],
--   'https://maps.google.com/?q=13.4413,103.8591',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Bayon_Temple%2C_Angkor_Thom.jpg/1280px-Bayon_Temple%2C_Angkor_Thom.jpg'],
--   314
-- );

-- -- Preah Vihear Temple, Preah Vihear
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'ប្រាសាទព្រះវិហារ', 'Preah Vihear Temple',
--   'ព្រះវិហារ', 'Preah Vihear',
--   'ប្រាសាទព្រះវិហារតាំងនៅលើខ្ពង់រាបដ៏ខ្ពស់នៃជួរភ្នំដងរែក ជាមរតកពិភពលោករបស់យូណេស្កូ ដែលមានទេសភាពដ៏អស្ចារ្យ។',
--   'Preah Vihear Temple sits atop the Dangrek Mountains and is a UNESCO World Heritage Site offering breathtaking views over the Cambodian plains.',
--   ARRAY['temple', 'ancient', 'UNESCO', 'mountain', 'heritage', 'scenic'],
--   'https://maps.google.com/?q=14.3944,104.6814',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Prasat_Preah_Vihear.jpg/1280px-Prasat_Preah_Vihear.jpg'],
--   480
-- );

-- -- Kep Beach, Kep
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'កំពង់សោម', 'Kep Beach',
--   'កែប', 'Kep',
--   'កែបគឺជាទីក្រុងឈ្នាន់ល្បីដ៏ស្ងប់ស្ងាត់ ល្បីដោយអាហារសមុទ្រស្រស់ ជាពិសេសសំបកក្ដាមជូ ហើយមានអ្នកទេសចរចូលចិត្ត។',
--   'Kep is a tranquil coastal town famous for its fresh seafood, especially pepper crab, beautiful beaches, and relaxed atmosphere.',
--   ARRAY['beach', 'seafood', 'coastal', 'relaxing', 'nature', 'crab'],
--   'https://maps.google.com/?q=10.4833,104.3167',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Kep_Beach_Cambodia.jpg/1280px-Kep_Beach_Cambodia.jpg'],
--   172
-- );

-- -- Sihanoukville Beach, Sihanoukville
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'ក្រុងព្រះសីហនុ', 'Sihanoukville Beach',
--   'ព្រះសីហនុ', 'Sihanoukville',
--   'ក្រុងព្រះសីហនុមានឆ្នេរខ្សាច់ស ទឹកសមុទ្រថ្លា និងកោះជាច្រើន ល្អសម្រាប់ការស្ងប់ស្ងាត់និងកំសាន្ត។',
--   'Sihanoukville offers white sandy beaches, crystal-clear waters, and nearby islands perfect for snorkeling, diving, and relaxing.',
--   ARRAY['beach', 'island', 'diving', 'snorkeling', 'coastal', 'resort'],
--   'https://maps.google.com/?q=10.6293,103.5228',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ochheuteal_Beach.jpg/1280px-Ochheuteal_Beach.jpg'],
--   230
-- );

-- -- Kampot, Kampot
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'កំពត', 'Kampot',
--   'កំពត', 'Kampot',
--   'កំពតគឺជាខេត្តប្រវត្តិសាស្ត្រ ល្បីដោយម្រេចកំពតដ៏ល្បីឈ្មោះ ទេសភាពភ្នំ និងស្ទឹងស្ងប់ស្ងាត់ ល្អសម្រាប់ការសម្រាក។',
--   'Kampot is a charming riverside town famous for its world-renowned Kampot pepper, French colonial architecture, and relaxed atmosphere.',
--   ARRAY['riverside', 'pepper', 'colonial', 'nature', 'relaxing', 'scenic'],
--   'https://maps.google.com/?q=10.6167,104.1833',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kampot_River.jpg/1280px-Kampot_River.jpg'],
--   148
-- );

-- -- Phnom Kulen, Siem Reap
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'ភ្នំគូលែន', 'Phnom Kulen',
--   'សៀមរាប', 'Siem Reap',
--   'ភ្នំគូលែនគឺជាតំបន់ពិសិដ្ឋសម្រាប់ជនជាតិខ្មែរ ល្បីដោយទឹកធ្លាក់ ព្រះព្ទុំ និងប្រាសាទបុរាណ ស្ថិតនៅជើងសហគ្រាសអង្គរ។',
--   'Phnom Kulen is a sacred plateau revered by Khmer people, featuring stunning waterfalls, a reclining Buddha, and ancient temples above the Angkor plain.',
--   ARRAY['mountain', 'waterfall', 'sacred', 'nature', 'Buddha', 'temple'],
--   'https://maps.google.com/?q=13.5667,104.0833',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Phnom_Kulen_Waterfall.jpg/1280px-Phnom_Kulen_Waterfall.jpg'],
--   355
-- );

-- -- Bamboo Train, Battambang
-- INSERT INTO places (name_km, name_en, province_km, province_en, description_km, description_en, keywords, map_link, images, distance_from_pp)
-- VALUES (
--   'រថភ្លើងបំបែក បាត់ដំបង', 'Bamboo Train Battambang',
--   'បាត់ដំបង', 'Battambang',
--   'រថភ្លើងបំបែកជាការធ្វើដំណើរប្លែកៗ ជិះលើខ្នើយចំការ​ ហើរពេញផ្លូវដែកដ៏ចំណាស់ ជាប្រសព្វសង្ស័យខ្លាំងដើម្បីទេសចរ។',
--   'The Bamboo Train is a unique local experience — riding bamboo platforms on old railway tracks through the Cambodian countryside near Battambang.',
--   ARRAY['unique', 'adventure', 'train', 'countryside', 'cultural', 'experience'],
--   'https://maps.google.com/?q=13.0957,103.2022',
--   ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bamboo_train_battambang.jpg/1280px-Bamboo_train_battambang.jpg'],
--   291
-- );

-- ============================================
-- TO USE THIS FILE:
-- ============================================
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire file (or parts of it)
-- 5. Click "Run" button
-- 6. The schema will be created
-- 7. To add sample data, uncomment the INSERT statements above
--
-- ADMIN USER SETUP (Super Simple!):
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter email and password
-- 4. Click "Create User"
-- 5. They can now login to /admin/login with full access!
-- ============================================
