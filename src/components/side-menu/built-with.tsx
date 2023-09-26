import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

import MongoDbSvg from '../../../public/icons/MongoDbSvg';
import NextJsSvg from '../../../public/icons/NextJsSvg';
import TailwindSvg from '../../../public/icons/TailwindSvg';
import VercelSvg from '../../../public/icons/VercelSvg';

const BuiltWith = () => {
  return (
    <>
      <Card className='md:border md:border-accentSkyBlue/10 md:bg-accentAzure/5'>
        <CardContent>
          <CardTitle className='mb-1 text-lg'>Built with</CardTitle>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <NextJsSvg />
              <span>Next.js</span>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <Image
                src='/icons/NextAuth.png'
                width={50}
                height={50}
                alt='NextAuth Logo'
                className='h-5 w-5 grayscale'
              />
              <span>NextAuth.js</span>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <MongoDbSvg />
              <span>MongoDB</span>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <TailwindSvg />
              <span>Tailwind</span>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <VercelSvg />
              <span>Vercel</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className='gap-1 text-sm'>
          <Link href='/'>© 2023 Pondero</Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default BuiltWith;
