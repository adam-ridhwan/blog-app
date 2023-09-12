'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthLinks from '@/components/auth-links';
import NavBarMobile from '@/components/nav-bar-mobile';
import SideMenu from '@/components/side-menu';
import ThemeToggle from '@/components/theme-toggle';
import WriteOrPublishButton from '@/components/write-or-publish-button';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';

const NavBarDesktop = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const navbarPositionRef = useRef(0);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const prevBodyScrollY = useRef(0);
  const prevSidebarScrollY = useRef(64);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current || pathname === '/write-a-post') return;

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

      if (currentScrollY > 1) setIsAvatarDropdownOpen(false);

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
          <Link href='/' className='flex-1 text-3xl font-bold'>
            Pondero
          </Link>
          <div className='flex flex-1 items-center justify-end gap-3'>
            <div className='flex items-center gap-5'>
              {status}

              {status === 'authenticated' && <WriteOrPublishButton />}

              <ThemeToggle />

              {status === 'authenticated' ? (
                <DropdownMenu open={isAvatarDropdownOpen} onOpenChange={setIsAvatarDropdownOpen} modal={false}>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src='https://github.com/shadcn.png' />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[250px] p-0'>
                    <div className='py-[16px]'>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted-foreground hover:text-primary'>
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted-foreground hover:text-primary'>
                        <span>Posts</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted-foreground hover:text-primary'>
                        <span></span>
                        <span>Saved</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted-foreground hover:text-primary'>
                        <span>Analytics</span>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />

                    <div className='py-[16px]'>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted-foreground'>
                        <button className='flex flex-col' onClick={() => signOut()}>
                          <span className='hover:text-primary'>Sign out</span>
                          <span>{session?.user?.email}</span>
                        </button>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog>
                  <DialogTrigger>
                    <Avatar>
                      <AvatarImage src='https://github.com/shadcn.png' />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className='flex h-[400px] justify-center p-[40px] text-center'>
                    <DialogHeader className='flex items-center'>
                      <DialogTitle className='text-center text-2xl text-primary'>Welcome back.</DialogTitle>
                      <DialogDescription className='flex flex-col gap-4 py-[40px] text-primary '>
                        <Button variant='outline' className='w-[250px]' onClick={() => signIn('google')}>
                          Sign in with Google
                        </Button>
                        <Button variant='outline' className='w-[250px]'>
                          Sign in with Email
                        </Button>
                      </DialogDescription>
                      <div>
                        <span className='text-primary'>Don&apos;t have an account? </span>
                        <span className='cursor-pointer font-semibold text-primary hover:text-primary/80'>
                          Create one
                        </span>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {pathname === '/' && <SideMenu sidebarRef={sidebarRef} />}
        </div>
      </div>
    </>
  );
};

export default NavBarDesktop;
