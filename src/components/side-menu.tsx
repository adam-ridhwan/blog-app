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
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const prevScrollY = useRef(64);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevScrollY.current;

      if (currentScrollY < 64) return (sidebarRef.current.scrollTop = 0);

      if (currentScrollY > prevScrollY.current) sidebarRef.current.scrollTop += scrollAmount; // scrolling down
      if (currentScrollY < prevScrollY.current) sidebarRef.current.scrollTop += scrollAmount; // scrolling up

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const preventManualScroll = e => e.preventDefault();

    const node = sidebarRef.current;

    if (node) {
      node.addEventListener('wheel', preventManualScroll);
      return () => node.removeEventListener('wheel', preventManualScroll);
    }
  }, []);

  return (
    <>
      <div
        className={cn(
          `sticky top-0 ml-5 hidden h-[100dvh] min-w-[350px] border-l border-l-border
          bg-red pl-5 outline outline-amber-500 
          lg:flex lg:flex-col`
        )}
      >
        <div ref={sidebarRef} className='overflow-auto'>
          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>{"What's hot"}</h2>
            <h1 className='text-2xl font-semibold'>Most popular</h1>
            <MostPopularPosts />
          </div>

          <Separator orientation='horizontal' className='my-2' />

          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>Discover by topic</h2>
            <h1 className='text-2xl font-semibold'>Categories</h1>

            <div className='mt-6 flex flex-wrap gap-2'>
              {categories.map(category => {
                return (
                  <Link
                    key={category}
                    href={`/blog?category=${category}`}
                    className={cn(
                      `flex h-[35px] w-max items-center justify-center rounded-md bg-secondary px-5 text-secondary-foreground hover:bg-secondary/80`
                    )}
                  >
                    <span className='whitespace-nowrap text-sm text-primary'>{capitalize(category)}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Separator orientation='horizontal' className='my-2' />

          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>Chosen by editor</h2>
            <h1 className='text-2xl font-semibold'>{"Editor's picks"}</h1>
            <SideMenuPosts withImage={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
