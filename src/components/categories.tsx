'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { type Category } from '@/types';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';

type AllCategoriesProps = {
  categories: Category[];
};

const Categories: FC<AllCategoriesProps> = ({ categories }) => {
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
        className='hide-scrollbar absolute top-[40px] mb-10 flex w-0 flex-row gap-2 overflow-x-auto'
        style={{ width: `${width}px` }}
      >
        {categories.map(category => {
          return (
            <Link
              key={category._id}
              href={`/blog?category=${category}`}
              className={cn(
                `flex h-[32px] items-center justify-center rounded-full border  
                border-muted/30 bg-background px-5`
              )}
            >
              <span className='whitespace-nowrap text-lg text-primary'>{capitalize(category.title)}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Categories;
