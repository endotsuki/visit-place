import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Place } from "@/lib/supabase";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ImageAdd02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

// ─── Types ────────────────────────────────────────────────────────
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
  distance_from_pp: number; // km from Phnom Penh, entered manually by admin
};

// ─── Small helpers ────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaCls = `${inputCls} h-auto py-2.5 resize-none`;

// Upload image to Cloudinary — store raw URL, transform via URL API at display time
async function uploadToCloudinary(file: File): Promise<string | null> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    toast.error("Cloudinary config missing");
    return null;
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", "cambodia-travel");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body },
    );
    const data = await res.json();
    if (!data.secure_url) {
      toast.error(data.error?.message ?? "Upload failed");
      return null;
    }
    return data.secure_url;
  } catch {
    toast.error("Failed to upload image");
    return null;
  }
}

// Injects Cloudinary URL transforms at display time (no preset permissions needed)
// .../image/upload/photo.jpg → .../image/upload/w_1280,h_1280,c_fill,f_webp,q_auto/photo.jpg
export function cloudinaryUrl(
  url: string,
  transforms = "w_1280,h_1280,c_fill,f_webp,q_auto",
) {
  if (!url?.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/${transforms}/`);
}

// ─── Component ────────────────────────────────────────────────────
export default function AdminForm({ place, onClose }: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(place?.images ?? []);

  const [form, setForm] = useState<FormData>({
    name_km: place?.name_km ?? "",
    name_en: place?.name_en ?? "",
    province_km: place?.province_km ?? "",
    province_en: place?.province_en ?? "",
    description_km: place?.description_km ?? "",
    description_en: place?.description_en ?? "",
    keywords: place?.keywords.join(", ") ?? "",
    map_link: place?.map_link ?? "",
    distance_from_pp: place?.distance_from_pp ?? 0,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const urls = (await Promise.all(files.map(uploadToCloudinary))).filter(
      Boolean,
    ) as string[];
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
    if (urls.length) toast.success(`${urls.length} image(s) uploaded`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { keywords, ...rest } = form;
    const payload = {
      ...rest,
      distance_from_pp: +form.distance_from_pp,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      images,
    };

    const { error } = place?.id
      ? await supabase.from("places").update(payload).eq("id", place.id)
      : await supabase.from("places").insert([payload]);

    setSaving(false);
    if (error) {
      toast.error("Failed to save place");
      return;
    }

    toast.success(place ? "Place updated!" : "Place created!");
    onClose();
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
      className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 px-6 py-4">
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          {place ? t("editPlace") : t("addPlace")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300 transition"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 p-6">
        {/* Names */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name (Khmer)">
            <input
              className={inputCls}
              name="name_km"
              value={form.name_km}
              onChange={onChange}
              required
              placeholder="នាមកន្លែង"
            />
          </Field>
          <Field label="Name (English)">
            <input
              className={inputCls}
              name="name_en"
              value={form.name_en}
              onChange={onChange}
              required
              placeholder="Place name"
            />
          </Field>
        </div>

        {/* Provinces */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Province (Khmer)">
            <input
              className={inputCls}
              name="province_km"
              value={form.province_km}
              onChange={onChange}
              required
              placeholder="ខេត្ត"
            />
          </Field>
          <Field label="Province (English)">
            <input
              className={inputCls}
              name="province_en"
              value={form.province_en}
              onChange={onChange}
              required
              placeholder="Province"
            />
          </Field>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Description (Khmer)">
            <textarea
              className={textareaCls}
              name="description_km"
              value={form.description_km}
              onChange={onChange}
              rows={4}
              placeholder="ពិពណ៌នា"
            />
          </Field>
          <Field label="Description (English)">
            <textarea
              className={textareaCls}
              name="description_en"
              value={form.description_en}
              onChange={onChange}
              rows={4}
              placeholder="Description"
            />
          </Field>
        </div>

        {/* Distance from Phnom Penh */}
        <Field label="Distance from Phnom Penh (km)">
          <div className="relative">
            <input
              className={inputCls + " pr-12"}
              type="number"
              name="distance_from_pp"
              value={form.distance_from_pp}
              onChange={onChange}
              min="0"
              placeholder="e.g. 314"
              required
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
              km
            </span>
          </div>
        </Field>

        {/* Google Maps Link */}
        <Field label="Google Maps Link">
          <input
            className={inputCls}
            type="url"
            name="map_link"
            value={form.map_link}
            onChange={onChange}
            required
            placeholder="https://maps.google.com/?q=..."
          />
        </Field>

        {/* Keywords */}
        <Field label="Keywords (comma-separated)">
          <input
            className={inputCls}
            name="keywords"
            value={form.keywords}
            onChange={onChange}
            placeholder="temple, ancient, cultural"
          />
        </Field>

        {/* Images */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Images
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800/50 px-4 py-2.5 text-sm font-medium text-stone-500 dark:text-stone-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition disabled:opacity-50"
          >
            {uploading ? (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="h-4 w-4 animate-spin"
              />
            ) : (
              <HugeiconsIcon icon={ImageAdd02Icon} className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Upload Images"}
          </motion.button>

          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
              >
                {images.map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square overflow-hidden rounded-xl"
                  >
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        className="h-5 w-5 text-white"
                      />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 border-t border-stone-100 dark:border-stone-800 px-6 py-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving || images.length === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 dark:hover:bg-primary/80 transition disabled:opacity-50"
        >
          {saving && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="h-4 w-4 animate-spin"
            />
          )}
          {saving ? "Saving…" : t("save")}
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="flex flex-1 items-center justify-center rounded-xl border border-stone-200 dark:border-stone-700 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
        >
          {t("cancel")}
        </motion.button>
      </div>
    </motion.form>
  );
}
