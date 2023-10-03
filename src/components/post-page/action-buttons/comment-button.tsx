'use client';

import * as React from 'react';
import { FC, forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUserByEmail } from '@/actions/getUserByEmail';
import { cn } from '@/util/cn';
import { MD } from '@/util/constants';
import { formatDate } from '@/util/formatDate';
import { useViewportSize } from '@mantine/hooks';
import { useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Post, User } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';

type CommentButtonProps = {
  mainPost: Post;
  currentSignedInUser: User;
};

export const commentAtom = atomWithStorage('comment', '');

const CommentButton: FC<CommentButtonProps> = ({ currentSignedInUser }) => {
  const { data: session } = useSession();
  const { width } = useViewportSize();

  const [comment, setComment] = useAtom(commentAtom);
  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isCommentInputExpanded, setIsCommentInputExpanded] = useState(false);

  const commentDivRef = useRef<HTMLDivElement | null>(null);

  const handleOpenCommentDialog = () => {
    if (!session || !session?.user?.email) {
      setIsCommentDialogOpen(false);

      return setIsSignInDialogOpen(true);
    }

    const storedComment = localStorage.getItem('comment');
    if (storedComment && commentDivRef.current) {
      commentDivRef.current.textContent = storedComment;
    }
  };

  const handleInput = () => {
    if (commentDivRef.current) {
      setComment(commentDivRef.current.innerHTML || '');
    }
  };

  useEffect(() => {
    if (commentDivRef.current) {
      commentDivRef.current.textContent = comment;
    }
  }, [comment, isCommentDialogOpen]);

  const isEmpty = !commentDivRef.current?.textContent?.trim();

  return (
    <>
      {!session ? (
        <Button
          variant='ghost'
          onClick={() => setIsSignInDialogOpen(true)}
          className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
        >
          <MessageSquare className='h-5 w-5' />
          <span className='hidden sm:flex'>Comment</span>
        </Button>
      ) : (
        <>
          <Sheet open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                onClick={handleOpenCommentDialog}
                className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
              >
                <MessageSquare className='h-5 w-5' />
                <span className='hidden sm:flex'>Comment</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side={width < MD ? 'bottom' : 'right'}
              className='h-[100dvh] overflow-y-auto overflow-x-hidden md:min-w-[450px]'
            >
              <SheetHeader className='text-left'>
                <SheetTitle className='text-2xl'>Comments</SheetTitle>

                {/* Comment input main section */}
                <div
                  className={cn(
                    `relative flex min-h-[52px] w-full flex-col  
                gap-3 rounded-lg p-5 shadow-md transition-all duration-500`,
                    { 'min-h-[250px]': isCommentInputExpanded }
                  )}
                >
                  <div
                    className={cn(
                      `pointer-events-none absolute flex translate-y-[-21px] select-none flex-row items-center 
                  gap-2 opacity-0 transition-all duration-500`,
                      { 'pointer-auto opacity-1 translate-y-0 select-text': isCommentInputExpanded }
                    )}
                  >
                    <Avatar className='h-10 w-10'>
                      {currentSignedInUser?.image ? (
                        <Image src={currentSignedInUser.image} alt='User avatar' />
                      ) : (
                        <AvatarFallback className='text-primary'>
                          {currentSignedInUser?.name?.split('')[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-medium text-primary'>{currentSignedInUser?.name}</span>
                    </div>
                  </div>

                  {/* TODO: Get the data from localstorage and display it on the div */}
                  <div
                    ref={commentDivRef}
                    onInput={handleInput}
                    onFocus={() => setIsCommentInputExpanded(true)}
                    className={cn(`editable outline-0 transition-all duration-500`, {
                      empty: isEmpty,
                      'translate-y-[52px]': isCommentInputExpanded,
                    })}
                    contentEditable={true}
                    // dangerouslySetInnerHTML={{ __html: comment }} // this is not working properly
                    data-placeholder='Enter your comment here...'
                  />

                  <div
                    className={cn(
                      `pointer-events-none absolute bottom-5 right-5 flex select-none flex-row 
                  items-center opacity-0 transition-all  duration-500`,
                      { 'opacity-1 pointer-events-auto select-auto delay-100': isCommentInputExpanded }
                    )}
                  >
                    <Button
                      variant='ghost'
                      className='text-muted'
                      onClick={() => setIsCommentInputExpanded(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant='accent' className='h-8 text-white' disabled={true}>
                      Publish
                    </Button>
                  </div>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
};

export default CommentButton;
