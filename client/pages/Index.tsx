import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Loader, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Layout from "@/components/Layout";
import PlaceCard from "@/components/PlaceCard";
import { supabase, Place } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Animation presets ────────────────────────────────────────────
// Cubic bezier must be typed as a const tuple for framer-motion's Easing type
const EASE = [0.22, 1, 0.36, 1] as const;

const anim = {
  // fadeUp uses a function variant so each element can have its own stagger delay via `custom`
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE, delay },
    }),
  } as const,
  card: {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: EASE },
    },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
  },
  cardGrid: {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  },
  filterPanel: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: EASE },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.22 } },
  },
};

// ─── Small reusable pieces ────────────────────────────────────────

// A dismissible tag shown when a filter is active
function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
    >
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition">
        <X className="h-3 w-3" />
      </button>
    </motion.span>
  );
}

// Centered loading / empty-state layout
function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-36 gap-5 text-center">
      {children}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────
export default function Index() {
  const { i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isKhmer = i18n.language === "km";

  // Data
  const [places, setPlaces] = useState<Place[]>([]);
  const [provinces, setProvinces] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [province, setProvince] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");

  const hasFilters = province !== "all" || query.trim() !== "";

  // Derived: filter places based on current search/filter state
  const visiblePlaces = places.filter((p) => {
    const name = (isKhmer ? p.name_km : p.name_en)?.toLowerCase() || "";
    const prov = (isKhmer ? p.province_km : p.province_en)?.toLowerCase() || "";
    const keywords = p.keywords?.map((k) => k.toLowerCase()) || [];

    const q = query.toLowerCase().trim();

    const matchesQuery =
      !q ||
      name.includes(q) ||
      prov.includes(q) ||
      keywords.some((k) => k.includes(q));

    const matchesProvince =
      province === "all" || prov === province.toLowerCase();

    return matchesQuery && matchesProvince;
  });

  // ── Fetch all places from Supabase ──
  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const list = (data ?? []) as Place[];
      setPlaces(list);
      setProvinces(
        new Set(list.map((p) => (isKhmer ? p.province_km : p.province_en))),
      );
      setLoading(false);
    }
    loadPlaces();
  }, [isKhmer]);

  const clearFilters = () => {
    setProvince("all");
    setQuery("");
  };

  // ── Text helpers ──
  const t = (km: string, en: string) => (isKhmer ? km : en);

  // ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* ── HERO (always dark) ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-stone-950 text-white">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-amber-600/10 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/8 blur-[80px]"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          {/* Badge */}
          <motion.p
            variants={anim.fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400"
          >
            <MapPin className="h-3 w-3" />
            {t("ស្វែករកកន្លែង", "Discover Cambodia")}
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={anim.fadeUp}
            initial="hidden"
            animate="show"
            custom={0.08}
            className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.75rem]"
          >
            {isKhmer ? (
              <>
                ស្វែងរកកន្លែង
                <br className="hidden sm:block" />
                ទេសចរណ៍ដ៏ស្អាត
              </>
            ) : (
              <>
                Find Your Next
                <br className="hidden sm:block" />
                <span className="text-amber-400">Adventure</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={anim.fadeUp}
            initial="hidden"
            animate="show"
            custom={0.16}
            className="mb-12 max-w-lg text-base leading-relaxed text-stone-400 sm:text-lg"
          >
            {t(
              "ស្វាគមន៍មកកាន់ប្រទេសកម្ពុជា។ ស្វែងរកដើម្បីរកឃើញកន្លែងទេសចរណ៍ដ៏ស្អាត",
              "Explore breathtaking destinations across the Kingdom of Cambodia — from ancient temples to pristine coastlines.",
            )}
          </motion.p>

          {/* Search row */}
          <motion.div
            variants={anim.fadeUp}
            initial="hidden"
            animate="show"
            custom={0.24}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder={t(
                  "ស្វែងរកតាមឈ្មោះ ឬខេត្ត…",
                  "Search by name or province…",
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-stone-700 bg-stone-900/80 pl-11 pr-11 text-sm text-white placeholder-stone-500 outline-none backdrop-blur-sm transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 sm:text-base"
              />
              {/* <input
                type="text"
                placeholder={t("ស្វែងរកតាមពាក្យគន្លឹះ…", "Search by keyword…")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 rounded-xl border border-stone-700 bg-stone-900 px-4 text-sm text-white placeholder-stone-500 outline-none transition duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              /> */}
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Filter toggle button */}
            <motion.button
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex h-14 shrink-0 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all duration-200 ${
                showFilters || hasFilters
                  ? "border-amber-500 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "border-stone-700 bg-stone-900/80 text-stone-300 hover:border-stone-500 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("តម្រង", "Filters")}
              <AnimatePresence>
                {hasFilters && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-stone-950"
                  >
                    {(province !== "all" ? 1 : 0) + (query.trim() ? 1 : 0)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Expandable filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                key="filters"
                variants={reduceMotion ? {} : anim.filterPanel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select
                    value={province}
                    onValueChange={(value) => setProvince(value)}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl border border-stone-700 bg-stone-900 px-4 text-sm text-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <SelectValue
                        placeholder={t("ជ្រើសរើសខេត្ត", "Select a province")}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-900 border border-stone-700 text-stone-200">
                      <SelectGroup>
                        <SelectItem value="all">
                          {t("ខេត្តទាំងអស់", "All Provinces")}
                        </SelectItem>

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
                </div>

                <AnimatePresence>
                  {hasFilters && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={clearFilters}
                      className="mt-3 text-xs text-stone-500 underline underline-offset-2 hover:text-amber-400 transition"
                    >
                      {t("លុបតម្រងទាំងអស់", "Clear all filters")}
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── RESULTS (light / dark aware) ───────────────────────── */}
      <section className="min-h-[60vh] bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading && (
            <CenteredState>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5">
                <Loader className="h-7 w-7 animate-spin text-amber-500" />
              </div>
              <p className="text-sm font-medium tracking-wide text-stone-400 dark:text-stone-500">
                {t("កំពុងផ្ទុក…", "Loading destinations…")}
              </p>
            </CenteredState>
          )}

          {/* Empty state */}
          {!loading && visiblePlaces.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CenteredState>
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
                  <MapPin className="h-8 w-8 text-stone-300 dark:text-stone-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-stone-700 dark:text-stone-300">
                    {t("មិនមានលទ្ធផល", "No places found")}
                  </p>
                  <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
                    {t(
                      "សូមព្យាយាមស្វែងរកម្តងទៀត",
                      "Try adjusting your search or clearing filters",
                    )}
                  </p>
                </div>
                {hasFilters && (
                  <motion.button
                    whileHover={reduceMotion ? {} : { scale: 1.03 }}
                    whileTap={reduceMotion ? {} : { scale: 0.97 }}
                    onClick={clearFilters}
                    className="mt-1 rounded-xl border border-stone-300 dark:border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:border-amber-500 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400 transition"
                  >
                    {t("លុបតម្រង", "Clear filters")}
                  </motion.button>
                )}
              </CenteredState>
            </motion.div>
          )}

          {/* Results */}
          {!loading && visiblePlaces.length > 0 && (
            <>
              {/* Count + active filter chips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-7 flex flex-wrap items-center gap-2.5"
              >
                <p className="text-sm font-medium text-stone-400 dark:text-stone-500">
                  {isKhmer
                    ? `${visiblePlaces.length} កន្លែង`
                    : `${visiblePlaces.length} destination${visiblePlaces.length !== 1 ? "s" : ""}`}
                </p>
                <AnimatePresence>
                  {province !== "all" && (
                    <FilterChip
                      label={province}
                      onRemove={() => setProvince("all")}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Cards grid */}
              <motion.div
                key={`${query}-${province}`}
                variants={anim.cardGrid}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {visiblePlaces.map((place) => (
                    <motion.div
                      key={place.id}
                      variants={anim.card}
                      exit="exit"
                      layout
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
