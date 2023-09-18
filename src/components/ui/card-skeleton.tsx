import { forwardRef } from 'react';
import * as React from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';
import { Skeleton } from '@/components/ui/skeleton';

type CardSkeletonProps = {};

const CardSkeleton = forwardRef<HTMLDivElement, CardSkeletonProps>(({}, ref) => {
  return (
    <>
      <Card ref={ref} className='w-full'>
        <div className='flex flex-row items-center gap-2'>
          {/* Avatar */}
          <Skeleton className='h-12 w-12 rounded-full bg-primary/30' />

          {/* Name, username, date */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-[16px] w-[100px] bg-primary/30' />
            <Skeleton className='h-[16px] w-[200px] bg-primary/30' />
          </div>
        </div>

        {/* Title, description */}
        <div className='flex flex-col gap-1 md:flex-row md:items-end md:gap-7'>
          <div className='flex flex-1 flex-col gap-2'>
            <CardHeader>
              <Skeleton className='w-[80%]] h-[24px] bg-primary/30 md:w-[200px]' />
            </CardHeader>
            <CardContent>
              <Skeleton className='hidden h-[72px] bg-primary/30 md:flex' />
            </CardContent>
          </div>

          {/* Image */}
          <div className='relative hidden aspect-video h-max w-full rounded-2xl md:flex md:h-[108px] md:w-[180px]'>
            <Skeleton className='h-full w-full rounded-2xl bg-primary/30' />
          </div>
        </div>

        {/* Likes, comments, views */}
        <CardFooter>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Skeleton className='h-[24px] w-[40px] bg-primary/30' />
          </div>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Skeleton className='h-[24px] w-[40px] bg-primary/30' />
          </div>
          <Skeleton className='ml-3 h-[24px] w-[70px] bg-primary/30' />
        </CardFooter>
      </Card>
    </>
  );
});
CardSkeleton.displayName = 'CardSkeleton';

export default CardSkeleton;
