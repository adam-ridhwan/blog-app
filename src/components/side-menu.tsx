import { RefObject } from 'react';
import Link from 'next/link';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';
import { categories } from '@/util/constants';

import { Separator } from '@/components/ui/separator';
import MostPopularPosts from '@/components/most-popular-posts';
import SideMenuPosts from '@/components/side-menu-posts';

const SideMenu = ({ sidebarRef }: { sidebarRef: RefObject<HTMLDivElement> }) => {
  return (
    <>
      <div
        className={cn(
          `absolute right-[32px] top-[65px] ml-5 hidden h-[100dvh] min-w-[350px] max-w-[350px] border-l border-l-border
            bg-background pl-5 lg:flex lg:flex-col`
        )}
      >
        <div ref={sidebarRef} className='hide-scrollbar overflow-auto'>
          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>{"What's hot"}</h2>
            <h1 className='text-2xl font-semibold'>Most popular</h1>
            <MostPopularPosts />
          </div>

          <Separator orientation='horizontal' className='my-2' />

          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>Discover by topic</h2>
            <h1 className='text-2xl font-semibold'>Categories</h1>

            <div className='mt-6 flex flex-wrap gap-2'>
              {categories.map(category => {
                return (
                  <Link
                    key={category}
                    href={`/blog?category=${category}`}
                    className={cn(
                      `flex h-[35px] w-max items-center justify-center rounded-md bg-secondary px-5 text-secondary-foreground hover:bg-secondary/80`
                    )}
                  >
                    <span className='whitespace-nowrap text-sm text-primary'>{capitalize(category)}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Separator orientation='horizontal' className='my-2' />

          <div className='mb-6 mt-6'>
            <h2 className='text-muted-foreground'>Chosen by editor</h2>
            <h1 className='text-2xl font-semibold'>{"Editor's picks"}</h1>
            <SideMenuPosts withImage={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
