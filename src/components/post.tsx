'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/actions/getUser';
import { type Post } from '@/types';
import { cn } from '@/util/cn';
import { Heart, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';

type CardProps = {
  post: Post;
};

type UserDetails = {
  userId: string;
  name: string;
  username: string;
};

const TITLE_HEIGHT = 32;

const Post: FC<CardProps> = ({ post: { author, title, content, likes, comments, views, createdAt }, post }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const [user, setUser] = useState<UserDetails>();

  useEffect(() => {
    const titleNode = titleRef.current;
    if (!titleNode) return;

    if (titleNode.clientHeight > TITLE_HEIGHT) setIsWrapped(true);
  }, [title]);

  useEffect(() => {
    (async () => setUser(await getUser('', author)))();
  }, [author, setUser]);

  return (
    <>
      <Card>
        <div className='flex flex-row items-center gap-2'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-bold text-primary'>{user?.name}</span>
            <div className='flex flex-row items-center gap-2'>
              <span className='text-muted'>{user?.username}</span>
              <SeparatorDot />
              <span className='text-muted'>{createdAt.toDateString().split(' ').slice(1, 4).join(' ')}</span>
            </div>
          </div>
        </div>

        <Link href='/' className='flex flex-col gap-1 md:flex-row md:items-end md:gap-7'>
          <div className='flex  flex-col'>
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
