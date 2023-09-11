'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useThemeContext } from '@/context/theme-context-provider';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { divRef } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <div ref={divRef} className='main-container'>
        {children}
      </div>
    </>
  );
};

export default ThemeProvider;
