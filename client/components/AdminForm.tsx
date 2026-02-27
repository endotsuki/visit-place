import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Place } from '@/lib/supabase';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon, ImageAdd02Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { cloudinaryUrl, uploadToCloudinary, deleteFromCloudinary, deleteOrphanedImages } from '@/lib/cloudinary';
import { PROVINCES } from '@/lib/provinces';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
  place?: Place;
  onClose: () => void;
}

type FormData = {
  name_km: string;
  name_en: string;
  province_km: string;
  province_en: string;
  description_km: string;
  description_en: string;
  keywords: string;
  map_link: string;
  distance_from_pp: number;
};

type UploadItem = { name: string; status: 'uploading' | 'done' | 'error' };

const inputCls =
  'h-10 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const textareaCls = `${inputCls} h-auto py-2.5 resize-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400'>{label}</label>
      {children}
    </div>
  );
}

export default function AdminForm({ place, onClose }: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const isUploading = queue.some((u) => u.status === 'uploading');

  // Track original images so we can diff on save
  const originalImages = place?.images ?? [];
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState<FormData>({
    name_km: '',
    name_en: '',
    province_km: '',
    province_en: '',
    description_km: '',
    description_en: '',
    keywords: '',
    map_link: '',
    distance_from_pp: 0,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Sync form and images when place prop changes
  useEffect(() => {
    setImages(place?.images ?? []);
    setForm({
      name_km: place?.name_km ?? '',
      name_en: place?.name_en ?? '',
      province_km: place?.province_km ?? '',
      province_en: place?.province_en ?? '',
      description_km: place?.description_km ?? '',
      description_en: place?.description_en ?? '',
      keywords: place?.keywords.join(', ') ?? '',
      map_link: place?.map_link ?? '',
      distance_from_pp: place?.distance_from_pp ?? 0,
    });
  }, [place?.id]);

  // Remove image from UI — also delete from Cloudinary immediately
  function removeImage(url: string, index: number) {
    deleteFromCloudinary([url]); // fire and forget
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    const startIdx = queue.length;
    setQueue((prev) => [...prev, ...files.map((f) => ({ name: f.name, status: 'uploading' as const }))]);

    await Promise.all(
      files.map((file, i) =>
        uploadToCloudinary(
          file,
          (url) => {
            setQueue((prev) => prev.map((item, idx) => (idx === startIdx + i ? { ...item, status: 'done' } : item)));
            setImages((prev) => [...prev, url]);
          },
          () => setQueue((prev) => prev.map((item, idx) => (idx === startIdx + i ? { ...item, status: 'error' } : item)))
        )
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { keywords, ...rest } = form;
    const payload = {
      ...rest,
      distance_from_pp: +form.distance_from_pp,
      keywords: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      images,
    };

    const { error } = place?.id
      ? await supabase.from('places').update(payload).eq('id', place.id)
      : await supabase.from('places').insert([payload]);

    if (error) {
      toast.error('Failed to save');
      setSaving(false);
      return;
    }

    // After successful save: delete any images that were removed during editing
    if (place?.id) await deleteOrphanedImages(originalImages, images);

    setSaving(false);
    toast.success(place ? 'Updated!' : 'Created!');
    onClose();
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 as const }}
      className='overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900'
    >
      {/* Header */}
      <div className='flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-stone-800'>
        <h2 className='text-lg font-bold text-stone-800 dark:text-stone-100'>{place ? t('editPlace') : t('addPlace')}</h2>
        <button type='button' onClick={onClose} className='rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'>
          <HugeiconsIcon icon={Cancel01Icon} className='h-5 w-5' />
        </button>
      </div>

      <div className='space-y-5 p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Field label='Name (Khmer)'>
            <input className={inputCls} name='name_km' value={form.name_km} onChange={onChange} required placeholder='នាមកន្លែង' />
          </Field>

          <Field label='Name (English)'>
            <input className={inputCls} name='name_en' value={form.name_en} onChange={onChange} required placeholder='Place name' />
          </Field>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Field label='Province (Khmer)'>
            <Select
              value={form.province_km}
              onValueChange={(value) => {
                const province = PROVINCES.find((p) => p.km === value);
                if (province) {
                  setForm((prev) => ({ ...prev, province_km: value, province_en: province.en }));
                }
              }}
            >
              <SelectTrigger className='h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm dark:border-stone-700 dark:bg-stone-900'>
                <SelectValue placeholder='ជ្រើសរើសខេត្ត' />
              </SelectTrigger>
              <SelectContent className='border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900'>
                <SelectGroup>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province.en} value={province.km}>
                      {province.km}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field label='Province (English)'>
            <Select
              value={form.province_en}
              onValueChange={(value) => {
                const province = PROVINCES.find((p) => p.en === value);
                if (province) {
                  setForm((prev) => ({ ...prev, province_en: value, province_km: province.km }));
                }
              }}
            >
              <SelectTrigger className='h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm dark:border-stone-700 dark:bg-stone-900'>
                <SelectValue placeholder='Select province' />
              </SelectTrigger>
              <SelectContent className='border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900'>
                <SelectGroup>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province.en} value={province.en}>
                      {province.en}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Field label='Description (Khmer)'>
            <textarea
              className={textareaCls}
              name='description_km'
              value={form.description_km}
              onChange={onChange}
              rows={3}
              placeholder='ពិពណ៌នា'
            />
          </Field>
          <Field label='Description (English)'>
            <textarea
              className={textareaCls}
              name='description_en'
              value={form.description_en}
              onChange={onChange}
              rows={3}
              placeholder='Description'
            />
          </Field>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Field label='Distance from Phnom Penh (km)'>
            <div className='relative'>
              <input
                className={inputCls + ' pr-12'}
                type='number'
                name='distance_from_pp'
                value={form.distance_from_pp}
                onChange={onChange}
                min='0'
                placeholder='e.g. 314'
                required
              />
              <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400'>km</span>
            </div>
          </Field>
          <Field label='Google Maps Link'>
            <input
              className={inputCls}
              type='url'
              name='map_link'
              value={form.map_link}
              onChange={onChange}
              required
              placeholder='https://maps.google.com/?q=...'
            />
          </Field>
        </div>
        <Field label='Keywords (comma-separated)'>
          <input className={inputCls} name='keywords' value={form.keywords} onChange={onChange} placeholder='temple, ancient, cultural' />
        </Field>

        {/* Images */}
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400'>Images</p>
            <p className='text-xs text-stone-400'>Stored in Cloudinary · served as WebP</p>
          </div>

          <input ref={fileInputRef} type='file' multiple accept='image/*' onChange={handleUpload} className='hidden' />
          <motion.button
            type='button'
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className='inline-flex items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-500 hover:border-primary hover:text-primary disabled:opacity-50 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-400'
          >
            <HugeiconsIcon icon={isUploading ? Loading03Icon : ImageAdd02Icon} className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
            {isUploading ? 'Uploading…' : 'Upload Images'}
          </motion.button>

          {/* Per-file progress */}
          <AnimatePresence>
            {queue.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-3 space-y-1.5 overflow-hidden'
              >
                {queue.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400'
                  >
                    <HugeiconsIcon
                      icon={item.status === 'uploading' ? Loading03Icon : item.status === 'done' ? CheckmarkCircle02Icon : AlertCircleIcon}
                      className={`h-3.5 w-3.5 shrink-0 ${item.status === 'uploading' ? 'animate-spin text-primary' : item.status === 'done' ? 'text-green-500' : 'text-red-500'}`}
                    />
                    <span className='max-w-[200px] truncate'>{item.name}</span>
                    <span className='ml-auto font-medium'>
                      {item.status === 'uploading' ? 'Uploading…' : item.status === 'done' ? 'Done' : 'Failed'}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Thumbnails */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5'
              >
                {images.map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className='group relative aspect-video overflow-hidden rounded-xl'
                  >
                    <img
                      src={cloudinaryUrl(url, 'c_fill,w_400,h_225,f_webp,q_auto')}
                      alt={`Preview ${i + 1}`}
                      className='h-full w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => removeImage(url, i)}
                      className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100'
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className='h-5 w-5 text-white' />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className='flex gap-3 border-t border-stone-100 px-6 py-4 dark:border-stone-800'>
        <Button type='submit' disabled={saving || images.length === 0 || isUploading} className='flex-1'>
          {saving && <HugeiconsIcon icon={Loading03Icon} className='h-4 w-4 animate-spin' />}
          {saving ? 'Saving…' : t('save')}
        </Button>
        <Button variant='blocked' onClick={onClose} className='flex-1'>
          {t('cancel')}
        </Button>
      </div>
    </motion.form>
  );
}
