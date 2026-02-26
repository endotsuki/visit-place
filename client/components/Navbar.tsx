import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { getTheme, setTheme } from '@/lib/theme';
import { Link, useLocation } from 'wouter';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, LogoutSquare01Icon, Menu01Icon, Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons';
import MobileMenu from './Mobilemenu';

export default function Navbar() {
  const { i18n, t } = useTranslation();
  const [location, navigate] = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>(getTheme);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsAdmin(!!data.user));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate('/');
  }

  const navLinks = [{ to: '/', label: t('home') }, ...(isAdmin ? [{ to: '/admin', label: t('admin') }] : [])];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'border-b border-stone-200/50 bg-white/85 shadow-[0_1px_20px_-5px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-stone-800/50 dark:bg-stone-950/85'
          : 'border-b border-transparent bg-white dark:bg-stone-950'
      }`}
    >
      <div className='mx-auto max-w-6xl px-5 sm:px-8 lg:px-10'>
        <div className='flex h-[60px] items-center justify-between'>
          {/* ── Brand ── */}
          <Link to='/' className='group flex shrink-0 items-center gap-3'>
            {/* Logo mark */}
            <div className='relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-[0_2px_12px_rgba(245,158,11,0.4)] transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.5)]'>
              <span className='select-none text-base leading-none'>🇰🇭</span>
              {/* Subtle shine overlay */}
              <div className='absolute inset-0 rounded-[10px] bg-gradient-to-b from-white/20 to-transparent' />
            </div>

            {/* Wordmark */}
            <div className='hidden leading-none sm:block'>
              <p className='text-[14px] font-bold tracking-[-0.02em] text-stone-900 dark:text-stone-50'>Discover</p>
              <p className='mt-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-500'>Cambodia</p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className='hidden items-center gap-0.5 md:flex'>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  location === to
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                {label}
                {/* Active underline */}
                <span
                  className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-amber-500 transition-all duration-300 ${
                    location === to ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  } origin-center`}
                />
              </Link>
            ))}
          </nav>

          {/* ── Desktop controls ── */}
          <div className='hidden items-center gap-1 md:flex'>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-all duration-200 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200'
            >
              <HugeiconsIcon icon={theme === 'light' ? Moon02Icon : Sun01Icon} className='h-[15px] w-[15px]' />
            </button>

            {/* Language pills */}
            <div className='ml-0.5 flex items-center gap-0.5 rounded-lg bg-stone-100/80 p-0.5 dark:bg-stone-800/80'>
              {(['km', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
                    i18n.language === lang
                      ? 'bg-white text-amber-700 shadow-sm dark:bg-stone-700 dark:text-amber-400'
                      : 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200'
                  }`}
                >
                  {lang === 'km' ? 'ខ្មែរ' : 'EN'}
                </button>
              ))}
            </div>

            {/* Divider */}
            {isAdmin && <div className='mx-1 h-4 w-px bg-stone-200 dark:bg-stone-700' />}

            {/* Sign out */}
            {isAdmin && (
              <button
                onClick={signOut}
                className='flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-stone-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400'
              >
                <HugeiconsIcon icon={LogoutSquare01Icon} className='h-3.5 w-3.5' />
                Sign out
              </button>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label='Toggle menu'
            className='flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 md:hidden'
          >
            <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} className='h-[18px] w-[18px]' />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <MobileMenu
        open={menuOpen}
        navLinks={navLinks}
        theme={theme}
        isAdmin={isAdmin}
        onToggleTheme={toggleTheme}
        onSignOut={signOut}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
