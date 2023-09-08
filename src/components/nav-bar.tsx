import Image from 'next/image';
import Link from 'next/link';

import AuthLinks from '@/components/auth-links';
import NavBarMobile from '@/components/nav-bar-mobile';
import ThemeToggle from '@/components/theme-toggle';

const NavBar = () => {
  return (
    <>
      <div className='flex h-24 items-center justify-between'>
        <div className='hidden lg:flex lg:flex-1 lg:gap-2'>
          <Image src='/facebook.png' alt='facebook' width={24} height={24} className='cursor-pointer' />
          <Image src='/instagram.png' alt='instagram' width={24} height={24} className='cursor-pointer' />
          <Image src='/twitter.png' alt='twitter' width={24} height={24} className='cursor-pointer' />
          <Image src='/youtube.png' alt='youtube' width={24} height={24} className='cursor-pointer' />
        </div>
        <div className='flex-1 text-3xl font-bold lg:text-center'>loremblog</div>
        <div className='flex flex-1 items-center justify-end gap-3'>
          <div className='hidden items-center md:flex md:gap-3'>
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
    </>
  );
};

export default NavBar;
