import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const WhoToFollow = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Who to follow</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'></CardContent>

        <CardFooter>
          <Link
            href='/'
            className='flex h-[40px] w-full items-center justify-center rounded-full border border-border
                bg-transparent text-muted underline-offset-4 hover:underline'
          >
            See more
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default WhoToFollow;
