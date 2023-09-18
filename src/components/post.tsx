'use client';

import { FC, useEffect, useRef, useState, useTransition } from 'react';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/actions/getUser';
import { User, type Post } from '@/types';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import { Heart, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';
import { Skeleton } from '@/components/ui/skeleton';

type CardProps = {
  post: Post;
};

const TITLE_HEIGHT = 32;

const Post: FC<CardProps> = ({ post: { author, title, content, likes, comments, views, createdAt } }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const [user, setUser] = useState<Partial<User> | null>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const titleNode = titleRef.current;
    if (!titleNode) return;

    if (titleNode.clientHeight > TITLE_HEIGHT) setIsWrapped(true);
  }, [title]);

  useEffect(() => {
    (async () => startTransition(async () => setUser(await getUser(undefined, author))))();
  }, [author, setUser]);

  return (
    <>
      <Card>
        {pending ? (
          <div className='flex flex-row items-center gap-2'>
            {/* Avatar */}
            <Skeleton className='h-12 w-12 rounded-full bg-primary/30' />

            {/* Name, username, date */}
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-[16px] w-[100px] bg-primary/30' />
              <Skeleton className='h-[16px] w-[200px] bg-primary/30' />
            </div>
          </div>
        ) : (
          <div className='flex flex-row items-center gap-2'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-bold text-primary'>{user?.name}</span>
              <div className='flex flex-row items-center gap-2'>
                <span className='text-muted'>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        )}

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

          <div className='relative aspect-video h-max w-full rounded-2xl md:h-[108px] md:w-[180px]'>
            <Image src='/sand.jpg' alt='' fill className='rounded-2xl object-cover' />
          </div>
        </Link>

        <CardFooter>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <Heart className='h-5 w-5' />
            <span>{likes}</span>
          </div>
          <div className='mr-3 flex flex-row items-center gap-1'>
            <MessageCircle className='h-5 w-5' />
            <span>{comments.length}</span>
          </div>
          <SeparatorDot />
          <span className='ml-3'>{views} views</span>
        </CardFooter>
      </Card>
    </>
  );
};

export default Post;
