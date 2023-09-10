import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type CardProps = {
  title: string;
  avatarImage?: string;
  date: string;
  content: string;
};

const Card: FC<CardProps> = ({ title, avatarImage, date, content }) => {
  return (
    <>
      <div className='flex flex-row items-center gap-[20px] md:flex-row md:items-stretch md:gap-[50px]'>
        <div className='relative aspect-video min-w-[80px] md:aspect-square md:min-w-[200px]'>
          <Image src='/sand.jpg' alt='' fill className='object-cover' />
        </div>

        <div className='flex flex-col gap-[10px]'>
          <div className='flex flex-row items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className='font-medium'>John Doe</span>
            <span className='text-muted-foreground'>{date} </span>
          </div>
          <Link href='' className=''>
            <h1 className='mb-1 text-xl'>{title}</h1>
            <p className='multi-line-ellipsis text-muted-foreground'>{content}</p>
          </Link>

          <Badge className='mt-auto w-max bg-muted-foreground'>
            <span>Travel</span>
          </Badge>
        </div>
      </div>
    </>
  );
};

export default Card;
