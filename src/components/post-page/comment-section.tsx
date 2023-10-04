import * as React from 'react';
import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import { Heart } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

import { CommentWithUserInfo, Post } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type CommentSectionProps = {
  comments: CommentWithUserInfo[];
};

const CommentSection: FC<CommentSectionProps> = async ({ comments }) => {
  //TODO: I need to render comment after publishing it
  return (
    <>
      <div className='my-5 '>
        {comments.length > 0 ? (
          <div className='flex flex-col gap-5'>
            {comments
              .map(comment => {
                return (
                  <>
                    <div key={comment._id?.toString()} className='flex flex-col gap-3'>
                      <Link href={`${comment.username}`} className='flex flex-row items-center gap-2'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback className='text-primary'>
                            {comment.name?.split('')[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-col'>
                          <span className='font-bold text-primary'>{comment.name}</span>
                          <div className='flex flex-row items-center gap-2'>
                            <span className='text-muted '>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                      </Link>

                      <div
                        key={comment._id?.toString()}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.response) }}
                        className={cn(`text-primary`)}
                      />

                      <div className='flex flex-row items-center justify-between'>
                        <Button variant='text' className='flex flex-row items-center gap-2 p-0'>
                          {comment.likes.length !== 0 ? (
                            <Heart className='h-5 w-5 fill-primary/80 stroke-none stroke-2 opacity-60 transition-opacity duration-100 hover:opacity-100' />
                          ) : (
                            <Heart className='h-5 w-5 fill-none stroke-muted/80 stroke-2 transition-colors duration-100 hover:stroke-primary' />
                          )}
                          <span>{comment.likes.length}</span>
                        </Button>

                        <Button variant='text'>Reply</Button>
                      </div>
                    </div>

                    <Separator />
                  </>
                );
              })
              .reverse()}
          </div>
        ) : (
          <div className='text flex flex-col items-center whitespace-nowrap italic'>
            <span className='text-center text-muted'>There are currently no responses for this post.</span>
            <span className='text-muted'>Be the first to respond.</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CommentSection;
