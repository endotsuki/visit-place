import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase, Place } from '@/lib/supabase';
import PlaceCard from './PlaceCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import DraggableCarousel, { CarouselItem } from './carousel';

const PROVINCE_SLIDES: CarouselItem[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80',
    title: 'Siem Reap',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    title: 'Phnom Penh',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1597466765249-b4f7c7c2e069?auto=format&fit=crop&w=1200&q=80',
    title: 'Sihanoukville',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    title: 'Kampot',
  },
];

export default function PlacesPage() {
  const { i18n } = useTranslation();
  const isKhmer = i18n.language === 'km';

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('places')
      .select('*')
      .order('name_en', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPlaces(data as Place[]);
        setLoading(false);
      });
  }, []);

  const filtered = places.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name_en?.toLowerCase().includes(q) ||
      p.name_km?.includes(q) ||
      p.province_en?.toLowerCase().includes(q) ||
      p.province_km?.includes(q)
    );
  });

  return (
    <div className='min-h-screen bg-stone-50 dark:bg-stone-950'>
      <div className='mx-auto max-w-3xl px-4 py-6 sm:px-6'>
        {/* Carousel */}
        <div className='mb-6'>
          <DraggableCarousel items={PROVINCE_SLIDES} height={220} />
        </div>

        {/* Page heading */}
        <div className='mb-4'>
          <p className='text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-500'>
            {isKhmer ? 'ស្វែងរក' : 'Explore'}
          </p>
          <h1 className='mt-0.5 text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50'>
            {isKhmer ? 'ទីតាំងទេសចរណ៍' : 'Places to Discover'}
          </h1>
        </div>

        {/* Search */}
        <div className='relative mb-4'>
          <HugeiconsIcon icon={Search01Icon} className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isKhmer ? 'ស្វែងរកទីតាំង...' : 'Search places...'}
            className='w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-9 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500'
          />
          {search && (
            <button onClick={() => setSearch('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600'>
              <HugeiconsIcon icon={Cancel01Icon} className='h-3.5 w-3.5' />
            </button>
          )}
        </div>

        {/* Count */}
        <p className='mb-3 text-[11px] font-medium text-stone-400 dark:text-stone-500'>
          {filtered.length} {isKhmer ? 'ទីតាំង' : 'places'}
          {search && ` ${isKhmer ? 'រកឃើញ' : 'found'}`}
        </p>

        {/* Cards */}
        {loading ? (
          <div className='flex flex-col gap-3'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='h-[108px] animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800'
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-2 py-20 text-center'>
            <p className='text-sm font-medium text-stone-400'>{isKhmer ? 'រកមិនឃើញ' : 'No places found'}</p>
            <p className='text-xs text-stone-300 dark:text-stone-600'>{isKhmer ? 'សាកល្បងពាក្យផ្សេង' : 'Try a different search term'}</p>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {filtered.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035, duration: 0.3 }}
              >
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
