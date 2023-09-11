'use client';

import { useEffect, useState } from 'react';
import { ThemeContext, useThemeContext } from '@/context/theme-context-provider';
import { ChevronRight, Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeContext();
  const [isMounted, setIsMounted] = useState(false);

  const themeIcons = {
    light: <Sun className='h-4 w-4' />,
    dark: <Moon className='h-4 w-4' />,
    system: <Monitor className='h-4 w-4' />,
  };

  const themeToggles = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  };

  const toggleTheme = () => {
    const newTheme = themeToggles[theme] || 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <Button variant='outline' size='icon' onClick={toggleTheme}>
        {themeIcons[theme] || null}
      </Button>
    </>
  );
};

export default ThemeToggle;
