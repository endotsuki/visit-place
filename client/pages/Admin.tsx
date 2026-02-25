// pages/Admin.tsx

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { supabase, Place } from "@/lib/supabase";
import Layout from "@/components/Layout";
import AdminForm from "@/components/AdminForm";
import PlaceRow from "@/components/PlaceRow";
import { usePlaces } from "@/hooks/usePlaces";

export default function Admin() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { places, loading, load, remove } = usePlaces();

  const [authChecking, setAuthChecking] = useState(true);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showForm, setShowForm]         = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/admin/login");
      else setAuthChecking(false);
    });
  }, []);

  function closeForm() { setShowForm(false); setEditingPlace(null); load(); }
  const formOpen = showForm || !!editingPlace;

  if (authChecking) return (
    <Layout>
      <div className="flex h-[60vh] items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t("admin")}</h1>
            <p className="mt-1 text-sm text-stone-400">{places.length} place{places.length !== 1 ? "s" : ""} total</p>
          </div>
          {!formOpen && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" /> {t("addPlace")}
            </motion.button>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {formOpen && (
            <motion.div key="form" className="mb-8"
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminForm place={editingPlace ?? undefined} onClose={closeForm} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <HugeiconsIcon icon={Loading03Icon} className="h-7 w-7 animate-spin text-amber-500" />
          </div>
        ) : places.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 py-20 text-center">
            <p className="text-stone-400">No places yet</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" /> {t("addPlace")}
            </motion.button>
          </div>
        ) : (
          <motion.ul variants={{ show: { transition: { staggerChildren: 0.04 } } }} initial="hidden" animate="show" className="space-y-3">
            {places.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                onEdit={(p) => { setEditingPlace(p); setShowForm(false); }}
                onDelete={remove}
              />
            ))}
          </motion.ul>
        )}
      </div>
    </Layout>
  );
}