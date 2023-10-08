import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      <div className='container flex flex-col items-center pb-[30px] pt-[100px]'>
        <div className='mb-3 flex w-full flex-col gap-2 md:max-w-[680px] md:gap-7'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-[50px] w-full md:w-[80%]' />
            <Skeleton className='h-[30px] w-[70%] md:w-[50%]' />
          </div>

          <div className='flex flex-row items-center gap-3'>
            <Skeleton className='h-12 w-12 rounded-full' />

            <div className='flex flex-col gap-1'>
              <Skeleton className='h-[20px] w-[60px] md:w-[120px]' />
              <Skeleton className='h-[20px] w-[100px] md:w-[200px]' />
            </div>
          </div>

          <div className='flex flex-col gap-6 md:gap-10'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-3/4 md:h-6' />
              <Skeleton className='h-4 w-2/3 md:h-6' />
              <Skeleton className='h-4 w-5/6 md:h-6' />
              <Skeleton className='h-4 w-1/2 md:h-6' />
              <Skeleton className='h-4 w-4/5 md:h-6' />
            </div>

            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-3/4 md:h-6' />
              <Skeleton className='h-4 w-2/3 md:h-6' />
              <Skeleton className='h-4 w-5/6 md:h-6' />
              <Skeleton className='h-4 w-1/2 md:h-6' />
              <Skeleton className='h-4 w-4/5 md:h-6' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
