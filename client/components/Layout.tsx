import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getTheme, setTheme } from "@/lib/theme";
import { Link, useLocation } from "wouter";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  LogoutSquare01Icon,
  Menu01Icon,
  Moon02Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";

// ─── Types ────────────────────────────────────────────────────────
interface Props {
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────
export default function Layout({ children }: Props) {
  const { i18n, t } = useTranslation();
  const [location, navigate] = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme);

  // ── Side effects ──────────────────────────────────────────────
  // Check if user is logged in as admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsAdmin(!!data.user));
  }, []);

  // Track scroll to add nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // ── Helpers ───────────────────────────────────────────────────
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    setTheme(next);
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate("/");
  }

  const navLinks = [
    { to: "/", label: t("home") },
    ...(isAdmin ? [{ to: "/admin", label: t("admin") }] : []),
  ];

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans transition-colors duration-300">
      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm border-b border-stone-200/60 dark:border-stone-800"
            : "bg-white dark:bg-stone-900 border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-200 dark:shadow-amber-900/40 transition-transform duration-200 group-hover:scale-105">
                <span className="select-none text-lg leading-none">🇰🇭</span>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="block text-[15px] font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Discover
                </span>
                <span className="block mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Cambodia
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location === to
                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {label}
                  {location === to && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-500" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-1.5">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition"
              >
                {theme === "light" ? (
                  <HugeiconsIcon icon={Moon02Icon} className="h-4 w-4" />
                ) : (
                  <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4" />
                )}
              </button>

              {/* Language pills */}
              <div className="flex items-center gap-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 p-0.5">
                {(["km", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                      i18n.language === lang
                        ? "bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                    }`}
                  >
                    {lang === "km" ? "ខ្មែរ" : "EN"}
                  </button>
                ))}
              </div>

              {/* Sign out */}
              {isAdmin && (
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  <HugeiconsIcon
                    icon={LogoutSquare01Icon}
                    className="h-3.5 w-3.5"
                  />{" "}
                  Sign out
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              {menuOpen ? (
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
              ) : (
                <HugeiconsIcon icon={Menu01Icon} className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {/* Nav links */}
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      location === to
                        ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                        : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                {/* Controls row */}
                <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 dark:border-stone-800 pt-3 mt-3">
                  {/* Theme */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  >
                    {theme === "light" ? (
                      <HugeiconsIcon icon={Moon02Icon} className="h-4 w-4" />
                    ) : (
                      <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4" />
                    )}
                    {theme === "light" ? "Dark mode" : "Light mode"}
                  </button>

                  {/* Language */}
                  <div className="flex items-center gap-0.5 rounded-xl bg-stone-100 dark:bg-stone-800 p-0.5">
                    {(["km", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          changeLanguage(lang);
                          setMenuOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          i18n.language === lang
                            ? "bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-sm"
                            : "text-stone-500 dark:text-stone-400"
                        }`}
                      >
                        {lang === "km" ? "ខ្មែរ" : "EN"}
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      <HugeiconsIcon
                        icon={LogoutSquare01Icon}
                        className="h-4 w-4"
                      />{" "}
                      Sign out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page content ── */}
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
