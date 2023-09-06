import Image from 'next/image';
import Link from 'next/link';

import AuthLinks from '@/components/auth-links';
import ThemeToggle from '@/components/theme-toggle';

const NavBar = () => {
  return (
    <>
      <div className='flex h-24 items-center justify-between'>
        <div className='flex flex-1 gap-1'>
          <Image src='/facebook.png' alt='facebook' width={24} height={24} />
          <Image src='/instagram.png' alt='instagram' width={24} height={24} />
          <Image src='/twitter.png' alt='twitter' width={24} height={24} />
          <Image src='/youtube.png' alt='youtube' width={24} height={24} />
        </div>
        <div className='flex-1 text-center text-3xl font-bold'>loremblog</div>
        <div className='flex flex-1 items-center justify-end gap-2'>
          <ThemeToggle />
          <Link href=''>Homepage</Link>
          <Link href=''>Contact</Link>
          <Link href=''>About</Link>
          <AuthLinks />
        </div>
      </div>
    </>
  );
};

export default NavBar;
