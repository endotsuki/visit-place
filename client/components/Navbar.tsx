import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { getTheme, setTheme } from '@/lib/theme';
import { Link, useLocation } from 'wouter';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, LogoutSquare01Icon, Menu01Icon, Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons';
import MobileMenu from './Mobilemenu';
import { Button, buttonVariants } from './ui/button';

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
    setMenuOpen(false);
  }, [location]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate('/');
  };

  const navLinks = [{ to: '/', label: t('home') }, ...(isAdmin ? [{ to: '/admin', label: t('admin') }] : [])];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#0a0a0f] transition-all duration-300 dark:bg-[#0a0a0f] ${
        scrolled ? 'border-b border-white/[0.07] shadow-[0_1px_40px_rgba(0,0,0,0.6)]' : 'border-b border-transparent'
      }`}
    >
      <div className='mx-auto flex h-[58px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8'>
        {/* Brand */}
        <Link to='/' className='group flex shrink-0 items-center gap-2.5'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary via-primary/50 to-violet-400 text-[15px] transition-transform duration-200 group-hover:scale-[1.07]'>
            <img src='/logo.svg' alt='' />
          </div>
          <p className='text-xl font-medium text-white/90'>Derleng</p>
        </Link>

        {/* Desktop controls */}
        <div className='hidden items-center gap-1.5 md:flex'>
          {/* Theme toggle */}
          <Button variant='archived' size='icon' onClick={toggleTheme} aria-label='Toggle theme'>
            <HugeiconsIcon icon={theme === 'light' ? Moon02Icon : Sun01Icon} size={20} />
          </Button>

          {(['km', 'en'] as const).map((lang) => (
            <Button
              key={lang}
              variant='archived'
              onClick={() => changeLanguage(lang)}
              className={`rounded-[6px] px-2.5 py-[3px] text-[11px] font-semibold tracking-wide transition-all duration-150 ${
                i18n.language === lang ? buttonVariants({ variant: 'default' }) : buttonVariants({ variant: 'archived' })
              }`}
            >
              {lang === 'km' ? 'ខ្មែរ' : 'EN'}
            </Button>
          ))}

          {isAdmin && (
            <>
              <div className='mx-px h-4 w-px bg-white/30' />
              <Button variant='blocked' onClick={signOut}>
                <HugeiconsIcon icon={LogoutSquare01Icon} className='h-3.5 w-3.5' />
                Sign out
              </Button>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <Button onClick={() => setMenuOpen((v) => !v)} size='icon' aria-label='Toggle menu' className='md:hidden'>
          <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} className='h-[18px] w-[18px]' />
        </Button>
      </div>

      <MobileMenu
        open={menuOpen}
        theme={theme}
        isAdmin={isAdmin}
        onToggleTheme={toggleTheme}
        onSignOut={signOut}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
