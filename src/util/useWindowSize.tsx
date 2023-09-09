'use client';

import { useEffect, useState } from 'react';

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
