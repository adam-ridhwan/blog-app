import { FC, memo } from 'react';
import Link from 'next/link';
import { getCategories } from '@/actions/getCategories';
import { capitalize } from '@/util/capitalize';
import { cn } from '@/util/cn';

import { Skeleton } from '@/components/ui/skeleton';

const Categories: FC = async () => {
  const categories = await getCategories();

  return (
    <>
      <div className='hide-scrollbar mb-10 mt-[100px] flex w-full flex-row gap-2 overflow-x-auto'>
        <Link
          href='/'
          className={cn(
            `flex h-[32px] items-center justify-center whitespace-nowrap rounded-md border border-transparent
            bg-accentNavy px-5 text-secondary`
          )}
        >
          For you
        </Link>
        {categories.map(category => {
          return (
            <Link
              key={category.title}
              href={`/blog?category=${category.title}`}
              className={cn(
                `flex h-[32px] items-center justify-center rounded-md border  
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
    <div className='hide-scrollbar mb-10 mt-[100px] flex w-full flex-row gap-2 overflow-x-auto '>
      {Array.from({ length: 8 }).map((_, i) => {
        const randomWidth = Math.floor(Math.random() * (120 - 90 + 1) + 90);
        return (
          <Skeleton
            key={i}
            className={`h-[32px] rounded-full bg-primary/30`}
            style={{ width: `${randomWidth}px` }}
          />
        );
      })}
    </div>
  );
});
CategorySkeleton.displayName = 'CategorySkeleton';
