import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase, Place } from '@/lib/supabase';
import { calculateDistance } from '@/lib/distance';
import { toSlug } from './PlaceCard'; // adjust path if needed

interface Props {
  currentPlace: Place;
}

export default function NearbyPlaces({ currentPlace }: Props) {
  const [nearby, setNearby] = useState<(Place & { distance: number })[]>([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!currentPlace?.latitude || !currentPlace?.longitude) return;

    async function fetchNearby() {
      const { data } = await supabase.from('places').select('*');

      if (!data) return;

      const results = data
        .filter(
          (p) => p.id !== currentPlace.id && p.latitude != null && p.longitude != null // <-- skip if coordinates missing
        )
        .map((p) => ({
          ...p,
          distance: calculateDistance(currentPlace.latitude!, currentPlace.longitude!, p.latitude!, p.longitude!),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4); // show top 4 closest

      setNearby(results);
    }

    fetchNearby();
  }, [currentPlace]);

  if (!nearby.length) return null;

  return (
    <div className='mt-10'>
      <h2 className='mb-4 text-lg font-semibold'>Nearby Places</h2>

      <div className='flex space-x-4 overflow-x-auto pb-2'>
        {nearby.map((place) => {
          const slug = toSlug(place.name_en ?? place.name_km ?? String(place.id));
          const thumbnail = place.images?.[0] ?? '';

          return (
            <div
              key={place.id}
              onClick={() => navigate(`/details/${slug}?id=${place.id}`)}
              className='min-w-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border transition hover:shadow-lg'
            >
              {thumbnail && <img src={thumbnail} alt={place.name_en} className='h-36 w-full object-cover' />}
              <div className='p-3'>
                <p className='truncate font-medium'>{place.name_en}</p>
                <p className='text-sm text-stone-500'>{place.distance.toFixed(1)} km away</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
