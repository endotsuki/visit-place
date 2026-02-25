import { motion } from "framer-motion";
import { Place } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Edit02Icon, Image01Icon, Tag01Icon } from "@hugeicons/core-free-icons";

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
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-5 py-4 shadow-sm hover:shadow-md dark:shadow-stone-900/30 transition-shadow"
    >
      {/* Thumbnail + info */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-700">
          {place.images?.[0]
            ? <img src={place.images[0]} alt={place.name_en} className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center"><HugeiconsIcon icon={Image01Icon} className="h-5 w-5 text-stone-300 dark:text-stone-600" /></div>
          }
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
            {place.name_en} <span className="font-normal text-stone-400">/ {place.name_km}</span>
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400">{place.province_en}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-stone-400 dark:text-stone-500">
            <span className="flex items-center gap-1"><HugeiconsIcon icon={Image01Icon} className="h-3 w-3" />{place.images?.length ?? 0}</span>
            <span className="flex items-center gap-1"><HugeiconsIcon icon={Tag01Icon} className="h-3 w-3" />{place.keywords.length}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => onEdit(place)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-600 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <HugeiconsIcon icon={Edit02Icon} className="h-3.5 w-3.5" /> {t("editPlace")}
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(place)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-600 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 transition"
        >
          <HugeiconsIcon icon={Delete01Icon} className="h-3.5 w-3.5" /> {t("deletePlace")}
        </motion.button>
      </div>
    </motion.li>
  );
}