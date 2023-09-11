'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { capitalize } from '@/util';
import { cn } from '@/util/cn';
import { categories } from '@/util/constants';

import { Separator } from '@/components/ui/separator';
import AuthLinks from '@/components/auth-links';
import MostPopularPosts from '@/components/most-popular-posts';
import NavBarMobile from '@/components/nav-bar-mobile';
import SideMenuPosts from '@/components/side-menu-posts';
import ThemeToggle from '@/components/theme-toggle';
import WritePostButton from '@/components/write-post-button';

const NavBarDesktop = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const navbarPositionRef = useRef(0);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const prevBodyScrollY = useRef(0);
  const prevSidebarScrollY = useRef(64);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevBodyScrollY.current;

      navbarPositionRef.current =
        currentScrollY > prevBodyScrollY.current
          ? Math.max(navbarPositionRef.current - scrollAmount, -navbarRef.current.offsetHeight)
          : Math.min(navbarPositionRef.current - scrollAmount, 0);

      navbarRef.current.style.transform = `translateY(${navbarPositionRef.current}px)`;

      prevBodyScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevSidebarScrollY.current;

      if (currentScrollY < 64) return (sidebarRef.current.scrollTop = 0);

      sidebarRef.current.scrollTop += scrollAmount;

      prevSidebarScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   const preventManualScroll = e => e.preventDefault();
  //
  //   const node = sidebarRef.current;
  //
  //   if (node) {
  //     node.addEventListener('wheel', preventManualScroll);
  //     return () => node.removeEventListener('wheel', preventManualScroll);
  //   }
  // }, []);

  return (
    <>
      <div ref={navbarRef} className='fixed top-0 z-20 w-full border-b border-b-border bg-background'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex-1 text-3xl font-bold'>loremblog</div>
          <div className='flex flex-1 items-center justify-end gap-3'>
            <div className='hidden items-center md:flex md:gap-3'>
              <WritePostButton />
              <ThemeToggle />
              <Link href='' className=''>
                Homepage
              </Link>
              <Link href='' className=''>
                Contact
              </Link>
              <Link href='' className=''>
                About
              </Link>
              <AuthLinks />
            </div>
            <NavBarMobile />
          </div>
        </div>

        <div
          className={cn(
            `absolute right-[32px] top-[65px] ml-5 hidden h-[100dvh] min-w-[350px] max-w-[350px] border-l border-l-border
            bg-background pl-5 lg:flex lg:flex-col`
          )}
        >
          <div ref={sidebarRef} className='hide-scrollbar overflow-auto'>
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
      </div>
    </>
  );
};

export default NavBarDesktop;
