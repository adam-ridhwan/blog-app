import { forwardRef } from 'react';
import * as React from 'react';
import { cn } from '@/util/cn';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type CardSkeletonProps = {
  className?: string;
};

const CardSkeleton = forwardRef<HTMLDivElement, CardSkeletonProps>(({ className }, ref) => {
  return (
    <>
      <Card ref={ref} className='w-full'>
        <div className='flex flex-row items-center gap-2'>
          {/* Avatar */}
          <Skeleton className={cn('h-12 w-12 rounded-full bg-primary/30', className)} />

          {/* Name, username, date */}
          <div className='flex flex-col gap-2'>
            <Skeleton className={cn('h-[16px] w-[100px] bg-primary/30', className)} />
            <Skeleton className={cn('h-[16px] w-[200px] bg-primary/30', className)} />
          </div>
        </div>

        {/* Title, description */}
        <div className='flex flex-col gap-1 md:flex-row md:items-end md:gap-7'>
          <div className='flex flex-1 flex-col'>
            <CardHeader>
              <Skeleton className={cn('mb-1 h-[32px] w-[400px] bg-primary/30 md:w-[200px]', className)} />
            </CardHeader>
            <CardContent>
              <Skeleton className={cn('hidden h-[72px] bg-primary/30 md:flex', className)} />
            </CardContent>
          </div>

          {/* Image */}
          <div className='relative hidden aspect-video h-max w-full rounded-2xl md:flex md:h-[108px] md:w-[180px]'>
            <Skeleton className={cn('h-full w-full rounded-2xl bg-primary/30', className)} />
          </div>
        </div>

        {/* Likes, comments, views */}
        <CardFooter>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Skeleton className={cn('h-[24px] w-[40px] bg-primary/30', className)} />
          </div>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Skeleton className={cn('h-[24px] w-[40px] bg-primary/30', className)} />
          </div>
          <Skeleton className={cn('ml-3 h-[24px] w-[70px] bg-primary/30', className)} />
        </CardFooter>
      </Card>
    </>
  );
});
CardSkeleton.displayName = 'CardSkeleton';

export default CardSkeleton;
