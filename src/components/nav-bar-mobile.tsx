'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AuthLinks from '@/components/auth-links';
import ThemeToggle from '@/components/theme-toggle';

const NavBarMobile = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='md:hidden'>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side='bottom' className='flex h-[450px] items-center justify-end'>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription className='flex flex-col items-end gap-10 text-right text-3xl'>
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
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavBarMobile;
