'use client';

import * as React from 'react';
import { FC, useState } from 'react';
import { DELETE_LIKES } from '@/util/constants';
import { delay } from '@/util/delay';
import { useAtom, useSetAtom } from 'jotai';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import sanitizeHtml from 'sanitize-html';

import { CommentWithUserInfo, Post, User } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { totalLikeCountAtom, userLikeCountAtom } from '@/components/post-page/action-buttons/like-button';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type MoreOptionsButtonProps = {
  mainPost: Post;
  currentSignedInUser: User;
};

const MoreOptionsButton: FC<MoreOptionsButtonProps> = ({ mainPost, currentSignedInUser }) => {
  const { data: session } = useSession();
  const [totalLikeCount, setTotalLikeCount] = useAtom(totalLikeCountAtom);
  const [userLikeCount, setUserLikeCount] = useAtom(userLikeCountAtom);

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const handleDeleteLikes = async () => {
    if (!session || !session?.user?.email) return setIsSignInDialogOpen(true);

    const { signal } = new AbortController();
    if (!session) throw new Error('Session not found');
    if (!session?.user?.email) throw new Error('Email session not found');

    const body: ActionButtonRequestBody = {
      actionId: DELETE_LIKES,
      postId: mainPost._id,
      userId: currentSignedInUser?._id?.toString(),
    };

    const deletedPostLikesResponse = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!deletedPostLikesResponse.ok) throw new Error('Could not delete likes');

    setTotalLikeCount(totalLikeCount - userLikeCount);
    setUserLikeCount(0);
  };

  return (
    <>
      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen} modal={false}>
        <TooltipProvider delayDuration={700}>
          <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger className='flex w-max flex-row items-center gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'>
                <MoreHorizontal className='h-5 w-5' />
              </TooltipTrigger>
            </DropdownMenuTrigger>

            <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
              <p>More</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align='end' onCloseAutoFocus={e => e.preventDefault()}>
          {/*<DropdownMenuLabel className='ml-[15px]'>More options</DropdownMenuLabel>*/}
          {/*<DropdownMenuSeparator />*/}
          <DropdownMenuItem>
            <Button variant='ghost' onClick={handleDeleteLikes} disabled={userLikeCount === 0}>
              Undo like for this blog post
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MoreOptionsButton;
