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
    const node = mainContainerRef.current;
    const body = document.body;
    body.classList.add('dark');
    node?.classList.add('dark');
  };

  const removeDarkClass = () => {
    const node = mainContainerRef.current;
    const body = document.body;
    body.classList.remove('dark');
    node?.classList.remove('dark');
  };

  useEffect(() => {
    const node = mainContainerRef.current;
    if (!mounted || !darkQuery || !node) return;

    const themeActions = {
      system: () => (darkQuery.matches ? addDarkClass() : removeDarkClass()),
      dark: () => addDarkClass(),
      light: () => removeDarkClass(),
    };

    themeActions[theme] && themeActions[theme]();
  }, [theme, mounted, darkQuery]);

  useEffect(() => {
    const node = mainContainerRef.current;
    if (theme !== 'system' || !darkQuery || !node) return;

    const handleChange = () => (darkQuery.matches ? addDarkClass() : removeDarkClass());

    darkQuery.addEventListener('change', handleChange);
    return () => darkQuery.removeEventListener('change', handleChange);
  }, [theme, darkQuery]);

  return (
    <>
      {!mounted ? null : (
        <div ref={mainContainerRef} className='main-container'>
          {children}
        </div>
      )}
    </>
  );
};

export default ThemeProvider;
