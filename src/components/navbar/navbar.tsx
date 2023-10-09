'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { currentUserAtom } from '@/providers/hydrate-atoms';
import { atom, useAtom } from 'jotai';
import { signIn, signOut, useSession } from 'next-auth/react';

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
import Publish from '@/components/navbar/publish';
import ThemeButton from '@/components/navbar/theme-button';
import Write from '@/components/navbar/write';

export const isSignInDialogOpenAtom = atom(false);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [user, setUser] = useAtom(currentUserAtom);

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useAtom(isSignInDialogOpenAtom);

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const navbarPositionRef = useRef(0);
  const prevBodyScrollY = useRef(0);

  useEffect(() => {
    if (!navbarRef.current) return;

    navbarPositionRef.current = 0;
    navbarRef.current.style.transform = `translateY(${0}px)`;
  }, [pathname]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * REMOVE HASH FROM URL
   * If user is redirected from OAuth facebook, remove the hash
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (window.location.hash === '#_=_') router.replace('/');
  }, [router]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * NAVBAR SCROLL ANIMATION
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current || pathname === '/write-page-a-main-section') return;

      const currentScrollY = window.scrollY;
      const scrollAmount = currentScrollY - prevBodyScrollY.current;
      const heightOfNavbar = -navbarRef.current.offsetHeight;

      navbarPositionRef.current =
        currentScrollY > prevBodyScrollY.current
          ? Math.max(navbarPositionRef.current - scrollAmount, heightOfNavbar)
          : Math.min(navbarPositionRef.current - scrollAmount, 0);

      if (currentScrollY > 0) {
        navbarRef.current.style.transform = `translateY(${navbarPositionRef.current}px)`;
        prevBodyScrollY.current = currentScrollY;
      }

      if (currentScrollY > 1) {
        setIsAvatarDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <>
      <div ref={navbarRef} className='fixed top-0 z-20 w-full border-b border-b-border bg-background'>
        <div className='relative flex h-16 items-center justify-between p-5 '>
          <Link href='/' className='flex-1 text-3xl font-semibold text-primary'>
            Pondero
          </Link>

          <div className='flex flex-1 items-center justify-end gap-3'>
            <div className='flex items-center gap-5'>
              {status === 'unauthenticated' && (
                <Dialog open={isSignInDialogOpen} onOpenChange={setIsSignInDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant='accent'>Sign in</Button>
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

              {status === 'loading' && <Skeleton className='h-[40px] w-[120px]' />}
              {status === 'loading' && <Skeleton className='h-10 w-10 rounded-full' />}

              {status === 'authenticated' && pathname === '/' && <Write />}
              {status === 'authenticated' && pathname === '/write-a-post' && <Publish />}
              {status === 'authenticated' && (
                <DropdownMenu
                  open={isAvatarDropdownOpen}
                  onOpenChange={setIsAvatarDropdownOpen}
                  modal={false}
                >
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
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted hover:text-primary'>
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted hover:text-primary'>
                        <span>Posts</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer px-[24px] py-[8px] text-sm text-muted hover:text-primary'>
                        <span></span>
                        <span>Saved</span>
                      </DropdownMenuItem>
                      {/*<DropdownMenuItem className='text-muted-foreground cursor-pointer px-[24px] py-[8px] text-sm hover:text-primary'>*/}
                      {/*  <span>Analytics</span>*/}
                      {/*</DropdownMenuItem>*/}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className='group'>
                      <DropdownMenuItem
                        onSelect={e => e.preventDefault()}
                        className='flex flex-row justify-between px-[24px] py-[8px] text-sm text-muted'
                      >
                        <span className='group-hover:text-primary'>Theme</span>
                        <ThemeButton />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className='group cursor-pointer py-[16px]'>
                      <DropdownMenuItem className='p-0 text-sm text-muted'>
                        <button
                          className='flex flex-col px-[24px] py-[8px]'
                          onClick={async () => {
                            setUser(null);
                            await signOut();
                          }}
                        >
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
