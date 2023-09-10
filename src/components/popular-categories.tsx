'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { capitalize } from '@/util';
import { cn } from '@/util/cn';
import { categories } from '@/util/constants';

const PopularCategories = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const placeholder = document.getElementById('categories-placeholder');
    const handleResize = () => placeholder && setWidth(placeholder.clientWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div
        className='hide-scrollbar absolute mb-10 flex w-0 flex-row gap-2 overflow-x-auto'
        style={{ width: `${width}px` }}
      >
        {categories.map(category => {
          return (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className={cn(
                `flex h-[40px] items-center justify-center rounded-md border 
                border-input bg-background px-5 hover:bg-accent hover:text-accent-foreground`
              )}
            >
              <span className='whitespace-nowrap text-lg text-primary'>{capitalize(category)}</span>
            </Link>
          );
        })}
        {categories.map(category => {
          return (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className={cn(
                `flex h-[40px] items-center justify-center rounded-md border 
                border-input bg-background px-5 hover:bg-accent hover:text-accent-foreground`
              )}
            >
              <span className='whitespace-nowrap text-lg text-primary'>{capitalize(category)}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default PopularCategories;
