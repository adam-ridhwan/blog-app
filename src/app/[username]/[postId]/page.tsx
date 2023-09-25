import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPost } from '@/actions/getPost';
import { getPosts } from '@/actions/getPosts';
import { getUserByUsername } from '@/actions/getUserByUsername';
import { getUsersById } from '@/actions/getUsersById';
import { Bookmark, Heart, MessageSquare, Share } from 'lucide-react';

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

  const { name: fetchedName } = await getUserByUsername(decodeURIComponent(username));
  const post = await getPost(postId);

  if (!post) throw new Error('Failed to fetch post');

  return (
    <>
      <div className='container flex min-h-screen flex-col items-center py-[100px]'>
        <div className='relative mb-10 aspect-video w-full max-w-[750px]'>
          <Image src='/sand.jpg' alt='sand' fill className='rounded-lg object-cover' />
        </div>

        <div className='w-full md:max-w-[680px]'>
          <h1 className='text-balance mb-2 text-3xl font-semibold text-primary md:text-4xl'>{post?.title}</h1>
          <h2 className='text-balance text-l text-muted-foreground mb-5 font-semibold md:text-xl'></h2>

          <div className='mb-3 flex flex-row items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-row items-center gap-1'>
              <Link
                href={`/${decodeURIComponent(username)}`}
                className='font-medium text-primary underline-offset-4 hover:underline'
              >
                {fetchedName}
              </Link>
              <SeparatorDot />
              <span className='text-muted-foreground'>Mar 7th 2023</span>
            </div>
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
