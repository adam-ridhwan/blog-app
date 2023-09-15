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
    const mainContainerDiv = mainContainerRef.current;
    const htmlElement = document.documentElement;
    const body = document.body;
    htmlElement.classList.add('dark');
    body.classList.add('dark');
    mainContainerDiv?.classList.add('dark');
  };

  const removeDarkClass = () => {
    const mainContainerDiv = mainContainerRef.current;
    const htmlElement = document.documentElement;
    const body = document.body;
    htmlElement.classList.remove('dark');
    body.classList.remove('dark');
    mainContainerDiv?.classList.remove('dark');
  };

  useEffect(() => {
    const mainContainerDiv = mainContainerRef.current;
    if (!mounted || !darkQuery || !mainContainerDiv) return;

    const themeActions = {
      system: () => (darkQuery.matches ? addDarkClass() : removeDarkClass()),
      dark: () => addDarkClass(),
      light: () => removeDarkClass(),
    };

    themeActions[theme] && themeActions[theme]();
  }, [theme, mounted, darkQuery]);

  useEffect(() => {
    const mainContainerDiv = mainContainerRef.current;
    if (theme !== 'system' || !darkQuery || !mainContainerDiv) return;

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
