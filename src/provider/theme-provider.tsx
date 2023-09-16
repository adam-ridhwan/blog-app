'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark' | 'system';

export const themeAtom = atomWithStorage<Theme>('theme', 'system');

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAtomValue(themeAtom);
  const [darkQuery, setDarkQuery] = useState<MediaQueryList | null>(null);
  const [mounted, setMounted] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setDarkQuery(window.matchMedia('(prefers-color-scheme: dark)'));
  }, []);

  const addDarkClass = () => {
    const div = mainContainerRef.current;
    const html = document.documentElement;
    const body = document.body;

    html.classList.add('dark');
    html.style.setProperty('color-scheme', 'dark');
    body.classList.add('dark');
    div?.classList.add('dark');
  };

  const removeDarkClass = () => {
    const div = mainContainerRef.current;
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove('dark');
    html.style.setProperty('color-scheme', 'light');
    body.classList.remove('dark');
    div?.classList.remove('dark');
  };

  useEffect(() => {
    const div = mainContainerRef.current;
    if (!mounted || !darkQuery || !div) return;

    const themeActions = {
      system: () => (darkQuery.matches ? addDarkClass() : removeDarkClass()),
      dark: () => addDarkClass(),
      light: () => removeDarkClass(),
    };

    themeActions[theme] && themeActions[theme]();
  }, [theme, mounted, darkQuery]);

  useEffect(() => {
    const div = mainContainerRef.current;
    if (theme !== 'system' || !darkQuery || !div) return;

    const handleChange = () => (darkQuery.matches ? addDarkClass() : removeDarkClass());

    darkQuery.addEventListener('change', handleChange);
    return () => darkQuery.removeEventListener('change', handleChange);
  }, [theme, darkQuery]);

  return (
    <>
      {!mounted ? null : (
        <div ref={mainContainerRef} className='main-container min-h-screen max-w-[100vw]'>
          {children}
        </div>
      )}
    </>
  );
};

export default ThemeProvider;
