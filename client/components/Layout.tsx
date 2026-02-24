import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { getTheme, setTheme } from '@/lib/theme';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initialize theme
    const initialTheme = getTheme();
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <span className="text-white font-bold text-lg">🇰🇭</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">Discover Cambodia</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-4">
                <Link
                  to="/"
                  className={`font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('home')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`font-medium transition-colors ${
                      location.pathname === '/admin'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('admin')}
                  </Link>
                )}
              </nav>

              {/* Language Switcher & Theme Toggle */}
              <div className="flex items-center gap-2 border-l border-border pl-6">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => handleLanguageChange('km')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    i18n.language === 'km'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">ខ្មែរ</span>
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    i18n.language === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">EN</span>
                </button>

                {/* Logout Button for Admin */}
                {isAdmin && (
                  <Button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsAdmin(false);
                      navigate('/');
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-1 ml-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <nav className="flex flex-col gap-2 mb-4">
                <Link
                  to="/"
                  className={`font-medium py-2 px-2 rounded-lg ${
                    location.pathname === '/'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`font-medium py-2 px-2 rounded-lg ${
                      location.pathname === '/admin'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('admin')}
                  </Link>
                )}
              </nav>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={toggleTheme}
                  className="flex-1 py-2 px-2 text-muted-foreground hover:bg-muted rounded-lg transition-all flex items-center justify-center gap-1"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>

                <button
                  onClick={() => {
                    handleLanguageChange('km');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    i18n.language === 'km'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">ខ្មែរ</span>
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    i18n.language === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">EN</span>
                </button>

                {isAdmin && (
                  <Button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsAdmin(false);
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">{children}</main>
    </div>
  );
}
