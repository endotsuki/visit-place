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

-- Insert sample: Angkor Wat
-- insert into places (
--   name_km, name_en,
--   province_km, province_en,
--   description_km, description_en,
--   keywords,
--   coordinates,
--   map_link,
--   images
-- ) values (
--   'អង្គរវត្ត', 'Angkor Wat',
--   'សៀមរាប', 'Siem Reap',
--   'អង្គរវត្តគឺជាប្រាសាទលោកដែលបង្កើតឡើងក្នុងសតវត្សរ៍ទី១២ និងជាកម្ពីលរបស់ខ្មែរ។ វាគឺជាបេតិកភណ្ឌដ៏ធំឡាយបំផុត និងល្អបំផុតក្នុងពិភពលោក។',
--   'Angkor Wat is the largest religious monument in the world and was built in the early 12th century as a Hindu temple dedicated to Vishnu, later transformed into a Buddhist temple.',
--   array['temple', 'ancient', 'heritage', 'UNESCO', 'cultural'],
--   '{"lat": 13.3667, "lng": 103.8667}'::jsonb,
--   'https://maps.google.com/?q=13.3667,103.8667',
--   array[
--     'https://res.cloudinary.com/demo/image/upload/w_1280,h_1280,c_fill,f_webp/angkor_wat_1.jpg',
--     'https://res.cloudinary.com/demo/image/upload/w_1280,h_1280,c_fill,f_webp/angkor_wat_2.jpg'
--   ]
-- );

-- Insert sample: Royal Palace
-- insert into places (
--   name_km, name_en,
--   province_km, province_en,
--   description_km, description_en,
--   keywords,
--   coordinates,
--   map_link,
--   images
-- ) values (
--   'វិមាននរបស់ព្រះមហាក្សត្រ', 'Royal Palace',
--   'ភ្នំពេញ', 'Phnom Penh',
--   'វិមាននរបស់ព្រះមហាក្សត្រគឺជាផ្នែកសំខាន់មួយនៃម្ទឹងផ្សាយពន្លឺរបស់កម្ពុជា ដែលបង្ហាញពីលក្ខណៈស្ថាបត្យកម្មបុរាណនិងទំនើប។',
--   'The Royal Palace is an important landmark in Phnom Penh, showcasing a blend of ancient and modern Khmer architecture. It remains a symbol of Cambodia''s rich cultural heritage.',
--   array['palace', 'royal', 'historic', 'architecture'],
--   '{"lat": 11.5564, "lng": 104.9282}'::jsonb,
--   'https://maps.google.com/?q=11.5564,104.9282',
--   array[
--     'https://res.cloudinary.com/demo/image/upload/w_1280,h_1280,c_fill,f_webp/royal_palace_1.jpg'
--   ]
-- );

-- Insert sample: Tonlé Sap Lake
-- insert into places (
--   name_km, name_en,
--   province_km, province_en,
--   description_km, description_en,
--   keywords,
--   coordinates,
--   map_link,
--   images
-- ) values (
--   'ភ្នំពេញលេក', 'Tonlé Sap Lake',
--   'សៀមរាប', 'Siem Reap',
--   'បឹងទន្លេសាប់គឺជាបឹងធំបំផុតក្នុងអាស៊ីអាគ្នេយ៍។ វាមាន្រទាង់ក្នុងឆ្នាំ ហើយក្រុមប្រជាជនក្នុងតំបន់នេះសម្រាក់លើទឹក។',
--   'Tonlé Sap Lake is the largest freshwater lake in Southeast Asia and a UNESCO Biosphere Reserve. It supports a unique ecosystem and floating communities.',
--   array['lake', 'nature', 'wildlife', 'ecosystem'],
--   '{"lat": 12.8, "lng": 104.85}'::jsonb,
--   'https://maps.google.com/?q=12.8,104.85',
--   array[
--     'https://res.cloudinary.com/demo/image/upload/w_1280,h_1280,c_fill,f_webp/tonle_sap_1.jpg'
--   ]
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
