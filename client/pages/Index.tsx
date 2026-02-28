import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Layout from '@/components/Layout';
import PlaceCard from '@/components/PlaceCard';
import { supabase, Place } from '@/lib/supabase';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/categories';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Loading03Icon, MapsSquare01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';

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
    border: '1px solid rgba(255,255,255,0.14)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 3px rgba(255,255,255,0.12)',
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
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState('all');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const hasFilters = province !== 'all' || category !== 'all' || query.trim() !== '';

  const visible = places.filter((p) => {
    const name = (i18n.language === 'km' ? p.name_km : p.name_en)?.toLowerCase() ?? '';
    const prov = (i18n.language === 'km' ? p.province_km : p.province_en)?.toLowerCase() ?? '';
    const q = query.toLowerCase().trim();
    return (
      (!q || name.includes(q) || prov.includes(q) || p.keywords?.some((k) => k.toLowerCase().includes(q))) &&
      (province === 'all' || prov === province.toLowerCase()) &&
      (category === 'all' || (p.category?.toLowerCase() ?? '') === category.toLowerCase())
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
          setCategories(new Set(list.map((p) => p.category ?? '').filter(Boolean)));
        }
        setLoading(false);
      });
  }, [i18n.language]);

  return (
    <Layout>
      <section
        className='relative overflow-hidden bg-stone-950 bg-cover bg-center text-white'
        style={{
          backgroundImage: "url('/hero-bg.webp')",
        }}
      >
        <div className='absolute inset-0 bg-black/50' />

        <div className='relative mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28'>
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
            className='mb-3 text-4xl font-bold uppercase tracking-tight sm:text-6xl'
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
              {query && (
                <button
                  type='button'
                  onClick={() => setQuery('')}
                  className='group absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-white/60 transition hover:text-red-400'
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} className='transition-all duration-300 group-hover:rotate-90' />
                </button>
              )}
            </div>
          </motion.div>

          {/* Province select */}
          <div className='mt-4 flex flex-wrap gap-3'>
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

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='h-12 w-full rounded-2xl px-4 text-sm text-white/70 sm:w-52' style={glass.base}>
                <SelectValue placeholder={t('category')} />
              </SelectTrigger>
              <SelectContent className='border border-stone-700 bg-stone-900 text-stone-200'>
                <SelectGroup>
                  <SelectItem value='all'>{t('all')}</SelectItem>
                  {Array.from(categories)
                    .sort()
                    .map((c) => {
                      const cat = CATEGORIES.find((x) => x.value === c);
                      const label = cat ? `${cat.label_en} / ${cat.label_km}` : c;
                      return (
                        <SelectItem key={c} value={c}>
                          {label}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant='blocked'
              className='rounded-2xl'
              onClick={() => {
                setProvince('all');
                setCategory('all');
                setQuery('');
              }}
            >
              {t('clearAllFilters')}
            </Button>
          </div>
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
                <p className='mt-1 text-stone-400'>{t('tryAdjustSearch')}</p>
              </div>
              {hasFilters && (
                <Button
                  variant='archived'
                  onClick={() => {
                    setProvince('all');
                    setCategory('all');
                    setQuery('');
                  }}
                >
                  {t('clearFilters')}
                </Button>
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
