'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';
import { categories } from '@/util/constants';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MostPopularPosts from '@/components/most-popular-posts';
import SideMenuPosts from '@/components/side-menu-posts';

const xAtom = atom(0);

const SideMenu = ({ sidebarRef }: { sidebarRef: RefObject<HTMLDivElement> }) => {
  const x = useAtomValue(xAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div
        style={{
          left: `${Math.min(x - 20)}px`,
        }}
        className={cn(
          `fixed top-[65px] z-40 ml-5 hidden h-[100dvh] min-w-[350px] max-w-[350px] bg-background pl-5 xl:flex xl:flex-col`
        )}
      >
        <div ref={sidebarRef} className='hide-scrollbar flex flex-col gap-5 overflow-auto py-10'>
          <Card>
            <CardHeader>
              <CardTitle className=''>{"What's hot"}</CardTitle>
            </CardHeader>
            <CardContent>
              <MostPopularPosts />
            </CardContent>

            <CardFooter>
              <Link
                href='/'
                className={cn(
                  `flex h-[40px] w-full items-center justify-center rounded-full border border-border bg-background 
                  text-muted underline-offset-4 hover:underline`
                )}
              >
                See more
              </Link>
            </CardFooter>
          </Card>

          <Card className='gap-5'>
            <CardHeader>
              <CardTitle>Discover by topic</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              {categories.map(category => {
                return (
                  <Link
                    key={category}
                    href={`/blog?category=${category}`}
                    className={cn(
                      `flex h-[35px] w-max items-center justify-center rounded-full border border-border bg-background px-5`
                    )}
                  >
                    <span className='whitespace-nowrap text-sm text-muted'>{capitalize(category)}</span>
                  </Link>
                );
              })}
            </CardContent>

            <CardFooter>
              <Link
                href='/'
                className='flex h-[40px] w-full items-center justify-center rounded-full border border-border bg-transparent text-muted underline-offset-4 hover:underline'
              >
                See more
              </Link>
            </CardFooter>
          </Card>

          <Card className='gap-5'>
            <CardHeader>
              <CardTitle>Chosen by editor</CardTitle>
            </CardHeader>
            <CardContent>
              <SideMenuPosts withImage={true} />
            </CardContent>

            <CardFooter>
              <Link
                href='/'
                className='flex h-[40px] w-full items-center justify-center rounded-full border border-border bg-transparent text-muted underline-offset-4 hover:underline'
              >
                See more
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SideMenu;

export function SideMenuPlaceholder() {
  const setX = useSetAtom(xAtom);
  const sideMenuPlaceholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sideMenuPlaceholderRef.current) return;
    const { x } = sideMenuPlaceholderRef.current?.getBoundingClientRect();
    setX(x);
  }, [setX]);

  useEffect(() => {
    const handleResize = () => {
      if (!sideMenuPlaceholderRef.current) return;
      const { x } = sideMenuPlaceholderRef.current?.getBoundingClientRect();
      setX(x);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setX]);

  return (
    <>
      <div ref={sideMenuPlaceholderRef} className='ml-5 hidden h-[100dvh] min-w-[350px] xl:flex xl:flex-col '>
        placeholder
      </div>
    </>
  );
}
