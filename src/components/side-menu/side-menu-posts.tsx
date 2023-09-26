import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

type MenuPostsProps = {
  withImage?: boolean;
};

const SideMenuPosts: FC<MenuPostsProps> = ({ withImage }) => {
  return (
    <>
      <div className='flex flex-col gap-[35px] md:grid md:grid-cols-2 lg:flex lg:flex-col'>
        <Link href='/' className='flex items-center gap-[20px]'>
          {withImage && (
            <div className='relative aspect-square max-w-[70px] flex-[1]'>
              <Image src='/sand.jpg' alt='' fill className='rounded-full object-cover' />
            </div>
          )}

          <div className='flex flex-[4] flex-col gap-[5px]'>
            <Badge variant='outline' className='w-max bg-darkBlue'>
              Fashion
            </Badge>
            <h3 className='text-muted-foreground'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <div>
              <span>John Doe - </span>
              <span>10.01.2023</span>
            </div>
          </div>
        </Link>

        <Link href='/' className='flex items-center gap-[20px]'>
          {withImage && (
            <div className='relative aspect-square max-w-[70px] flex-[1]'>
              <Image src='/sand.jpg' alt='' fill className='rounded-full object-cover' />
            </div>
          )}

          <div className='flex flex-[4] flex-col gap-[5px]'>
            <Badge variant='outline' className='w-max bg-darkPink'>
              Health
            </Badge>
            <h3 className='text-muted-foreground'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <div>
              <span>John Doe - </span>
              <span>10.01.2023</span>
            </div>
          </div>
        </Link>

        <Link href='/' className='flex items-center gap-[20px]'>
          {withImage && (
            <div className='relative aspect-square max-w-[70px] flex-[1]'>
              <Image src='/sand.jpg' alt='' fill className='rounded-full object-cover' />
            </div>
          )}

          <div className='flex flex-[4] flex-col gap-[5px]'>
            <Badge variant='outline' className='w-max bg-darkGreen'>
              Coding
            </Badge>
            <h3 className='text-muted-foreground'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <div>
              <span>John Doe - </span>
              <span>10.01.2023</span>
            </div>
          </div>
        </Link>

        <Link href='/' className='flex items-center gap-[20px]'>
          {withImage && (
            <div className='relative aspect-square max-w-[70px] flex-[1]'>
              <Image src='/sand.jpg' alt='' fill className='rounded-full object-cover' />
            </div>
          )}

          <div className='flex flex-[4] flex-col gap-[5px]'>
            <Badge variant='outline' className='w-max bg-darkRed'>
              Business
            </Badge>
            <h3 className='text-muted-foreground'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <div>
              <span>John Doe - </span>
              <span>10.01.2023</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default SideMenuPosts;
