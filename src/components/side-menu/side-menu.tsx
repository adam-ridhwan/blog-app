'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/util/cn';
import { XL } from '@/util/constants';
import { useViewportSize } from '@mantine/hooks';

type SideMenuProps = {
  children: ReactNode;
};

const THRESHOLD = 100;
const BOTTOM_PADDING = 20;
const TOP_OF_VIEWPORT = 0;

const STICKY = 'sticky';
const RELATIVE = 'relative';
const UP = 'up';
const DOWN = 'down';

type Position = typeof STICKY | typeof RELATIVE;
type ScrollDirection = typeof UP | typeof DOWN;

const SideMenu: FC<SideMenuProps> = ({ children }) => {
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
   * - Calculates the height and the top of the placeholder
   * - The measurements will be used for actual sidebar
   *
   * - Height is needed in the dependency to recalculate the height of the placeholder when the viewport
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
   * DETECT SIDEBAR HEIGHT CHANGE
   * - When sidebar height changes, the placeholder height should also change.
   * - Accordions are used for the sidebar. When the accordion is expanded, the sidebar height changes.
   * - Need to recalculate the height of the placeholder to prevent the sidebar from jumping when the
   * accordion is expanded
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const observeTarget = sideMenuRef.current;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setPlaceholder(prev => ({ ...prev, height: entry.target.clientHeight }));
      }
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => resizeObserver.disconnect();
  }, [sideMenuRef]);

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
  }, [placeholder, position, width]);

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
          {children}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
