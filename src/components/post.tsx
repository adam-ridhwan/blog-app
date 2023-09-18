'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/actions/getUser';
import { User, type Post } from '@/types';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import { atom, useAtom } from 'jotai';
import { Heart, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CardSkeleton from '@/components/ui/card-skeleton';
import SeparatorDot from '@/components/ui/separator-dot';

type CardProps = {
  post: Post;
};

const TITLE_HEIGHT = 32;

const Post: FC<CardProps> = ({ post: { author, title, content, likes, comments, views, createdAt } }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const [user, setUser] = useState<Partial<User> | null>();
  const [pending, startTransition] = useTransition();

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * WRAP TITLE
   * Wrap title if it exceeds the height of 32px
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const titleNode = titleRef.current;
    if (!titleNode) return;

    if (titleNode.clientHeight > TITLE_HEIGHT) setIsWrapped(true);
  }, [title]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCH USER
   * Fetch user from the server using server action
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => startTransition(async () => setUser(await getUser(undefined, author))))();
  }, [author, setUser]);

  return (
    <>
      {pending ? (
        <div className='w-[728px]'>
          <CardSkeleton />
        </div>
      ) : (
        <Card>
          <div className='flex flex-row items-center gap-2'>
            <Link href='/'>
              <Avatar className='h-12 w-12'>
                {user?.image ? (
                  <Image src={user?.image} alt='' />
                ) : (
                  <AvatarFallback>{user?.name?.split('')[0]}</AvatarFallback>
                )}
              </Avatar>
            </Link>
            <div className='flex flex-col'>
              <Link href='/'>
                <span className='font-bold text-primary'>{user?.name}</span>
              </Link>
              <div className='flex flex-row items-center gap-2'>
                <span className='text-muted'>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          <Link href='/' className='flex flex-col gap-1 md:flex-row md:items-end md:gap-7'>
            <div className='flex flex-col '>
              <CardHeader>
                <CardTitle ref={titleRef} className={cn(`two-line-ellipsis h-[32px] text-primary`)}>
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

          <Link href='/'>
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
          </Link>
        </Card>
      )}
    </>
  );
};

export default Post;
