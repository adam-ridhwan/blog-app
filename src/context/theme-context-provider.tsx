'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type ThemeContextType = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  divRef: RefObject<HTMLDivElement>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export type Theme = 'light' | 'dark' | 'system';

const getThemeFromLocalStorage = (): Theme => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('theme') as Theme) || 'system';
  }
  return 'system';
};

export default function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage());
  const [mounted, setMounted] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [darkQuery, setDarkQuery] = useState<MediaQueryList | null>(null);

  useEffect(() => {
    setMounted(true);
    setDarkQuery(window.matchMedia('(prefers-color-scheme: dark)'));
  }, []);

  useEffect(() => {
    if (!mounted || !divRef.current || !darkQuery) return;

    const div = divRef.current;
    const themeActions = {
      system: () => (darkQuery.matches ? div.classList.add('dark') : div.classList.remove('dark')),
      dark: () => div.classList.add('dark'),
      light: () => div.classList.remove('dark'),
    };

    themeActions[theme] && themeActions[theme]();
  }, [theme, mounted, darkQuery]);

  useEffect(() => {
    if (theme !== 'system' || !darkQuery) return;

    const handleChange = () => {
      if (!divRef.current) return;

      const div = divRef.current;
      darkQuery.matches ? div.classList.add('dark') : div.classList.remove('dark');
    };

    darkQuery.addEventListener('change', handleChange);
    return () => darkQuery.removeEventListener('change', handleChange);
  }, [theme, darkQuery]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme, divRef }}>{children}</ThemeContext.Provider>
    </>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a ThemeContextProvider');
  return context;
}
