import { useEffect, useState } from 'react';
import { ClassValue, clsx } from 'clsx';
import { cleanEnv, str } from 'envalid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//* ──────────────────────────────────────────────────��

export const env = cleanEnv(process.env, {});

//* ──────────────────────────────────────────────────��

export const MOBILE = 'tablet';
export const TABLET = 'desktop';
export const DESKTOP = 'large desktop';

export type Devices = typeof MOBILE | typeof TABLET | typeof DESKTOP | undefined;

export const useWindowSize = (): Devices => {
  const [currentDevice, setCurrentDevice] = useState<Devices>(undefined);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1601) {
        setCurrentDevice(DESKTOP);
      } else if (width >= 750) {
        setCurrentDevice(TABLET);
      } else {
        setCurrentDevice(MOBILE);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return currentDevice;
};
