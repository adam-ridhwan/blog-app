'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';
import { categories, LG, XL } from '@/util/constants';
import { useViewportSize } from '@mantine/hooks';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MostPopularPosts from '@/components/most-popular-posts';
import SideMenuPosts from '@/components/side-menu-posts';

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

      // SCROLLING DOWN ──────────────────────────────────────────────────────────────────────────────── */
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

      // SCROLLING UP ────────────────────────────────────────────────────────────────────────────────── */
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

      // ────────────────────────────────────────────────────────────────────────────────────────────── */
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
              <CardTitle className=''>{"What's hot"}</CardTitle>
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
              <CardTitle>Discover by topic</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              {categories.map(category => {
                return (
                  <Link
                    key={category}
                    href={`/blog?category=${category}`}
                    className={cn(
                      `flex h-[35px] w-max items-center justify-center rounded-full border border-border 
                      bg-background px-5`
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
                  <svg
                    role='img'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='currentColor'
                    data-darkreader-inline-fill=''
                  >
                    <title>Next.js</title>
                    <path d='M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z'></path>
                  </svg>
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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 128 128'
                    id='mongodb'
                    className='h-5 w-5 grayscale'
                  >
                    <path
                      fill='#439934'
                      fillRule='evenodd'
                      d='M88.038 42.812c1.605 4.643 2.761 9.383 3.141 14.296.472 6.095.256 12.147-1.029 18.142-.035.165-.109.32-.164.48-.403.001-.814-.049-1.208.012-3.329.523-6.655 1.065-9.981 1.604-3.438.557-6.881 1.092-10.313 1.687-1.216.21-2.721-.041-3.212 1.641-.014.046-.154.054-.235.08l.166-10.051c-.057-8.084-.113-16.168-.169-24.252l1.602-.275c2.62-.429 5.24-.864 7.862-1.281 3.129-.497 6.261-.98 9.392-1.465 1.381-.215 2.764-.412 4.148-.618z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#45A538'
                      fillRule='evenodd'
                      d='M61.729 110.054c-1.69-1.453-3.439-2.842-5.059-4.37-8.717-8.222-15.093-17.899-18.233-29.566-.865-3.211-1.442-6.474-1.627-9.792-.13-2.322-.318-4.665-.154-6.975.437-6.144 1.325-12.229 3.127-18.147l.099-.138c.175.233.427.439.516.702 1.759 5.18 3.505 10.364 5.242 15.551 5.458 16.3 10.909 32.604 16.376 48.9.107.318.384.579.583.866l-.87 2.969z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#46A037'
                      fillRule='evenodd'
                      d='M88.038 42.812c-1.384.206-2.768.403-4.149.616-3.131.485-6.263.968-9.392 1.465-2.622.417-5.242.852-7.862 1.281l-1.602.275-.012-1.045c-.053-.859-.144-1.717-.154-2.576-.069-5.478-.112-10.956-.18-16.434-.042-3.429-.105-6.857-.175-10.285-.043-2.13-.089-4.261-.185-6.388-.052-1.143-.236-2.28-.311-3.423-.042-.657.016-1.319.029-1.979.817 1.583 1.616 3.178 2.456 4.749 1.327 2.484 3.441 4.314 5.344 6.311 7.523 7.892 12.864 17.068 16.193 27.433z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#409433'
                      fillRule='evenodd'
                      d='M65.036 80.753c.081-.026.222-.034.235-.08.491-1.682 1.996-1.431 3.212-1.641 3.432-.594 6.875-1.13 10.313-1.687 3.326-.539 6.652-1.081 9.981-1.604.394-.062.805-.011 1.208-.012-.622 2.22-1.112 4.488-1.901 6.647-.896 2.449-1.98 4.839-3.131 7.182-1.72 3.503-3.863 6.77-6.353 9.763-1.919 2.308-4.058 4.441-6.202 6.548-1.185 1.165-2.582 2.114-3.882 3.161l-.337-.23-1.214-1.038-1.256-2.753c-.865-3.223-1.319-6.504-1.394-9.838l.023-.561.171-2.426c.057-.828.133-1.655.168-2.485.129-2.982.241-5.964.359-8.946z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#4FAA41'
                      fillRule='evenodd'
                      d='M65.036 80.753c-.118 2.982-.23 5.964-.357 8.947-.035.83-.111 1.657-.168 2.485l-.765.289c-1.699-5.002-3.399-9.951-5.062-14.913-2.75-8.209-5.467-16.431-8.213-24.642-2.217-6.628-4.452-13.249-6.7-19.867-.105-.31-.407-.552-.617-.826l4.896-9.002c.168.292.39.565.496.879 2.265 6.703 4.526 13.407 6.768 20.118 2.916 8.73 5.814 17.467 8.728 26.198.116.349.308.671.491 1.062l.67-.78c-.056 3.351-.112 6.701-.167 10.052z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#4AA73C'
                      fillRule='evenodd'
                      d='M43.155 32.227c.21.274.511.516.617.826 2.248 6.618 4.483 13.239 6.7 19.867 2.746 8.211 5.463 16.433 8.213 24.642 1.662 4.961 3.362 9.911 5.062 14.913l.765-.289-.171 2.426-.155.559c-.266 2.656-.49 5.318-.814 7.968-.163 1.328-.509 2.632-.772 3.947-.198-.287-.476-.548-.583-.866-5.467-16.297-10.918-32.6-16.376-48.9-1.737-5.187-3.483-10.371-5.242-15.551-.089-.263-.34-.469-.516-.702 1.09-2.947 2.181-5.894 3.272-8.84z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#57AE47'
                      fillRule='evenodd'
                      d='M65.202 70.702l-.67.78c-.183-.391-.375-.714-.491-1.062-2.913-8.731-5.812-17.468-8.728-26.198-2.242-6.711-4.503-13.415-6.768-20.118-.105-.314-.327-.588-.496-.879l6.055-7.965c.191.255.463.482.562.769 1.681 4.921 3.347 9.848 5.003 14.778 1.547 4.604 3.071 9.215 4.636 13.813.105.308.47.526.714.786l.012 1.045c.058 8.082.115 16.167.171 24.251z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#60B24F'
                      fillRule='evenodd'
                      d='M65.021 45.404c-.244-.26-.609-.478-.714-.786-1.565-4.598-3.089-9.209-4.636-13.813-1.656-4.93-3.322-9.856-5.003-14.778-.099-.287-.371-.514-.562-.769 1.969-1.928 3.877-3.925 5.925-5.764 1.821-1.634 3.285-3.386 3.352-5.968.003-.107.059-.214.145-.514l.519 1.306c-.013.661-.072 1.322-.029 1.979.075 1.143.259 2.28.311 3.423.096 2.127.142 4.258.185 6.388.069 3.428.132 6.856.175 10.285.067 5.478.111 10.956.18 16.434.008.861.098 1.718.152 2.577z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#A9AA88'
                      fillRule='evenodd'
                      d='M62.598 107.085c.263-1.315.609-2.62.772-3.947.325-2.649.548-5.312.814-7.968l.066-.01.066.011c.075 3.334.529 6.615 1.394 9.838-.176.232-.425.439-.518.701-.727 2.05-1.412 4.116-2.143 6.166-.1.28-.378.498-.574.744l-.747-2.566.87-2.969z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#B6B598'
                      fillRule='evenodd'
                      d='M62.476 112.621c.196-.246.475-.464.574-.744.731-2.05 1.417-4.115 2.143-6.166.093-.262.341-.469.518-.701l1.255 2.754c-.248.352-.59.669-.728 1.061l-2.404 7.059c-.099.283-.437.483-.663.722l-.695-3.985z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#C2C1A7'
                      fillRule='evenodd'
                      d='M63.171 116.605c.227-.238.564-.439.663-.722l2.404-7.059c.137-.391.48-.709.728-1.061l1.215 1.037c-.587.58-.913 1.25-.717 2.097l-.369 1.208c-.168.207-.411.387-.494.624-.839 2.403-1.64 4.819-2.485 7.222-.107.305-.404.544-.614.812-.109-1.387-.22-2.771-.331-4.158z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#CECDB7'
                      fillRule='evenodd'
                      d='M63.503 120.763c.209-.269.506-.508.614-.812.845-2.402 1.646-4.818 2.485-7.222.083-.236.325-.417.494-.624l-.509 5.545c-.136.157-.333.294-.398.477-.575 1.614-1.117 3.24-1.694 4.854-.119.333-.347.627-.525.938-.158-.207-.441-.407-.454-.623-.051-.841-.016-1.688-.013-2.533z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#DBDAC7'
                      fillRule='evenodd'
                      d='M63.969 123.919c.178-.312.406-.606.525-.938.578-1.613 1.119-3.239 1.694-4.854.065-.183.263-.319.398-.477l.012 3.64-1.218 3.124-1.411-.495z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#EBE9DC'
                      fillRule='evenodd'
                      d='M65.38 124.415l1.218-3.124.251 3.696-1.469-.572z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#CECDB7'
                      fillRule='evenodd'
                      d='M67.464 110.898c-.196-.847.129-1.518.717-2.097l.337.23-1.054 1.867z'
                      clipRule='evenodd'
                    ></path>
                    <path
                      fill='#4FAA41'
                      fillRule='evenodd'
                      d='M64.316 95.172l-.066-.011-.066.01.155-.559-.023.56z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span>MongoDB</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 54 33'
                    className='h-5 w-5 grayscale'
                  >
                    <g clipPath='url(#prefix__clip0)'>
                      <path
                        fill='#38bdf8'
                        fillRule='evenodd'
                        d='M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z'
                        clipRule='evenodd'
                      />
                    </g>
                    <defs>
                      <clipPath id='prefix__clip0'>
                        <path fill='#fff' d='M0 0h54v32.4H0z' />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Tailwind</span>
                </div>

                <div className='flex flex-row items-center gap-2'>
                  <svg
                    width='800px'
                    height='800px'
                    viewBox='0 -17 256 256'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid'
                    className='h-5 w-5'
                  >
                    <g>
                      <polygon fill='#000000' points='128 0 256 221.705007 0 221.705007'></polygon>
                    </g>
                  </svg>
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
