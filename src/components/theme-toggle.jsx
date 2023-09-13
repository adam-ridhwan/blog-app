'use client';

import { useEffect, useState } from 'react';
import { themeAtom } from '@/provider/theme-provider';
import { useAtom } from 'jotai';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ThemeToggle = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const [isMounted, setIsMounted] = useState(false);

  const themeIcons = {
    light: <Sun className='h-4 w-4' />,
    dark: <Moon className='h-4 w-4' />,
    system: <Monitor className='h-4 w-4' />,
  };

  const themeText = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  const toggleTheme = value => {
    if (['light', 'dark', 'system'].includes(value)) {
      setTheme(value);
    }
  };

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <Select onValueChange={toggleTheme}>
        <SelectTrigger aria-label='Theme' className='w-[80px]'>
          <SelectValue
            placeholder={
              <div className='flex flex-row items-center gap-2'>
                {themeIcons[theme] || null}
                <span>{themeText[theme] || null}</span>
              </div>
            }
          />
        </SelectTrigger>

        <SelectContent align='end'>
          <SelectItem value='system'>
            <div className='flex flex-row items-center gap-2'>
              <Monitor className='h-4 w-4' />
              <span>System</span>
            </div>
          </SelectItem>
          <SelectItem value='light' onClick={() => setTheme('light')}>
            <div className='flex flex-row items-center gap-2'>
              <Sun className='h-4 w-4' />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value='dark' onClick={() => setTheme('dark')}>
            <div className='flex flex-row items-center gap-2'>
              <Moon className='h-4 w-4' />
              <span>Dark</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default ThemeToggle;
