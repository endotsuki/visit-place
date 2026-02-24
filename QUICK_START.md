# Cambodia Travel Website - Quick Start

## What's New ✨

### ✅ Admin Login Page (`/admin/login`)
- Beautiful secure login interface
- Email/Password authentication
- Auto-redirects logged-in admins to dashboard
- Only users with `admin` role can access

### ✅ Light & Dark Theme
- Click moon/sun icon in header to toggle
- Automatic system preference detection
- Beautiful colors in both modes
- Saves preference to localStorage

### ✅ SQL Schema File
- `database.sql` - Ready-to-use database schema
- Copy → Paste → Run in Supabase SQL Editor
- Includes security policies and indexes

---

## 🚀 Setup in 5 Minutes

### Step 1: Create Database Schema
1. Open `database.sql` in your project
2. Go to [Supabase Dashboard](https://supabase.com) → **SQL Editor**
3. Click **New Query**
4. Copy entire `database.sql` content
5. Paste into SQL Editor
6. Click **Run** button

### Step 2: Create Admin User (Super Easy!)
1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Click **Create User**
5. Done! They're an admin!

### Step 3: Set Environment Variables
Copy this to your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Step 4: Test It Out
1. Go to `/admin/login`
2. Login with your admin credentials
3. Add a place with images
4. Go to `/` and see it appear!

---

## 📁 Files Created/Modified

### New Files
- `database.sql` - Database schema with RLS policies
- `client/pages/AdminLogin.tsx` - Admin login page
- `client/lib/theme.ts` - Theme management utilities
- `client/components/ThemeProvider.tsx` - Theme context provider
- `client/lib/auth.ts` - Auth helper functions
- `QUICK_START.md` - This file

### Modified Files
- `client/App.tsx` - Added theme provider and login route
- `client/pages/Admin.tsx` - Added authentication check
- `client/components/Layout.tsx` - Added theme toggle button
- `client/global.css` - Added dark theme colors
- `SETUP_GUIDE.md` - Updated with all new features

---

## 🔐 How It Works

### Authentication Flow
```
User visits /admin
    ↓
Not logged in? → Redirect to /admin/login
    ↓
Show login page
    ↓
User enters credentials
    ↓
Verify against Supabase Auth
    ↓
Check if user has "admin" role
    ↓
✅ Admin? → Allow access to /admin
❌ Not admin? → Sign out and show error
```

### Theme System
```
App loads
    ↓
Check localStorage for saved theme
    ↓
No saved theme? → Check system preference
    ↓
Apply theme to <html> element
    ↓
User can toggle with moon/sun button
    ↓
Theme saved to localStorage
```

---

## 🎨 Features

### Admin-Only Dashboard (`/admin`)
- ✅ Create places with images
- ✅ Edit existing places
- ✅ Delete places
- ✅ Upload images to Cloudinary
- ✅ Add keywords and coordinates
- ✅ Bilingual support (Khmer/English)
- ✅ Logout button

### Homepage (`/`)
- ✅ Search by name/province
- ✅ Filter by keywords
- ✅ Show distance from user location
- ✅ Fallback to Phnom Penh distance
- ✅ Image carousel on place cards
- ✅ Open in Google Maps button
- ✅ Language toggle (Khmer/English)
- ✅ Dark/Light theme toggle

---

## 🛡️ Security

- Supabase Auth protects the admin panel
- Only admin-role users can access `/admin`
- Database policies restrict write access
- RLS (Row Level Security) enabled
- No public can modify places (read-only)

---

## 📱 Responsive Design

Everything works on:
- ✅ Mobile phones
- ✅ Tablets
- ✅ Desktops
- ✅ All screen sizes

---

## 🆘 Quick Troubleshooting

**"Can't login?"**
- Make sure user exists in Supabase Authentication
- Check that user has `role: "admin"` in metadata
- Try clearing browser cache

**"Admin link doesn't appear?"**
- You're not logged in - go to `/admin/login` first
- Login with your admin credentials

**"Images not uploading?"**
- Check Cloudinary configuration in `.env`
- Verify upload preset exists

**"Distances not showing?"**
- If location denied, it shows Phnom Penh distance (normal)
- If still not working, check Google Maps API key

**"Theme not saving?"**
- Check browser allows localStorage
- Clear cache and try again

---

## 📚 Documentation

- `SETUP_GUIDE.md` - Complete setup instructions
- `database.sql` - Database schema with comments
- Code comments throughout for clarity

---

## 🎯 What's Included

✅ Admin authentication system
✅ Admin login page with error handling
✅ Admin dashboard with CRUD operations
✅ Light & Dark theme toggle
✅ Database schema (SQL file)
✅ Security policies (RLS)
✅ Responsive design
✅ Bilingual support (Khmer/English)
✅ Image upload to Cloudinary
✅ Google Maps integration
✅ Geolocation with Phnom Penh fallback
✅ Beautiful modern design
✅ Fully TypeScript typed

---

## 🚀 Ready to Deploy?

1. Set all environment variables on your hosting provider
2. Deploy to Netlify or Vercel (see [Open MCP popover](#open-mcp-popover))
3. Create admin users in your Supabase project
4. You're live!

---

## ❓ Need Help?

- **SETUP_GUIDE.md** - Detailed setup instructions
- **database.sql** - Copy-paste ready schema
- **Code comments** - Throughout the codebase
- **Supabase docs** - https://supabase.com/docs
- **Google Maps** - https://developers.google.com/maps

Happy coding! 🇰🇭
