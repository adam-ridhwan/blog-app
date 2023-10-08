'use client';

import * as React from 'react';
import { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import { postsAtom } from '@/providers/hydrate-atoms';
import { DELETE_LIKES } from '@/util/constants';
import { useAtom, useSetAtom } from 'jotai';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Post, User } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Overlay from '@/components/ui/overlay';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { totalLikeCountAtom, userLikeCountAtom } from '@/components/post-page/action-buttons/like-button';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type MoreOptionsButtonProps = {
  currentSignedInUser: User;
};

const MoreOptionsButton: FC<MoreOptionsButtonProps> = ({ currentSignedInUser }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [_, postId] = pathname.split('/').slice(1);

  const [posts, setPosts] = useAtom(postsAtom);
  const [totalLikeCount, setTotalLikeCount] = useAtom(totalLikeCountAtom);
  const [userLikeCount, setUserLikeCount] = useAtom(userLikeCountAtom);

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const handleDeleteLikes = async () => {
    if (!session || !session?.user?.email) return setIsSignInDialogOpen(true);

    const { signal } = new AbortController();

    if (!currentSignedInUser) throw new Error('User not found');

    const userId = currentSignedInUser._id;

    if (!postId || !userId) throw new Error('ID not found');

    const body: ActionButtonRequestBody = {
      actionId: DELETE_LIKES,
      postId,
      userId: userId.toString(),
    };

    const deletedPostLikesResponse = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!deletedPostLikesResponse.ok) throw new Error('Could not delete likes');

    setTotalLikeCount(totalLikeCount - userLikeCount);
    setUserLikeCount(0);
    setPosts(
      posts.map(post => {
        return post._id === postId
          ? { ...post, likes: post.likes.filter(id => id !== userId) }
          : post;
      })
    ); // prettier-ignore
  };

  return (
    <>
      <Overlay isOpen={isDropdownMenuOpen} />

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

        <DropdownMenuContent align='center' onCloseAutoFocus={e => e.preventDefault()}>
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
