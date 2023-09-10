'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { capitalize } from '@/util';
import { cn } from '@/util/cn';
import { categories } from '@/util/constants';

import { Separator } from '@/components/ui/separator';
import MostPopularPosts from '@/components/most-popular-posts';
import SideMenuPosts from '@/components/side-menu-posts';

const SideMenu = () => {
  return (
    <>
      <div className='ml-5 hidden h-[100dvh] min-w-[350px] lg:flex lg:flex-col'>placeholder</div>
    </>
  );
};

export default SideMenu;
