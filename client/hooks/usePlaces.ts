// hooks/usePlaces.ts

import { useState, useEffect } from "react";
import { supabase, Place } from "@/lib/supabase";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function usePlaces() {
  const { t } = useTranslation();
  const [places, setPlaces]   = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("places").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load places");
    else setPlaces((data ?? []) as Place[]);
    setLoading(false);
  }

  async function remove(place: Place) {
    if (!confirm(t("deletePlace"))) return;

    // 1. Delete the Supabase record first
    const { error } = await supabase.from("places").delete().eq("id", place.id);
    if (error) { toast.error("Failed to delete"); return; }

    // 2. Now delete all its images from Cloudinary
    await deleteFromCloudinary(place.images ?? []);

    toast.success("Place deleted");
    load();
  }

  useEffect(() => { load(); }, []);

  return { places, loading, load, remove };
}