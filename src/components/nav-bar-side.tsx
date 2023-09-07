'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AuthLinks from '@/components/auth-links';

const NavBarSide = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='md:hidden'>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription className='flex flex-col gap-3 text-2xl'>
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

export default NavBarSide;
