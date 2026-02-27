import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { HugeiconsIcon } from '@hugeicons/react';
import { LogoutSquare01Icon, Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons';
import { Button } from './ui/button';

interface NavLink {
  to: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  theme: 'light' | 'dark';
  isAdmin: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

export default function MobileMenu({ open, theme, isAdmin, onToggleTheme, onSignOut, onClose }: MobileMenuProps) {
  const { i18n } = useTranslation();
  const [location] = useLocation();

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key='mobile-menu'
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className='overflow-hidden border-t border-stone-100/80 bg-white/95 backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-900/95 md:hidden'
        >
          <div className='px-5 py-5'>
            {/* Divider */}
            <div className='mb-4 h-px bg-stone-100 dark:bg-stone-800' />

            {/* Controls */}
            <div className='flex flex-wrap items-center gap-2'>
              {/* Theme toggle */}
              <button
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className='flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              >
                <HugeiconsIcon icon={theme === 'light' ? Moon02Icon : Sun01Icon} className='h-3.5 w-3.5' />
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>

              {/* Language pills */}
              <div className='flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5 dark:border-stone-700 dark:bg-stone-800'>
                {(['km', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      i18n.language === lang
                        ? 'bg-white text-primary shadow-sm dark:bg-stone-700 dark:text-primary/80'
                        : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                    }`}
                  >
                    {lang === 'km' ? 'ខ្មែរ' : 'EN'}
                  </button>
                ))}
              </div>

              {/* Sign out */}
              {isAdmin && (
                <Button
                  variant='blocked'
                  size='sm'
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                >
                  <HugeiconsIcon icon={LogoutSquare01Icon} className='h-3.5 w-3.5' />
                  Sign out
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
