'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';
import { categories, LG, XL } from '@/util/constants';
import { useViewportSize } from '@mantine/hooks';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MostPopularPosts from '@/components/side-menu/most-popular-posts';
import SideMenuPosts from '@/components/side-menu/side-menu-posts';

import MongoDbSvg from '../../../public/icons/MongoDbSvg';
import NextJsSvg from '../../../public/icons/NextJsSvg';
import TailwindSvg from '../../../public/icons/TailwindSvg';
import VercelSvg from '../../../public/icons/VercelSvg';

type SideMenuProps = {};

const THRESHOLD = 100;
const BOTTOM_PADDING = 20;
const TOP_OF_VIEWPORT = 0;

const STICKY = 'sticky';
const RELATIVE = 'relative';
const UP = 'up';
const DOWN = 'down';

type Position = typeof STICKY | typeof RELATIVE;
type ScrollDirection = typeof UP | typeof DOWN;

const SideMenu: FC<SideMenuProps> = ({}) => {
  const [placeholder, setPlaceholder] = useState({ height: 0, top: 0 });
  const [position, setPosition] = useState<Position>(STICKY);
  const topRef = useRef(THRESHOLD);
  const marginTopRef = useRef(0);

  const sideMenuRef = useRef<HTMLDivElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  const lastScrollPosition = useRef(0);
  const lastScrollDirection = useRef<ScrollDirection>();

  const { height, width } = useViewportSize();

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * GET THE PLACEHOLDER MEASUREMENTS
   * Calculates the height and the top of the placeholder
   * The measurements will be used for actual sidebar
   * ────────────────
   * Height is needed in the dependency to recalculate the height of the placeholder when the viewport
   * when user resizes the viewport
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (width < XL) return;
    if (!sideMenuRef.current || !placeholderRef.current) return;
    const height = Math.floor(sideMenuRef.current?.getBoundingClientRect().height);
    const top = Math.floor(placeholderRef.current?.getBoundingClientRect().top);

    if (placeholder.height !== 0 && placeholder.top === top) return;
    setPlaceholder(prev => ({ ...prev, top }));

    if (placeholder.height !== height) return setPlaceholder(prev => ({ ...prev, height }));
  }, [placeholder, height, width]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SIDEBAR SCROLL BEHAVIOR
   * 1) When user scrolls down and sideMenuTop is not in view, sidebar should be position relative
   * 2) When user scrolls down and sideMenuBottom is at the bottom of viewport, sidebar should be position
   * sticky
   * 3) When user scrolls up and sideMenuTop is in view, sidebar should be position sticky
   * 4) When user scrolls up and sideMenuTop is not in view, sidebar should be position fixed
   *
   *
   * THIS WAS F*CKING CRAZY TO IMPLEMENT. A LOT OF MATH WTF
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (width < XL) return;

    const handleScroll = () => {
      if (!sideMenuRef.current) return;
      const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const sideMenuTop = Math.floor(sideMenuRef.current.getBoundingClientRect().top);
      const sideMenuBottom = Math.floor(sideMenuRef.current.getBoundingClientRect().bottom);

      const isSidebarBottomInView = sideMenuBottom < viewportHeight;
      const isSidebarTopInView = sideMenuTop > THRESHOLD - 1;

      const currentScrollY = Math.floor(window.scrollY);
      const isScrollingDown = currentScrollY > lastScrollPosition.current;
      const isScrollingUp = currentScrollY < lastScrollPosition.current;

      // SCROLLING DOWN ────────────────────────────────────────────────────────────────────────────────
      if (isScrollingDown) {
        if (isSidebarBottomInView) {
          setPosition(STICKY);
          topRef.current = placeholder.top - BOTTOM_PADDING;
          marginTopRef.current = 0;
        }

        if (lastScrollDirection.current !== DOWN && position === STICKY) {
          setPosition(RELATIVE);
          if (currentScrollY > TOP_OF_VIEWPORT) {
            topRef.current = 0;
            marginTopRef.current = Math.floor(currentScrollY + THRESHOLD);
          }
        }

        lastScrollDirection.current = DOWN;
      }

      // SCROLLING UP ──────────────────────────────────────────────────────────────────────────────────
      if (isScrollingUp) {
        if (isSidebarTopInView) {
          setPosition(STICKY);
          topRef.current = THRESHOLD;
          marginTopRef.current = 0;
        }

        if (lastScrollDirection.current !== UP && position === STICKY) {
          setPosition(RELATIVE);
          topRef.current = 0;
          marginTopRef.current = Math.floor(
            currentScrollY - (placeholder.height - viewportHeight) - BOTTOM_PADDING
          );
        }

        lastScrollDirection.current = UP;
      }

      // ──────────────────────────────────────────────────────────────────────────────────────────────
      lastScrollPosition.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [placeholder.height, placeholder.top, position, width]);

  return (
    <>
      <div
        ref={placeholderRef}
        style={{ height: `${placeholder.height}px` }}
        className={cn(`fixed bottom-0`)}
      />

      <div className='opacity-1 relative'>
        <div
          ref={sideMenuRef}
          style={{
            position: `${position}`,
            top: `${topRef.current}px`,
            marginTop: `${marginTopRef.current}px`,
          }}
          className={cn(`ml-5 hidden min-w-[350px] max-w-[350px] flex-col gap-5 bg-background pl-5 xl:flex`)}
        >
          <Card>
            <CardHeader>
              <CardTitle className=''>Trending posts</CardTitle>
            </CardHeader>
            <CardContent>
              <MostPopularPosts />
            </CardContent>

            <CardFooter>
              <Link
                href='/'
                className={cn(
                  `flex h-[40px] w-full items-center justify-center rounded-full border border-border 
                  bg-background text-muted underline-offset-4 hover:underline`
                )}
              >
                See more
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Who to follow</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'></CardContent>

            <CardFooter>
              <Link
                href='/'
                className='flex h-[40px] w-full items-center justify-center rounded-full border border-border
                bg-transparent text-muted underline-offset-4 hover:underline'
              >
                See more
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chosen by editor</CardTitle>
            </CardHeader>
            <CardContent>
              <SideMenuPosts withImage={true} />
            </CardContent>

            <CardFooter>
              <Link
                href='/'
                className='flex h-[40px] w-full items-center justify-center rounded-full border border-border
                bg-transparent text-muted underline-offset-4 hover:underline'
              >
                See more
              </Link>
            </CardFooter>
          </Card>

          <Card className='md:border md:border-accentSkyBlue/10 md:bg-accentAzure/5'>
            <CardContent>
              <CardTitle className='mb-1 text-lg'>Built with</CardTitle>
              <div className='flex flex-col gap-1'>
                <div className='flex flex-row items-center gap-2'>
                  <NextJsSvg />
                  <span>Next.js</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <Image
                    src='/nextauth.png'
                    width={50}
                    height={50}
                    alt='NextAuth Logo'
                    className='h-5 w-5 grayscale'
                  />
                  <span>NextAuth.js</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <MongoDbSvg />
                  <span>MongoDB</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <TailwindSvg />
                  <span>Tailwind</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <VercelSvg />
                  <span>Vercel</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className='gap-1 text-sm'>
              <Link href='/'>© 2023 Pondero</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
