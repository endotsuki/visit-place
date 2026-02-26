import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Place } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, MapsSquare02Icon, Navigation03Icon } from '@hugeicons/core-free-icons';

/** "Siem Reap Temple" → "siem-reap-temple" */
export function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
}

export default function PlaceCard({ place, isSelected }: PlaceCardProps) {
  const { i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const isKhmer = i18n.language === 'km';
  const name = isKhmer ? place.name_km : place.name_en;
  const province = isKhmer ? place.province_km : place.province_en;
  const images: string[] = place.images ?? [];
  const total = images.length;

  function handleCardClick() {
    const slug = toSlug(place.name_en ?? place.name_km ?? String(place.id));
    navigate(`/details/${slug}?id=${place.id}`);
  }

  function goNext(e: React.MouseEvent) {
    e.stopPropagation();
    setDirection(1);
    setImgIndex((i) => (i + 1) % total);
  }

  function goPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setDirection(-1);
    setImgIndex((i) => (i - 1 + total) % total);
  }

  const variants = {
    enter: (dir: number) => ({ x: dir * 30, opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir: number) => ({ x: dir * -30, opacity: 0, scale: 0.97, transition: { duration: 0.18 } }),
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={handleCardClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`group relative flex h-[108px] cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? 'border-amber-400/70 bg-gradient-to-r from-amber-50 to-orange-50/40 shadow-[0_0_0_1px_rgba(251,191,36,0.3),0_4px_20px_rgba(245,158,11,0.12)] dark:border-amber-500/50 dark:from-amber-950/30 dark:to-orange-950/20'
          : 'border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
      }`}
    >
      {/* ── Image (left) ── */}
      <div className='relative h-full w-[140px] shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800'>
        {total > 0 ? (
          <>
            <AnimatePresence custom={direction} mode='popLayout'>
              <motion.img
                key={imgIndex}
                src={images[imgIndex]}
                alt={name}
                custom={direction}
                // variants={variants}
                initial='enter'
                animate='center'
                exit='exit'
                className='absolute inset-0 h-full w-full object-cover'
              />
            </AnimatePresence>

            <div className='absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/15 to-transparent' />

            {total > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className='absolute left-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/55 group-hover:opacity-100'
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className='h-3 w-3' />
                </button>
                <button
                  onClick={goNext}
                  className='absolute right-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/55 group-hover:opacity-100'
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className='h-3 w-3' />
                </button>

                <div className='absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-0.5'>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDirection(i > imgIndex ? 1 : -1);
                        setImgIndex(i);
                      }}
                      className={`h-[3px] rounded-full transition-all duration-200 ${
                        i === imgIndex ? 'w-3.5 bg-white' : 'w-[3px] bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <HugeiconsIcon icon={MapsSquare02Icon} className='h-8 w-8 text-stone-300 dark:text-stone-600' />
          </div>
        )}
      </div>

      {/* ── Content (right) ── */}
      <div className='flex min-w-0 flex-1 flex-col justify-between px-4 py-3.5'>
        <div className='min-w-0'>
          <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-500'>{province}</p>
          <h3 className='line-clamp-2 text-sm font-bold leading-snug text-stone-800 dark:text-stone-100'>{name}</h3>
        </div>

        <div className='flex items-center justify-between gap-2'>
          {place.distance_from_pp != null && place.distance_from_pp > 0 ? (
            <div className='flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500'>
              <HugeiconsIcon icon={Navigation03Icon} className='h-3 w-3 shrink-0 text-amber-400' />
              <span>
                {place.distance_from_pp} km {isKhmer ? 'ពីភ្នំពេញ' : 'from PP'}
              </span>
            </div>
          ) : (
            <span />
          )}

          <span className='shrink-0 text-[10px] font-medium text-stone-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-stone-600'>
            {isKhmer ? 'ចុចដើម្បីមើល' : 'View details'} →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
