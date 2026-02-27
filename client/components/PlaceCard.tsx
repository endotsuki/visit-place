import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Place } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { Navigation03Icon, ImageNotFound01Icon, Image03Icon } from '@hugeicons/core-free-icons';

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
  }

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className='group relative aspect-[5/3] cursor-pointer overflow-hidden rounded-3xl bg-neutral-900 shadow-md hover:shadow-xl'
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
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className='absolute inset-0 h-full w-full object-cover'
        />
      ) : (
        <div className='flex h-full items-center justify-center bg-neutral-800'>
          <HugeiconsIcon icon={ImageNotFound01Icon} className='h-10 w-10 text-neutral-600' />
        </div>
      )}

      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent' />
      {/* ── Top section (distance + image count) ── */}
      <div className='absolute top-4 flex w-full items-center justify-between px-4'>
        <div className='flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-lg'>
          <HugeiconsIcon icon={Navigation03Icon} size={16} className='text-accent' />
          <span className='opacity-90'>
            {place.distance_from_pp} km {isKhmer ? 'ពីភ្នំពេញ' : 'from Phnom Penh'}
          </span>
        </div>

        {total > 1 && (
          <div className='flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-lg'>
            <HugeiconsIcon icon={Image03Icon} size={16} />
            <span>{total}</span>
          </div>
        )}
      </div>

      {/* ── Bottom text section ── */}
      <div className='absolute inset-x-0 bottom-0 p-4'>
        <p className='text-sm font-medium tracking-wide text-accent/90'>{province}</p>

        <h3 className='mt-1 text-lg font-semibold leading-snug tracking-tight text-white drop-shadow-md'>{name}</h3>
      </div>

      {/* ── Subtle hover ring ── */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className='pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20'
      />
    </motion.div>
  );
}
