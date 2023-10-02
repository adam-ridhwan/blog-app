import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <>
      <div className='container flex  w-full flex-col items-center justify-center gap-5 pt-[100px] text-center text-primary'>
        <h1 className='text-4xl font-semibold text-primary'>404</h1>
        <span className='text-md text-muted'>
          Sorry the page you are looking for does not exist or has been moved.
        </span>
        <Button variant='accent'>
          <Link href='/'>Go back to homepage</Link>
        </Button>
      </div>
    </>
  );
};

export default NotFound;
