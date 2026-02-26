import { motion } from 'framer-motion';
import { Place } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete01Icon, Edit02Icon, Image01Icon, Tag01Icon, Navigation03Icon } from '@hugeicons/core-free-icons';

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
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
      }}
      className='group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white px-5 py-4 shadow-sm duration-200 hover:border-stone-300 hover:shadow-md dark:border-stone-700/60 dark:bg-stone-900 dark:hover:border-stone-600'
    >
      {/* Thumbnail + info */}
      <div className='flex min-w-0 items-center gap-4'>
        {/* Thumbnail */}
        <div className='relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800'>
          {place.images?.[0] ? (
            <img
              src={place.images[0]}
              alt={place.name_en}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <HugeiconsIcon icon={Image01Icon} className='h-6 w-6 text-stone-300 dark:text-stone-600' />
            </div>
          )}
          {/* Image count badge */}
          {(place.images?.length ?? 0) > 1 && (
            <div className='absolute bottom-1 right-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm'>
              +{place.images!.length}
            </div>
          )}
        </div>

        {/* Text info */}
        <div className='min-w-0'>
          <p className='truncate text-sm font-bold text-stone-800 dark:text-stone-100'>
            {place.name_en}
            <span className='ml-1.5 font-normal text-stone-400 dark:text-stone-500'>· {place.name_km}</span>
          </p>

          <p className='mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
            {place.province_en}
          </p>

          {/* Meta chips */}
          <div className='mt-1.5 flex flex-wrap items-center gap-2.5 text-[11px] text-stone-400 dark:text-stone-500'>
            <span className='flex items-center gap-1'>
              <HugeiconsIcon icon={Image01Icon} className='h-3 w-3' />
              {place.images?.length ?? 0} {(place.images?.length ?? 0) === 1 ? 'photo' : 'photos'}
            </span>
            <span className='h-3 w-px rounded-full bg-stone-200 dark:bg-stone-700' />
            <span className='flex items-center gap-1'>
              <HugeiconsIcon icon={Tag01Icon} className='h-3 w-3' />
              {place.keywords?.length ?? 0} tags
            </span>
            {place.distance_from_pp != null && place.distance_from_pp > 0 && (
              <>
                <span className='h-3 w-px rounded-full bg-stone-200 dark:bg-stone-700' />
                <span className='flex items-center gap-1'>
                  <HugeiconsIcon icon={Navigation03Icon} className='h-3 w-3' />
                  {place.distance_from_pp} km
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex shrink-0 items-center gap-2'>
        {/* Edit */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onEdit(place)}
          className='inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-amber-500/60 dark:hover:bg-amber-950/20 dark:hover:text-amber-400'
        >
          <HugeiconsIcon icon={Edit02Icon} className='h-3.5 w-3.5' />
          {t('editPlace')}
        </motion.button>

        {/* Delete — subtle red tint at rest */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(place)}
          className='inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-2 text-xs font-semibold text-red-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-500/70 dark:hover:border-red-700/60 dark:hover:bg-red-950/30 dark:hover:text-red-400'
        >
          <HugeiconsIcon icon={Delete01Icon} className='h-3.5 w-3.5' />
          {t('deletePlace')}
        </motion.button>
      </div>
    </motion.li>
  );
}
