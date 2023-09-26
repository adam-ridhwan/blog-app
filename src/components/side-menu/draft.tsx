import Link from 'next/link';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Draft = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Draft</CardTitle>
        </CardHeader>
        <CardDescription className='flex flex-col'>
          <span className='two-line-ellipsis font-primary text-xl font-semibold'>Title</span>
          <span className='two-line-ellipsis text-lg font-medium text-muted'>Description</span>
        </CardDescription>

        <CardFooter>
          <Link
            href='/'
            className='flex h-[40px] w-full items-center justify-center rounded-full border border-border
                bg-transparent text-muted underline-offset-4 hover:underline'
          >
            Continue editing
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default Draft;
