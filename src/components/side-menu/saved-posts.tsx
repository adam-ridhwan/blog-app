'use client';

import * as React from 'react';
import { FC, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';

import { AuthorDetails, Post } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type SavedPostsAndAuthors = Post & AuthorDetails;

type SavedPostsProps = {
  savedPosts: SavedPostsAndAuthors[];
};

const SavedPosts: FC<SavedPostsProps> = ({ savedPosts }) => {
  // TODO: Display saved posts instead of trending posts
  return (
    <>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle>Saved posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3 md:grid md:grid-cols-2 lg:flex lg:flex-col'>
            {Array.from(savedPosts.slice(0, 3)).map(post => (
              <Link key={post.title} href={`${post.username}/${post._id}`} className='flex items-center'>
                <div className='flex flex-col'>
                  <div className='flex flex-row items-center gap-2'>
                    <Avatar className='h-5 w-5'>
                      {/*{image ? <Image src={image} alt='' /> : <AvatarFallback>{name?.split('')[0]}</AvatarFallback>}*/}
                      {<AvatarFallback className='text-[12px]'>{post.name?.split('')[0]}</AvatarFallback>}
                    </Avatar>
                    <span className='font-medium text-muted'>{post.name}</span>
                  </div>
                  <h3 className='text-muted-foreground overflow-hidden font-semibold'>{post.title}</h3>
                  <span className='text-muted'>
                    {formatDate(post.createdAt.toString()).split(',').splice(0, 1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant='text'
            className={cn(
              `flex h-[40px] w-full items-center justify-center rounded-full border border-border text-muted`
            )}
          >
            See more
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SavedPosts;
