'use client';

import { FC, memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCategories } from '@/actions/getCategories';
import { type Category } from '@/types';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';
import { randomId, useTimeout } from '@mantine/hooks';

import { Skeleton } from '@/components/ui/skeleton';

const Categories: FC = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { start } = useTimeout(() => setIsMounted(true), 1000);

  useEffect(() => {
    (async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      start();
    })();
  }, [start]);

  if (!isMounted) return <CategorySkeleton />;

  return (
    <>
      <div className='hide-scrollbar mb-10 mt-10 flex w-full flex-row gap-2 overflow-x-auto '>
        <Link
          href='/'
          className={cn(
            `flex h-[32px] items-center justify-center whitespace-nowrap rounded-full border
            border-transparent bg-background px-5`,
            pathname === '/' && 'bg-accentNavy text-white'
          )}
        >
          For you
        </Link>
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

const CategorySkeleton = memo(() => {
  return (
    <div className='hide-scrollbar mb-10 mt-10 flex w-full flex-row gap-2 overflow-x-auto '>
      {Array.from({ length: 8 }).map((_, i) => {
        const randomWidth = Math.floor(Math.random() * (120 - 90 + 1) + 90);
        return (
          <Skeleton key={i} className={`h-[32px] rounded-full bg-primary/30`} style={{ width: `${randomWidth}px` }} />
        );
      })}
    </div>
  );
});
CategorySkeleton.displayName = 'CategorySkeleton';
