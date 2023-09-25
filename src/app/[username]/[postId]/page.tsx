import { FC } from 'react';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPost } from '@/actions/getPost';
import { getUserByUsername } from '@/actions/getUserByUsername';
import { formatDate } from '@/util/formatDate';
import { Bookmark, Heart, MessageSquare, Share } from 'lucide-react';
import { getServerSession } from 'next-auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SeparatorDot from '@/components/ui/separator-dot';

type PostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};

const PostPage: FC<PostPageProps> = async ({ params }) => {
  const { username, postId } = params;

  const { name, image } = await getUserByUsername(decodeURIComponent(username));
  const post = await getPost(postId);

  if (!post) throw new Error('Failed to fetch post');

  return (
    <>
      <div className='container flex min-h-screen flex-col items-center py-[100px]'>
        <div className='relative mb-10 aspect-video w-full max-w-[750px]'>
          <Image src='/sand.jpg' alt='sand' fill className='rounded-lg object-cover' />
        </div>

        <div className='w-full md:max-w-[680px]'>
          <div className='mb-3 flex flex-row items-center gap-3'>
            <Link href={`${username}`} className='flex flex-row items-center gap-2'>
              <Avatar className='h-12 w-12'>
                {image ? <Image src={image} alt='' /> : <AvatarFallback>{name?.split('')[0]}</AvatarFallback>}
              </Avatar>

              <div className='flex flex-col'>
                <span className='font-bold text-primary'>{name}</span>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-muted'>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </Link>
          </div>

          <div className='mb-10 flex flex-row gap-5'>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:text-muted/100'
            >
              <Heart className='h-5 w-5 ' />
              Like
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:text-muted/100'
            >
              <MessageSquare className='h-5 w-5' />
              Comment
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:text-muted/100'
            >
              <Bookmark className='h-5 w-5' />
              Save
            </Button>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:text-muted/100'
            >
              <Share className='h-5 w-5' />
              Share
            </Button>
          </div>

          <Separator />

          <div className='mt-10'>
            <h1 className='text-balance title'>{post?.title}</h1>
            <h2 className='text-balancel subtitle'>{post?.subtitle}</h2>
          </div>

          <div
            className='content-section mt-10 flex flex-col gap-5 text-xl leading-8 text-paragraph'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </>
  );
};

export default PostPage;
