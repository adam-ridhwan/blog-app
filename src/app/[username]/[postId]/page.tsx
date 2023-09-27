import * as React from 'react';
import { FC, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPost } from '@/actions/getPost';
import { getPostInformation } from '@/actions/getPostInformation';
import { getUserNext3Posts } from '@/actions/getUserNext3Posts';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import DOMPurify from 'isomorphic-dompurify';
import { Bookmark, Heart, MessageCircle, MessageSquare, Share } from 'lucide-react';

import { Post } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import SeparatorDot from '@/components/ui/separator-dot';
import PostItem from '@/components/main-section/post-item';

type PostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};

const PostPage: FC<PostPageProps> = async ({ params }) => {
  const { username, postId } = params;

  const { author, post } = await getPostInformation(decodeURIComponent(username), postId);
  const { name, image, followerCount } = author;
  const { mainPost, next3Posts } = post;

  if (!author || !post) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className='container flex flex-col items-center pb-[30px] pt-[100px]'>
        <div className='relative mb-10 aspect-video w-full max-w-[750px]'>
          <Image src='/sand.jpg' alt='sand' fill className='rounded-lg object-cover' />
        </div>

        <div className='w-full md:max-w-[680px]'>
          <div className='mb-3 flex flex-row items-center gap-3'>
            <Link href={`${username}`} className='flex flex-row items-center gap-2'>
              <Avatar className='h-12 w-12'>
                {image ? (
                  <Image src={image} alt='' />
                ) : (
                  <AvatarFallback className='text-primary'>{name?.split('')[0]}</AvatarFallback>
                )}
              </Avatar>

              <div className='flex flex-col'>
                <span className='font-bold text-primary'>{name}</span>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-muted'>{formatDate(mainPost.createdAt)}</span>
                </div>
              </div>
            </Link>
          </div>

          <div className='mb-5 flex flex-row gap-5'>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <Heart className='h-5 w-5 ' />
              Like
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <MessageSquare className='h-5 w-5' />
              Comment
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <Bookmark className='h-5 w-5' />
              Save
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <Share className='h-5 w-5' />
              Share
            </Button>
          </div>

          <Separator className='m-1' />

          <div className='mt-5'>
            <h1 className='text-balance title leading-9 text-primary'>{mainPost?.title}</h1>
            <h2 className='text-balance subtitle text-muted'>{mainPost?.subtitle}</h2>
          </div>

          <div
            className='content-section mt-10 flex flex-col gap-5 text-xl leading-8 text-paragraph'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mainPost.content) }}
          />
        </div>
      </div>

      <div className='w-full bg-foreground py-[20px] text-primary'>
        <div className='container flex max-w-[750px] flex-col gap-[20px]'>
          <Link href={`${username}`} className='flex flex-row items-end justify-between'>
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

          <span className='mt-3 font-bold'>More from {name}</span>

          <div className='flex flex-col gap-10'>
            {next3Posts.map(post => (
              <div key={post?._id?.toString()}>
                <Card className='gap-10 md:min-h-[266px]'>
                  <Link
                    href={`${username}/${post._id}`}
                    className='flex min-h-[112px] flex-col gap-4 md:flex-row md:items-end'
                  >
                    <div className='relative aspect-video h-max w-full rounded-2xl md:h-[108px] md:w-[180px]'>
                      <Image src='/sand.jpg' alt='' fill className='rounded-2xl object-cover' />
                    </div>

                    <Link href={`${username}`} className='flex flex-row items-center gap-2'>
                      <Avatar className='h-5 w-5'>
                        {image ? (
                          <Image src={image} alt='' />
                        ) : (
                          <AvatarFallback className='text-sm'>{name?.split('')[0]}</AvatarFallback>
                        )}
                      </Avatar>

                      <span className='font-bold text-primary'>{name}</span>
                      <span className='text-muted'>{formatDate(post.createdAt)}</span>
                    </Link>

                    <div className='flex flex-1 flex-col'>
                      <CardHeader>
                        <CardTitle className={cn(`two-line-ellipsis max-h-[64px] text-primary`)}>
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={cn(`two-line-ellipsis text-muted`)}>
                          {/*{firstNonEmptyParagraph?.innerHTML}*/}
                          Subtitle
                        </p>
                      </CardContent>
                    </div>
                  </Link>

                  <CardFooter>
                    <Button
                      variant='text'
                      className='none mr-3 flex h-0 flex-row items-center gap-1 p-0 hover:bg-none'
                    >
                      <Heart className='h-6 w-6' />
                      <span className='text-lg'>{post.likes}</span>
                    </Button>

                    <Button
                      variant='text'
                      className='none mr-3 flex h-0 flex-row items-center gap-1 p-0 hover:bg-none'
                    >
                      <MessageCircle className='h-6 w-6' />
                      <span className='text-lg'>{post.comments?.length}</span>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
