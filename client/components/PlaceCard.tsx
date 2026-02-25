import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/lib/supabase";
import { cloudinaryUrl } from "@/components/AdminForm";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MapsSquare02Icon,
  Navigation03Icon,
} from "@hugeicons/core-free-icons";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const { i18n } = useTranslation();
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const isKhmer = i18n.language === "km";
  const name = isKhmer ? place.name_km : place.name_en;
  const province = isKhmer ? place.province_km : place.province_en;
  const images = place.images ?? [];
  const total = images.length;

  function goNext() {
    setDirection(1);
    setImgIndex((i) => (i + 1) % total);
  }

  function goPrev() {
    setDirection(-1);
    setImgIndex((i) => (i - 1 + total) % total);
  }

  // Slide animation based on direction
  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir * -60,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-lg dark:shadow-stone-900/40 transition-all duration-300">
      {/* ── Image area ── */}
      <div className="relative h-52 overflow-hidden bg-stone-100 dark:bg-stone-900">
        {total > 0 ? (
          <>
            {/* Sliding image */}
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.img
                key={imgIndex}
                src={cloudinaryUrl(images[imgIndex])}
                alt={name}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Nav arrows — only shown when multiple images exist */}
            {total > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/60"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/60"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > imgIndex ? 1 : -1);
                        setImgIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Fallback when no images
          <div className="flex h-full items-center justify-center">
            <HugeiconsIcon
              icon={MapsSquare02Icon}
              className="h-10 w-10 text-stone-300 dark:text-stone-600"
            />
          </div>
        )}
      </div>

      {/* ── Card content ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + province */}
        <div>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-stone-800 dark:text-stone-100">
            {name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            {province}
          </p>
        </div>

        {/* Distance from Phnom Penh */}
        {place.distance_from_pp != null && place.distance_from_pp > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <HugeiconsIcon
              icon={Navigation03Icon}
              className="h-3.5 w-3.5 text-amber-500"
            />
            <span>
              {place.distance_from_pp} km{" "}
              {isKhmer ? "ពីភ្នំពេញ" : "from Phnom Penh"}
            </span>
          </div>
        )}

        {/* Open in Maps button — pushed to bottom */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.open(place.map_link, "_blank")}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 transition-colors duration-200"
        >
          <HugeiconsIcon icon={MapsSquare02Icon} className="h-4 w-4" />
          {isKhmer ? "បើកក្នុងផែនទី" : "Open in Maps"}
        </motion.button>
      </div>
    </div>
  );
}
