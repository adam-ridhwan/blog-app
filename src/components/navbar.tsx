'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import SideMenu from '@/components/side-menu';
import ThemeToggle from '@/components/theme-toggle';
import WriteOrPublishButton from '@/components/write-or-publish-button';

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const navbarPositionRef = useRef(0);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const prevBodyScrollY = useRef(0);
  const prevSidebarScrollY = useRef(64);

  useEffect(() => {
    if (window.location.hash === '#_=_') router.replace('/');
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current || pathname === '/write-a-post') return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevBodyScrollY.current;

      navbarPositionRef.current =
        currentScrollY > prevBodyScrollY.current
          ? Math.max(navbarPositionRef.current - scrollAmount, -navbarRef.current.offsetHeight)
          : Math.min(navbarPositionRef.current - scrollAmount, 0);

      if (currentScrollY > 0) {
        navbarRef.current.style.transform = `translateY(${navbarPositionRef.current}px)`;
        prevBodyScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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

  return (
    <>
      <div ref={navbarRef} className='fixed top-0 z-20 w-full border-b border-b-border bg-background'>
        <div className='container relative flex h-16 items-center justify-between p-5 '>
          <Link href='/' className='flex-1 text-3xl font-semibold text-primary'>
            Pondero
          </Link>

          <div className='flex flex-1 items-center justify-end gap-3'>
            <div className='flex items-center gap-5'>
              {status === 'unauthenticated' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Sign in</Button>
                  </DialogTrigger>
                  <DialogContent className='flex h-[400px] justify-center p-[40px] text-center'>
                    <DialogHeader className='flex items-center'>
                      <DialogTitle className='text-center text-2xl text-primary'>Welcome back.</DialogTitle>
                      <DialogDescription className='flex flex-col gap-4 py-[40px] text-primary '>
                        <Button variant='outline' className='w-[250px]' onClick={() => signIn('google')}>
                          Sign in with Google
                        </Button>
                        <Button variant='outline' className='w-[250px]' onClick={() => signIn('facebook')}>
                          Sign in with Facebook
                        </Button>
                        <Button variant='outline' className='w-[250px]' onClick={() => signIn('github')}>
                          Sign in with Github
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

              {status === 'loading' && <Skeleton className='h-[32px] w-[94px]' />}
              {status === 'loading' && <Skeleton className='h-10 w-10 rounded-full' />}

              {status === 'authenticated' && <WriteOrPublishButton />}
              {status === 'authenticated' && (
                <DropdownMenu open={isAvatarDropdownOpen} onOpenChange={setIsAvatarDropdownOpen} modal={false}>
                  <DropdownMenuTrigger>
                    <div className='relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full'>
                      <Image
                        src={session?.user?.image || ''}
                        alt='avatar logo'
                        width={500}
                        height={500}
                        className='aspect-square h-full w-full'
                      />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align='end' className='w-[250px] p-0'>
                    <DropdownMenuGroup className='py-[16px]'>
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
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className='group'>
                      <DropdownMenuItem
                        onSelect={e => e.preventDefault()}
                        className='flex flex-row justify-between px-[24px] py-[8px] text-sm text-muted-foreground'
                      >
                        <span className='group-hover:text-primary'>Theme</span>
                        <ThemeToggle />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className='group cursor-pointer py-[16px]'>
                      <DropdownMenuItem className='p-0 text-sm text-muted-foreground'>
                        <button className='flex flex-col px-[24px] py-[8px]' onClick={() => signOut()}>
                          <span className='group-hover:text-primary'>Sign out</span>
                          <span>{session?.user?.email}</span>
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {pathname === '/' && <SideMenu sidebarRef={sidebarRef} />}
        </div>
      </div>
    </>
  );
};

export default Navbar;
