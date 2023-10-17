import * as React from 'react';
import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { formatDate } from '@/util/formatDate';
import sanitizeHtml from 'sanitize-html';

import { CommentWithUserInfoDTO, Reply as ReplyType } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Reply from '@/components/post-page/action-buttons/reply';

type CommentListProps = {
  numberOfComments: number;
  commentsWithUserInfo: CommentWithUserInfoDTO[];
};

const CommentList: FC<CommentListProps> = ({ numberOfComments, commentsWithUserInfo }) => {
  return (
    <>
      <div className='my-5'>
        {numberOfComments ? (
          <div className='flex flex-col gap-5'>
            {commentsWithUserInfo.map(comment => (
              <div key={comment._id?.toString()} className='flex flex-col gap-3'>
                <Link href={`/${comment.username}`} className='flex flex-row items-center gap-2'>
                  <Avatar className='h-10 w-10'>
                    <AvatarFallback className='text-primary'>{comment.name?.split('')[0]}</AvatarFallback>
                  </Avatar>

                  <div className='flex flex-col'>
                    <span className='font-bold text-primary'>{comment.name}</span>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='text-muted'>{formatDate(comment.createdAt.toString())}</span>
                    </div>
                  </div>
                </Link>

                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.comment) }}
                  className={cn(`text-primary`)}
                />

                <div className='mb-4'>
                  {/*<Reply comment={comment} />*/}

                  {/*<div>*/}
                  {/*  {comment.replies.map((reply: ReplyType) => {*/}
                  {/*    return (*/}
                  {/*      <div key={reply?._id?.toString()} className='m ml-2 border-l-4 border-l-muted/10'>*/}
                  {/*        <div className='ml-6 flex flex-col gap-3 rounded-lg py-5'>*/}
                  {/*          <Link href={`/${comment.username}`} className='flex flex-row items-center gap-2'>*/}
                  {/*            <Avatar className='h-10 w-10'>*/}
                  {/*              <AvatarFallback className='text-primary'>*/}
                  {/*                {comment.name?.split('')[0]}*/}
                  {/*              </AvatarFallback>*/}
                  {/*            </Avatar>*/}

                  {/*            <div className='flex flex-col'>*/}
                  {/*              <span className='font-bold text-primary'>{comment.name}</span>*/}
                  {/*              <div className='flex flex-row items-center gap-2'>*/}
                  {/*                <span className='text-muted'>*/}
                  {/*                  {formatDate(comment.createdAt.toString())}*/}
                  {/*                </span>*/}
                  {/*              </div>*/}
                  {/*            </div>*/}
                  {/*          </Link>*/}

                  {/*          <div*/}
                  {/*            dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.reply) }}*/}
                  {/*            className={cn(`text-primary`)}*/}
                  {/*          />*/}
                  {/*        </div>*/}
                  {/*      </div>*/}
                  {/*    );*/}
                  {/*  })}*/}
                  {/*</div>*/}
                </div>

                <Separator />
              </div>
            ))}
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

export default CommentList;
