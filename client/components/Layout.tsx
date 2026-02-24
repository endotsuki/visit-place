import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Menu, X, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getTheme, setTheme } from "@/lib/theme";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n, t } = useTranslation();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const initialTheme = getTheme();
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAdmin(!!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  const navLinks = [
    { to: "/", label: t("home") },
    ...(isAdmin ? [{ to: "/admin", label: t("admin") }] : []),
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border-b border-amber-100/60 dark:border-zinc-800"
            : "bg-white dark:bg-zinc-900 border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* ── Brand ── */}
            <Link to="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-200 dark:shadow-amber-900/40 transition-transform duration-200 group-hover:scale-105">
                <span className="text-lg leading-none select-none">🇰🇭</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
                  Discover
                </span>
                <span className="block text-[11px] font-medium tracking-widest text-amber-600 dark:text-amber-400 uppercase leading-none mt-0.5">
                  Cambodia
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location === to
                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                  {location === to && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Desktop Controls ── */}
            <div className="hidden md:flex items-center gap-1.5">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>

              {/* Language Pills */}
              <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5">
                {(["km", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                      i18n.language === lang
                        ? "bg-white dark:bg-zinc-700 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {lang === "km" ? "ខ្មែរ" : "EN"}
                  </button>
                ))}
              </div>

              {/* Logout */}
              {isAdmin && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsAdmin(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 space-y-1">
            {/* Nav Links */}
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location === to
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Divider */}
            <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 flex-wrap">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
              </button>

              {/* Language toggle */}
              <div className="flex items-center gap-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-0.5">
                {(["km", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      handleLanguageChange(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      i18n.language === lang
                        ? "bg-white dark:bg-zinc-700 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {lang === "km" ? "ខ្មែរ" : "EN"}
                  </button>
                ))}
              </div>

              {/* Logout */}
              {isAdmin && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsAdmin(false);
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
