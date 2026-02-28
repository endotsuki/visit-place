import { motion } from 'framer-motion';
import { Place } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';
import { distanceFromPhnomPenh } from '@/lib/distance';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete01Icon, Edit02Icon, Image01Icon, Tag01Icon, Navigation03Icon } from '@hugeicons/core-free-icons';
import { Button } from './ui/button';

interface Props {
  place: Place;
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
}

export default function PlaceRow({ place, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
      }}
      className='group relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-4'
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Animated top shimmer line */}
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100'
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 40%, rgba(251,191,36,0.5) 60%, transparent 100%)',
        }}
      />

      {/* Hover amber glow bleed */}
      <div
        className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.07) 0%, transparent 70%)' }}
      />

      {/* Corner gloss */}
      <div
        className='pointer-events-none absolute left-0 top-0 h-20 w-32 rounded-tl-2xl opacity-30'
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.25) 0%, transparent 70%)' }}
      />

      {/* Thumbnail + info */}
      <div className='relative flex min-w-0 items-center gap-4'>
        {/* Thumbnail */}
        <div
          className='relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl'
          style={{
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {place.images?.[0] ? (
            <img
              src={place.images[0]}
              alt={place.name_en}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
            />
          ) : (
            <div className='flex h-full items-center justify-center' style={{ background: 'rgba(255,255,255,0.05)' }}>
              <HugeiconsIcon icon={Image01Icon} size={26} className='text-white/20' />
            </div>
          )}
          {/* Image gloss overlay */}
          <div
            className='pointer-events-none absolute inset-0'
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
          />
        </div>

        {/* Text info */}
        <div className='min-w-0'>
          <p className='truncate text-base font-bold text-white/90'>
            {place.name_en}
            <span className='ml-2 font-normal text-white/40'>· {place.name_km}</span>
            {place.category && (
              <span className='ml-3 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white'>
                {(() => {
                  const cat = CATEGORIES.find((x) => x.value === place.category);
                  return cat ? `${cat.label_en} / ${cat.label_km}` : place.category;
                })()}
              </span>
            )}
          </p>

          <p className='mt-0.5 text-xs uppercase'>{place.province_en}</p>

          {/* Meta chips */}
          <div className='mt-2 flex flex-wrap items-center gap-1.5'>
            {[
              { icon: Image01Icon, label: `${place.images?.length ?? 0} ${(place.images?.length ?? 0) === 1 ? 'photo' : 'photos'}` },
              { icon: Tag01Icon, label: `${place.keywords?.length ?? 0} tags` },
              ...(place.latitude != null && place.longitude != null
                ? [{ icon: Navigation03Icon, label: `${distanceFromPhnomPenh(place.latitude, place.longitude).toFixed(1)} km` }]
                : []),
            ].map(({ icon, label }, i) => (
              <span
                key={i}
                className='flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-xs font-medium text-white/55'
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <HugeiconsIcon icon={icon} size={12} className='text-white/40' />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='relative flex shrink-0 items-center gap-2'>
        <Button variant='archived' size='sm' onClick={() => onEdit(place)}>
          <HugeiconsIcon icon={Edit02Icon} className='h-4 w-4' />
          {t('editPlace')}
        </Button>

        <Button variant='blocked' size='sm' onClick={() => onDelete(place)}>
          <HugeiconsIcon icon={Delete01Icon} className='h-4 w-4' />
          {t('deletePlace')}
        </Button>
      </div>
    </motion.li>
  );
}
