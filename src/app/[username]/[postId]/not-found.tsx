import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <>
      <div className='container flex  w-full flex-col items-center justify-center gap-5 pt-[100px] text-center text-primary'>
        <h1 className='text-4xl font-semibold text-primary md:text-7xl'>404</h1>
        <span className='text-md text-muted md:text-3xl'>
          Sorry the page you are looking for does not exist or has been moved.
        </span>
        <Button variant='accent' className='md:h-12 md:text-2xl'>
          <Link href='/'>Go back to homepage</Link>
        </Button>
      </div>
    </>
  );
};

export default NotFound;
