# Cambodia Travel Website - Setup Guide

Your React Vite application is now complete with authentication, admin panel, light/dark theme, and Google Maps integration! Follow these steps to get everything working.

## Quick Start

1. **Copy `database.sql` content** → Paste into Supabase SQL Editor → Click Run ⚡
2. **Create admin user** in Supabase Authentication and add `{"role": "admin"}` metadata
3. **Set environment variables** from `.env.example`
4. **Visit `/admin/login`** and login with your admin credentials
5. **Done!** Your site is ready to use

---

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project (choose a region closest to Cambodia or Asia)
3. Copy your project credentials:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

### Enable Authentication
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Enable **Email/Password** provider
3. Go to **Authentication** → **Providers** and make sure Email is enabled

### Create the Database Schema

**Easy Method:**
1. Open the `database.sql` file in your project root
2. Go to your Supabase dashboard → **SQL Editor**
3. Click **New Query**
4. Copy the entire content from `database.sql`
5. Paste into the SQL Editor
6. Click **Run**

The schema and security policies will be created automatically!

**Manual Method (if you prefer):**

In your Supabase dashboard, open the SQL Editor and run:

```sql
-- Create the places table
create table places (
  id uuid default gen_random_uuid() primary key,
  name_km text not null,
  name_en text not null,
  province_km text not null,
  province_en text not null,
  category text default '',
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
create index places_keywords_idx on places using gin(keywords);

-- Enable Row Level Security (optional but recommended)
alter table places enable row level security;

-- Allow public read access
create policy "Allow public read access"
on places for select
using (true);

-- You can add insert/update/delete policies for admin users later
```

### Add Admin Users
1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** and create admin account(s)
3. Once created, click the user → **User metadata** and add:
```json
{
  "role": "admin"
}
```

This marks them as admins and gives them access to `/admin` dashboard.

## 2. Cloudinary Setup

Cloudinary handles image storage and optimization (converts to WebP, resizes to 1280x1280).

### Get Cloudinary Credentials
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard to find:
   - **Cloud Name** (VITE_CLOUDINARY_CLOUD_NAME)
   
### Create Upload Preset
1. Go to Settings → Upload → Upload presets
2. Create a new unsigned preset (name: `cambodia_travel` or similar)
3. Copy the preset name (VITE_CLOUDINARY_UPLOAD_PRESET)

This allows the frontend to upload directly without exposing your API key.

## 3. Google Maps Setup

For distance calculations and map links.

### Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
4. Create an API key (Credentials → Create Credentials → API Key)
5. Restrict it to your domain (for security)
6. Copy the key (VITE_GOOGLE_MAPS_API_KEY)

## 4. Environment Variables

### Add to `.env` file (create if it doesn't exist):

```env
# Supabase
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=cambodia_travel

# Optional: Service role key for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 5. Features Overview

### Homepage (`/`)
- **Search bar** - Filter by place name or province
- **Province filter** - Dropdown to select specific provinces
- **Keywords search** - Find places by tags
- **Geolocation** - Ask permission to calculate distances
- **Place cards** - Grid display with:
  - Image carousel
  - Place name & province (in selected language)
  - **Smart distance display**:
    - Shows distance from your current location (if permission granted)
    - Falls back to distance from Phnom Penh (if location denied)
  - "Open in Google Maps" button

### Admin Login Page (`/admin/login`) - Protected
- **Secure login** - Email and password authentication
- **Role-based access** - Only users with `admin` role can access dashboard
- **Auto-redirect** - Logged-in admins bypass login page
- **Logout button** - Available in dashboard header

### Admin Page (`/admin`) - Protected
- **Admin-only access** - Only users with `admin` role can access
- **CRUD operations** - Create, edit, delete places
- **Image upload** - Multiple images per place
  - Automatically optimized via Cloudinary
  - Converted to WebP format
  - Resized to 1280x1280
- **Bilingual support** - Enter content in both Khmer and English
- **Keywords** - Add searchable tags
- **Map link** - Google Maps URL for each place
- **Coordinates** - Latitude/longitude for distance calculations

### Language Switcher
- **Top-right navigation** - Switch between Khmer (ខ្មែរ) and English
- **Khmer font** - Inter Khmer Looped for beautiful Khmer text
- **Persistent** - Language preference saved to localStorage

### Theme Toggle
- **Light/Dark mode** - Click moon/sun icon in header
- **Persistent** - Theme preference saved to localStorage
- **System preference support** - Automatically uses system preference on first visit
- **Beautiful dark theme** - Optimized colors for both light and dark modes

## 6. Sample Place Data

To test the app, add a few places in the admin panel:

**Example: Angkor Wat**
- Name (KM): អង្គរវត្ត
- Name (EN): Angkor Wat
- Province (KM): សៀមរាប
- Province (EN): Siem Reap
- Coordinates: 13.3667, 103.8667
- Keywords: temple, ancient, heritage, UNESCO
- Map Link: https://maps.google.com/?q=13.3667,103.8667

## 7. Deployment

Once configured, deploy to:

- **Netlify** - Use the [Netlify MCP integration](#open-mcp-popover)
- **Vercel** - Use the [Vercel MCP integration](#open-mcp-popover)
- **Any Node.js host** - Run `pnpm build && pnpm start`

## 8. Creating Admin Users

### Simple 2-Step Setup:

1. **Create User in Supabase**
   - Go to your Supabase dashboard
   - Navigate to **Authentication** → **Users**
   - Click **Add User**
   - Enter email and password
   - Click **Create User**

2. **They can now login**
   - User visits `/admin/login`
   - Enters email and password
   - Gets instant full admin access!

### That's it! No complicated role setup needed!

✅ **Login page** (`/admin/login`)
- Simple email/password login
- Secure Supabase authentication
- Instant admin access on login

Multiple admins? Just create more users in Supabase!

## 9. Theme Support

### Light/Dark Mode
- **Automatic detection** - Uses system preference on first visit
- **Manual toggle** - Click moon/sun icon in header
- **Persistent** - Theme preference saved to localStorage
- **Supports Khmer** - Beautiful typography in both themes

### How It Works
- Light theme: Soft beige background with warm orange accent colors
- Dark theme: Dark blue-gray background with the same vibrant colors

## 11. Security Notes

### Already Implemented:
1. ✅ **Supabase Auth** - Secure email/password authentication
2. ✅ **Admin-only access** - Only users with `admin` role can access `/admin`
3. ✅ **RLS Policies** - Database security rules included in schema
4. ✅ **Role-based access** - Verified on both frontend and database level

### For Production Deployment:
1. **Environment variables** - Never commit `.env` to git (use `.env.example` for reference)
2. **API key restrictions** - Restrict Google Maps key to your domain
3. **Cloudinary security** - Keep upload preset unsigned but monitor usage
4. **Supabase security** - Keep service role key secure (never expose to frontend)
5. **HTTPS** - Always deploy with HTTPS enabled
6. **Session management** - Supabase handles session security automatically

## 12. Next Steps

1. ✅ Commit your changes
2. ✅ Set up environment variables
3. ✅ Test with sample data
4. ✅ Add more places through the admin panel
5. ✅ Customize colors in `tailwind.config.ts` if desired
6. ✅ Deploy!

## 13. Troubleshooting

### Images not uploading?
- Check Cloudinary credentials in `.env`
- Verify upload preset exists
- Check browser console for API errors

### Distances not showing?
- The app shows two types of distances:
  - **User location**: If location permission is granted, shows distance from their current location
  - **Fallback**: If location is denied, shows estimated distance from Phnom Penh
- Verify Google Maps API key is valid
- Check that coordinates are correct in database
- Make sure place has valid latitude/longitude in Supabase

### Language not switching?
- Clear browser localStorage
- Check browser console for i18n errors

### Places not appearing?
- Verify Supabase connection in `.env`
- Check that places table has data
- Verify RLS policies allow read access

### Admin login not working?
- Verify user exists in Supabase Authentication
- Check that user has `role: "admin"` in User Metadata
- Clear browser localStorage and try again
- Check browser console for error messages

### Cannot access `/admin`?
- Make sure you're logged in at `/admin/login` first
- Verify your user has admin role in Supabase
- Non-admin users are automatically redirected to home

### Theme not persisting?
- Check that localStorage is enabled in browser
- Clear browser cache/cookies and try again
- System preference will be used as fallback

## Support

For issues:
- **Supabase Docs**: https://supabase.com/docs
- **Google Maps**: https://developers.google.com/maps
- **Cloudinary**: https://cloudinary.com/documentation

Happy building! 🇰🇭
