import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Layout from '@/components/Layout';
import PlaceCard from '@/components/PlaceCard';
import { supabase, Place } from '@/lib/supabase';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Loading03Icon, MapsSquare01Icon, Search01Icon } from '@hugeicons/core-free-icons';

const EASE = [0.22, 1, 0.36, 1] as const;

const glass = {
  base: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 12px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    outline: 'none',
  },
  focus: {
    background: 'rgba(255,255,255,0.09)',
    border: '1px solid rgba(251,191,36,0.40)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 3px rgba(251,191,36,0.10)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    outline: 'none',
  },
};

export default function Index() {
  const { i18n, t } = useTranslation();
  const rm = useReducedMotion();

  const [places, setPlaces] = useState<Place[]>([]);
  const [provinces, setProvinces] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState('all');
  const [query, setQuery] = useState('');

  const hasFilters = province !== 'all' || query.trim() !== '';

  const visible = places.filter((p) => {
    const name = (i18n.language === 'km' ? p.name_km : p.name_en)?.toLowerCase() ?? '';
    const prov = (i18n.language === 'km' ? p.province_km : p.province_en)?.toLowerCase() ?? '';
    const q = query.toLowerCase().trim();
    return (
      (!q || name.includes(q) || prov.includes(q) || p.keywords?.some((k) => k.toLowerCase().includes(q))) &&
      (province === 'all' || prov === province.toLowerCase())
    );
  });

  useEffect(() => {
    setLoading(true);
    supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          const list = (data ?? []) as Place[];
          setPlaces(list);
          setProvinces(new Set(list.map((p) => (i18n.language === 'km' ? p.province_km : p.province_en))));
        }
        setLoading(false);
      });
  }, [i18n.language]);

  return (
    <Layout>
      {/* ── Hero / Search ── */}
      <section className='relative overflow-hidden bg-stone-950 text-white'>
        {/* Ambient glows */}
        <div
          aria-hidden
          className='pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-primary/40 blur-[100px]'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[80px]'
        />

        <div className='relative mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28'>
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
            className='mb-3 text-4xl font-bold tracking-tight sm:text-5xl'
          >
            {t('search')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.14 }}
            className='mb-10 text-base text-stone-400 sm:text-lg'
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Search row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.22 }}
            className='flex flex-col gap-3 sm:flex-row'
          >
            {/* Search input */}
            <div className='relative flex-1'>
              <input
                type='text'
                placeholder={t('searchByName')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={(e) => Object.assign(e.currentTarget.style, glass.focus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, glass.base)}
                className='h-12 w-full rounded-2xl pl-11 pr-10 text-sm text-white/90 placeholder-white/25 transition-all duration-200 sm:text-base'
                style={glass.base}
              />
              <HugeiconsIcon icon={Search01Icon} className='absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/30' />
              {/* clear search */}
              {/* <div
                className='pointer-events-none absolute inset-x-3 top-0 h-px rounded-full opacity-40'
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    onClick={() => setQuery('')}
                    className='top1/2 absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-all duration-150 hover:bg-red-500/20 hover:text-red-400'
                    style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className='h-3 w-3' />
                  </motion.button>
                )}
              </AnimatePresence> */}
            </div>

            {/* Province select */}
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className='h-12 w-full rounded-2xl px-4 text-sm text-white/70 sm:w-52' style={glass.base}>
                <SelectValue placeholder={t('selectProvince')} />
              </SelectTrigger>
              <SelectContent className='border border-stone-700 bg-stone-900 text-stone-200'>
                <SelectGroup>
                  <SelectItem value='all'>{t('allProvinces')}</SelectItem>
                  {Array.from(provinces)
                    .sort()
                    .map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className='mt-4 flex flex-wrap items-center gap-2 overflow-hidden'
              >
                {province !== 'all' && (
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary'>
                    {province}
                    <button onClick={() => setProvince('all')} className='transition hover:opacity-70'>
                      <HugeiconsIcon icon={Cancel01Icon} className='h-3 w-3' />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setProvince('all');
                    setQuery('');
                  }}
                  className='text-xs text-stone-500 underline underline-offset-2 transition hover:text-primary'
                >
                  {t('clearAllFilters')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Results ── */}
      <section className='min-h-[60vh] bg-stone-50 dark:bg-stone-900'>
        <div className='mx-auto max-w-full px-4 py-10 sm:px-6 lg:px-8'>
          {/* Loading */}
          {loading && (
            <div className='flex flex-col items-center justify-center gap-5 py-36 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5'>
                <HugeiconsIcon icon={Loading03Icon} className='h-7 w-7 animate-spin text-primary' />
              </div>
              <p className='text-sm font-medium tracking-wide text-stone-400'>{t('loadingDestinations')}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='flex flex-col items-center justify-center gap-5 py-36 text-center'
            >
              <div className='flex h-20 w-20 items-center justify-center rounded-full border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800'>
                <HugeiconsIcon icon={MapsSquare01Icon} className='h-8 w-8 text-stone-300 dark:text-stone-600' />
              </div>
              <div>
                <p className='text-lg font-semibold text-stone-700 dark:text-stone-300'>{t('noPlacesFound')}</p>
                <p className='mt-1 text-sm text-stone-400'>{t('tryAdjustSearch')}</p>
              </div>
              {hasFilters && (
                <button
                  onClick={() => {
                    setProvince('all');
                    setQuery('');
                  }}
                  className='rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-primary hover:text-primary dark:border-stone-700 dark:text-stone-400'
                >
                  {t('clearFilters')}
                </button>
              )}
            </motion.div>
          )}

          {/* Grid */}
          {!loading && visible.length > 0 && (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className='mb-7 text-sm font-medium text-stone-400'
              >
                {visible.length} {t('destination')}
                {i18n.language === 'en' && visible.length !== 1 ? 's' : ''}
              </motion.p>

              <motion.div
                key={`${query}-${province}`}
                initial='hidden'
                animate='show'
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
                className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              >
                <AnimatePresence mode='popLayout'>
                  {visible.map((place) => (
                    <motion.div
                      key={place.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 28, scale: 0.97 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
                      }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                    >
                      <PlaceCard place={place} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
