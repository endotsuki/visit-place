import { useState, useEffect } from 'react';
import { supabase, Place } from '@/lib/supabase';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function usePlaces() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('places').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load places');
    else setPlaces((data ?? []) as Place[]);
    setLoading(false);
  }

  async function remove(place: Place) {
    // delete images first
    await deleteFromCloudinary(place.images ?? []);

    // then delete DB row
    const { error } = await supabase.from('places').delete().eq('id', place.id);

    if (error) {
      toast.error('Failed to delete');
      return;
    }

    toast.success('Place deleted');
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return { places, loading, load, remove };
}
