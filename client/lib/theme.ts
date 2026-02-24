export type Theme = 'light' | 'dark';

export const getTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) return savedTheme;

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export const setTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme);
  updateTheme(theme);
};

export const updateTheme = (theme: Theme) => {
  const html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

export const initTheme = () => {
  const theme = getTheme();
  updateTheme(theme);
  return theme;
};
