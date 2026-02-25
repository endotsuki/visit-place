import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import AdminForm from "@/components/AdminForm";
import { supabase, Place } from "@/lib/supabase";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Delete01Icon,
  Edit02Icon,
  Image01Icon,
  Loading03Icon,
  PlusSignIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Admin() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showForm, setShowForm] = useState(false);

  // ── Auth guard: redirect if not logged in ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/admin/login");
        return;
      }
      setAuthChecking(false);
      loadPlaces();
    });
  }, []);

  async function loadPlaces() {
    setLoading(true);
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load places");
    else setPlaces((data ?? []) as Place[]);
    setLoading(false);
  }

  async function deletePlace(id: string) {
    if (!confirm(t("deletePlace"))) return;
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Place deleted");
    loadPlaces();
  }

  function closeForm() {
    setShowForm(false);
    setEditingPlace(null);
    loadPlaces();
  }

  // ── Loading screen while checking auth ──
  if (authChecking)
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="h-8 w-8 animate-spin text-amber-500"
          />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {t("admin")}
            </h1>
            <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
              {places.length} place{places.length !== 1 ? "s" : ""} total
            </p>
          </div>
          {!showForm && !editingPlace && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />{" "}
              {t("addPlace")}
            </motion.button>
          )}
        </div>

        {/* Form (add / edit) */}
        <AnimatePresence>
          {(showForm || editingPlace) && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <AdminForm
                place={editingPlace ?? undefined}
                onClose={closeForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Places list */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <HugeiconsIcon
              icon={Loading03Icon}
              className="h-7 w-7 animate-spin text-amber-500"
            />
          </div>
        ) : places.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 py-20 text-center">
            <p className="text-stone-400 dark:text-stone-500">No places yet</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />{" "}
              {t("addPlace")}
            </motion.button>
          </div>
        ) : (
          <motion.ul
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {places.map((place) => (
              <motion.li
                key={place.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-5 py-4 shadow-sm hover:shadow-md dark:shadow-stone-900/30 transition-shadow"
              >
                {/* Place info */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Thumbnail */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-700">
                    {place.images?.[0] ? (
                      <img
                        src={place.images[0]}
                        alt={place.name_en}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <HugeiconsIcon
                          icon={Image01Icon}
                          className="h-5 w-5 text-stone-300 dark:text-stone-600"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-stone-800 dark:text-stone-100">
                      {place.name_en}{" "}
                      <span className="text-stone-400 dark:text-stone-500 font-normal">
                        / {place.name_km}
                      </span>
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {place.province_en}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-stone-400 dark:text-stone-500">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Image01Icon} className="h-3 w-3" />
                        {place.images?.length ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Tag01Icon} className="h-3 w-3" />
                        {place.keywords.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setEditingPlace(place);
                      setShowForm(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-600 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
                  >
                    <HugeiconsIcon icon={Edit02Icon} className="h-3.5 w-3.5" />{" "}
                    {t("editPlace")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => deletePlace(place.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-600 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <HugeiconsIcon
                      icon={Delete01Icon}
                      className="h-3.5 w-3.5"
                    />{" "}
                    {t("deletePlace")}
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </Layout>
  );
}
