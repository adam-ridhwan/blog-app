import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AuthLinks from '@/components/auth-links';
import NavBarSide from '@/components/nav-bar-side';
import ThemeToggle from '@/components/theme-toggle';

const NavBar = () => {
  return (
    <>
      <div className='flex h-24 items-center justify-between'>
        <div className='hidden lg:flex lg:flex-1 lg:gap-1'>
          <Image src='/facebook.png' alt='facebook' width={24} height={24} />
          <Image src='/instagram.png' alt='instagram' width={24} height={24} />
          <Image src='/twitter.png' alt='twitter' width={24} height={24} />
          <Image src='/youtube.png' alt='youtube' width={24} height={24} />
        </div>
        <div className='flex-1 text-3xl font-bold lg:text-center'>loremblog</div>
        <div className='flex flex-1 items-center justify-end gap-3'>
          <ThemeToggle />
          <div className='hidden md:flex md:gap-3'>
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
          <NavBarSide />
        </div>
      </div>
    </>
  );
};

export default NavBar;
