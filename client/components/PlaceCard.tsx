import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Place } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { Navigation03Icon, ImageNotFound01Icon } from '@hugeicons/core-free-icons';

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const { i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [imgIndex, setImgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const isKhmer = i18n.language === 'km';
  const name = isKhmer ? place.name_km : place.name_en;
  const province = isKhmer ? place.province_km : place.province_en;
  const images: string[] = place.images ?? [];
  const total = images.length;

  function handleClick() {
    const slug = toSlug(place.name_en ?? place.name_km ?? String(place.id));
    navigate(`/details/${slug}?id=${place.id}`);
  }

  function handleMouseEnter() {
    setHovered(true);
    if (total > 1) setImgIndex((i) => (i + 1) % total);
  }

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.025, y: -2 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className='group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-stone-900'
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* ── Background image ── */}
      {total > 0 ? (
        <motion.img
          key={imgIndex}
          src={images[imgIndex]}
          alt={name}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='absolute inset-0 h-full w-full object-cover'
        />
      ) : (
        <div className='flex h-full items-center justify-center bg-stone-800'>
          <HugeiconsIcon icon={ImageNotFound01Icon} className='h-10 w-10 text-stone-600' />
        </div>
      )}

      {/* ── Permanent bottom gradient ── */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent' />

      {/* ── Photo count — top right ── */}
      {total > 1 && (
        <div className='absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-md'>
          <svg className='h-2.5 w-2.5 text-white/80' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
          </svg>
          <span className='text-[10px] font-semibold text-white/90'>{total}</span>
        </div>
      )}

      {/* ── Text — always visible, pinned to bottom ── */}
      <div className='absolute inset-x-0 bottom-0 p-3.5'>
        {/* Province */}
        <p className='text-[9px] font-bold uppercase tracking-[0.18em] text-amber-400'>{province}</p>

        {/* Place name — always shown, never clipped */}
        <h3 className='mt-0.5 line-clamp-1 text-[13px] font-bold leading-tight text-white'>{name}</h3>

        {/* Distance — slides in on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }}
          transition={{ duration: 0.18 }}
          className='overflow-hidden'
        >
          {place.distance_from_pp != null && place.distance_from_pp > 0 && (
            <div className='mt-1.5 flex items-center gap-1 text-[10px] text-white/60'>
              <HugeiconsIcon icon={Navigation03Icon} className='h-2.5 w-2.5 text-amber-400' />
              <span>
                {place.distance_from_pp} km {isKhmer ? 'ពីភ្នំពេញ' : 'from Phnom Penh'}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Hover ring ── */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15'
      />
    </motion.div>
  );
}
