import * as React from 'react';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import { Heart, MessageCircle } from 'lucide-react';

import { Post } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MorePostsSubtitle from '@/components/post-page/more-posts-subtitle';

type MorePostsProps = {
  name: string | undefined;
  username: string;
  image: string | undefined;
  post: Post;
};

const MorePostsItem: FC<MorePostsProps> = ({
  name,
  username,
  image,
  post: { _id, title, subtitle, content, createdAt, likes, comments },
}) => {
  return (
    <>
      <Card className='flex justify-between md:h-[380px] md:min-h-[350px] md:border-none md:p-0 md:shadow-none'>
        <Link href={`${_id}`} className='flex min-h-[112px] flex-col'>
          <div className='relative aspect-video h-max w-full rounded-2xl md:h-[160px] md:w-[325px]'>
            <Image src='/sand.jpg' alt='' fill className='rounded-2xl object-cover' />
          </div>
        </Link>

        <Link href={`/${decodeURIComponent(username)}`} className='flex flex-row items-center gap-2'>
          <Avatar className='h-5 w-5'>
            {image ? (
              <Image src={image} alt='' />
            ) : (
              <AvatarFallback className='text-sm'>{name?.split('')[0]}</AvatarFallback>
            )}
          </Avatar>

          <span className='font-bold text-primary'>{name}</span>
          <span className='text-muted'>{formatDate(createdAt.toString())}</span>
        </Link>

        <Link href={`/${decodeURIComponent(username)}`} className='flex h-[105px] flex-col'>
          <CardHeader>
            <CardTitle className={cn(`two-line-ellipsis text-primary`)}>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <MorePostsSubtitle content={content} subtitle={subtitle} />
          </CardContent>
        </Link>

        <Link href={`/${decodeURIComponent(username)}`}>
          <CardFooter>
            <Button
              variant='text'
              className='none mr-3 flex h-max flex-row items-center gap-1 p-0 hover:bg-none'
            >
              <Heart className='h-5 w-5' />
              <span className='text-md'>{likes.length}</span>
            </Button>

            <Button
              variant='text'
              className='none mr-3 flex h-max flex-row items-center gap-1 p-0 hover:bg-none'
            >
              <MessageCircle className='h-5 w-5' />
              <span className='text-md'>{comments?.length}</span>
            </Button>
          </CardFooter>
        </Link>
      </Card>

      <Separator className='mt-8 md:hidden' />
    </>
  );
};

export default MorePostsItem;
