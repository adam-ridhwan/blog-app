'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AuthLinks from '@/components/auth-links';
import NavBarMobile from '@/components/nav-bar-mobile';
import SideMenu from '@/components/side-menu';
import ThemeToggle from '@/components/theme-toggle';
import WritePostButton from '@/components/write-post-button';

const NavBarDesktop = () => {
  const pathname = usePathname();
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
        <div className='container relative flex h-16 items-center justify-between'>
          <div className='flex-1 text-3xl font-bold'>skidddle</div>
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

          {pathname === '/' && <SideMenu sidebarRef={sidebarRef} />}
        </div>
      </div>
    </>
  );
};

export default NavBarDesktop;
