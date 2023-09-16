'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { ChefHatIcon, Heart, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';

type CardProps = {
  title: string;
  avatarImage?: string;
  date: string;
  content: string;
};

const TITLE_HEIGHT = 32;

const Post: FC<CardProps> = ({ title, date, content }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      const element = titleRef.current;
      if (element.clientHeight > TITLE_HEIGHT) setIsWrapped(true);
    }
  }, [title]);

  return (
    <>
      <Card>
        <div className='flex flex-row items-center gap-2'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-bold text-primary'>John Doe</span>
            <div className='flex flex-row items-center gap-2'>
              <span className='text-muted'>@johndoe.1234</span>
              <SeparatorDot />
              <span className='text-muted'>{date}</span>
            </div>
          </div>
        </div>

        <Link href='/' className='flex flex-col gap-1 md:flex-row md:items-end md:gap-7'>
          <div className='flex flex-col'>
            <CardHeader>
              <CardTitle ref={titleRef} className={cn(`two-line-ellipsis text-primary`)}>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  `hidden text-muted`,
                  { 'two-line-ellipsis': isWrapped },
                  { 'three-line-ellipsis': !isWrapped }
                )}
              >
                {content}
              </p>
            </CardContent>
          </div>

          <div className='relative aspect-video h-max w-full rounded-2xl md:min-h-[108px] md:min-w-[180px]'>
            <Image src='/sand.jpg' alt='' fill className='rounded-2xl object-cover' />
          </div>
        </Link>

        <CardFooter>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Heart className='h-5 w-5' />
            <span>19</span>
          </div>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <MessageCircle className='h-5 w-5' />
            <span>23</span>
          </div>
          <SeparatorDot />
          <span className='ml-3'>23 reads</span>
        </CardFooter>
      </Card>
    </>
  );
};

export default Post;
