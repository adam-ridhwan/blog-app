import * as React from 'react';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import { Heart, MessageCircle } from 'lucide-react';

import { AuthorDetails, Post } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MorePostsItem from '@/components/post-page/more-posts-item';

type MorePostsProps = {
  author: AuthorDetails;
  next4Posts: Post[];
};

const MorePostsList: FC<MorePostsProps> = ({
  author: { name, username, image, followerCount },
  next4Posts,
}) => {
  return (
    <>
      <div className='w-full bg-foreground pb-[100px] pt-[50px] text-primary'>
        <div className='container flex max-w-[750px] flex-col gap-[20px]'>
          <Link href={`${decodeURIComponent(username)}`} className='flex flex-row items-end justify-between'>
            <Avatar className='h-20 w-20'>
              {image ? (
                <Image src={image} alt='' />
              ) : (
                <AvatarFallback className='text-3xl text-primary'>{name?.split('')[0]}</AvatarFallback>
              )}
            </Avatar>

            <Button variant='accent'>Follow</Button>
          </Link>

          <div className='flex flex-col'>
            <span className='text-2xl font-medium text-primary'>Written by {name}</span>
            <span>{followerCount} followers</span>
          </div>

          <Separator />

          <span className='text-md mt-3 font-bold'>More from {name}</span>

          <div className='flex flex-col gap-8 md:grid md:grid-cols-2'>
            {next4Posts.map(post => (
              <div key={post?._id?.toString()}>
                <MorePostsItem {...{ name, username, image, post }} />
              </div>
            ))}
          </div>

          <Separator className='m-1' />
        </div>
      </div>
    </>
  );
};

export default MorePostsList;
