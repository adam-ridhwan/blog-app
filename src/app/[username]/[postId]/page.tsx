import * as React from 'react';
import { FC, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPostInformation } from '@/actions/getPostInformation';
import { formatDate } from '@/util/formatDate';
import DOMPurify from 'isomorphic-dompurify';
import { getServerSession } from 'next-auth';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ActionButtons from '@/components/post-page/action-buttons';
import MorePostsList from '@/components/post-page/more-posts-list';

type PostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};

const PostPage: FC<PostPageProps> = async ({ params }) => {
  const { username, postId } = params;
  const session = await getServerSession();

  const { author, post } = await getPostInformation(decodeURIComponent(username), postId);
  const { name, image, followerCount } = author;
  const { mainPost, next4Posts } = post;

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

          <ActionButtons {...{ mainPost, session }} />

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

        <div className='mt-20'>
          <ActionButtons {...{ mainPost, session }} />
        </div>
      </div>

      <MorePostsList {...{ author, next4Posts }} />
    </>
  );
};

export default PostPage;
