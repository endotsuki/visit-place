import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase URL or key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Place {
  id: string;
  name_km: string;
  name_en: string;
  province_km: string;
  province_en: string;
  description_km: string;
  description_en: string;
  keywords: string[];
  distance_from_pp?: number;
  map_link: string;
  images: string[];
  created_at: string;
}
