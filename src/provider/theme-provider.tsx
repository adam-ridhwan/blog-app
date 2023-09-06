'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useThemeContext } from '@/context/theme-context-provider';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { ref } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div ref={ref}>{children}</div>
    </>
  );
};

export default ThemeProvider;
