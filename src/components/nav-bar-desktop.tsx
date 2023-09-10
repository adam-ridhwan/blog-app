'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import AuthLinks from '@/components/auth-links';
import NavBarMobile from '@/components/nav-bar-mobile';
import ThemeToggle from '@/components/theme-toggle';
import WritePostButton from '@/components/write-post-button';

const NavBarDesktop = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollY = useRef(0);
  const positionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevScrollY.current;

      if (currentScrollY > prevScrollY.current) {
        positionRef.current = Math.max(positionRef.current - scrollAmount, -headerRef.current.offsetHeight);
      } else {
        positionRef.current = Math.min(positionRef.current - scrollAmount, 0);
      }

      headerRef.current.style.transform = `translateY(${positionRef.current}px)`;

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={headerRef} className='sticky top-0 z-20 border-b border-b-border bg-green'>
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
      </div>
    </>
  );
};

export default NavBarDesktop;
