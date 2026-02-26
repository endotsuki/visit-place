import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { supabase, Place } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, Navigation03Icon, MapsSquare02Icon, Image01Icon } from '@hugeicons/core-free-icons';
import { Button } from './ui/button';

// ─── tiny hook to parse ?id= from the URL ────────────────────────────────────
function useQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

// ─── Image carousel ───────────────────────────────────────────────────────────
function Gallery({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const total = images.length;

  function go(next: number) {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  }

  const variants = {
    enter: (d: number) => ({ x: d * 80, opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: (d: number) => ({ x: d * -80, opacity: 0, scale: 0.97, transition: { duration: 0.3 } }),
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Hero image */}
      <div className='group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-900 lg:aspect-[21/9]'>
        <AnimatePresence custom={dir} mode='popLayout'>
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${name} ${idx + 1}`}
            custom={dir}
            initial='enter'
            animate='center'
            exit='exit'
            className='absolute inset-0 h-full w-full object-cover'
          />
        </AnimatePresence>

        {/* Gradient */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10' />

        {/* Counter */}
        {total > 1 && (
          <div className='absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md'>
            {idx + 1} / {total}
          </div>
        )}

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => go((idx - 1 + total) % total)}
              className='absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/45 group-hover:opacity-100'
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className='h-5 w-5' />
            </button>
            <button
              onClick={() => go((idx + 1) % total)}
              className='absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/45 group-hover:opacity-100'
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className='h-5 w-5' />
            </button>
          </>
        )}

        {/* Dot nav */}
        {total > 1 && (
          <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5'>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-1'>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                i === idx ? 'border-primary opacity-100 shadow-md' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={src} alt='' className='h-full w-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className='animate-pulse space-y-6'>
      <div className='aspect-[16/9] w-full rounded-2xl bg-stone-200 dark:bg-stone-800 lg:aspect-[21/9]' />
      <div className='space-y-3'>
        <div className='h-3 w-24 rounded-full bg-stone-200 dark:bg-stone-800' />
        <div className='h-8 w-3/4 rounded-xl bg-stone-200 dark:bg-stone-800' />
        <div className='h-4 w-1/3 rounded-full bg-stone-200 dark:bg-stone-800' />
      </div>
      <div className='space-y-2'>
        {[100, 90, 95, 80].map((w, i) => (
          <div key={i} className='h-4 rounded-full bg-stone-200 dark:bg-stone-800' style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DetailsPage() {
  const { i18n, t } = useTranslation();
  const [, navigate] = useLocation();
  const id = useQueryParam('id');
  const isKhmer = i18n.language === 'km';

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setPlace(data as Place);
        setLoading(false);
      });
  }, [id]);

  const name = isKhmer ? place?.name_km : place?.name_en;
  const province = isKhmer ? place?.province_km : place?.province_en;
  const description = isKhmer ? place?.description_km : place?.description_en;
  const images: string[] = place?.images ?? [];

  return (
    <div className='min-h-screen bg-stone-50 dark:bg-stone-950'>
      {/* ── Top bar ── */}
      <div className='sticky top-0 z-30 border-b border-stone-200/60 bg-white/90 backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-950/90'>
        <div className='mx-auto flex h-14 max-w-5xl items-center gap-3 px-5'>
          <Button
            onClick={() => navigate('/')}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className='h-4 w-4' />
            {t('home')}
          </Button>

          {place && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className='min-w-0'>
              <p className='truncate text-sm font-semibold text-stone-700 dark:text-stone-200'>{name}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className='mx-auto max-w-5xl px-5 py-8 sm:px-8'>
        {loading ? (
          <Skeleton />
        ) : notFound ? (
          <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800'>
              <HugeiconsIcon icon={MapsSquare02Icon} className='h-9 w-9 text-stone-300 dark:text-stone-600' />
            </div>
            <p className='text-lg font-semibold text-stone-500 dark:text-stone-400'>{isKhmer ? 'រកមិនឃើញទីតាំង' : 'Place not found'}</p>
            <Button
              onClick={() => navigate('/')}
            >
              {t('home')}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className='space-y-8'
          >
            {/* Gallery */}
            {images.length > 0 ? (
              <Gallery images={images} name={name ?? ''} />
            ) : (
              <div className='flex aspect-[16/9] items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800'>
                <HugeiconsIcon icon={Image01Icon} className='h-12 w-12 text-stone-300 dark:text-stone-600' />
              </div>
            )}

            {/* Header */}
            <div className='space-y-2'>
              <p className='text-[11px] font-bold uppercase tracking-[0.18em] text-primary dark:text-primary/80'>{province}</p>
              <h1 className='text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl'>{name}</h1>

              {/* Meta row */}
              <div className='flex flex-wrap items-center gap-3 pt-1'>
                {place?.distance_from_pp != null && place.distance_from_pp > 0 && (
                  <div className='flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 dark:border-stone-700 dark:bg-stone-900'>
                    <HugeiconsIcon icon={Navigation03Icon} className='h-3.5 w-3.5 text-primary' />
                    <span className='text-xs font-semibold text-stone-600 dark:text-stone-300'>
                      {place.distance_from_pp} km {isKhmer ? 'ពីភ្នំពេញ' : 'from Phnom Penh'}
                    </span>
                  </div>
                )}
                {images.length > 0 && (
                  <div className='flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 dark:border-stone-700 dark:bg-stone-900'>
                    <HugeiconsIcon icon={Image01Icon} className='h-3.5 w-3.5 text-primary' />
                    <span className='text-xs font-semibold text-stone-600 dark:text-stone-300'>
                      {images.length} {isKhmer ? 'រូបភាព' : images.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className='h-px bg-stone-200 dark:bg-stone-800' />

            {/* Description */}
            {description && (
              <div className='space-y-2'>
                <h2 className='text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500'>
                  {isKhmer ? 'អំពីទីតាំង' : 'About this place'}
                </h2>
                <p className='text-base leading-relaxed text-stone-600 dark:text-stone-300'>{description}</p>
              </div>
            )}

            {/* Keywords */}
            {place?.keywords?.length > 0 && (
              <div className='space-y-2'>
                <h2 className='text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500'>
                  {isKhmer ? 'ស្លាក' : 'Tags'}
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {place.keywords.map((kw: string) => (
                    <span
                      key={kw}
                      className='rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {place?.map_link && (
              <Button variant='design-review' size='lg' className='w-full' onClick={() => window.open(place.map_link, '_blank')}>
                {isKhmer ? 'បើកក្នុងផែនទី' : 'Open in Maps'}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
