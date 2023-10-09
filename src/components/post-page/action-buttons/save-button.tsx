'use client';

import * as React from 'react';
import { FC, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { currentUserAtom } from '@/providers/hydrate-atoms';
import { DELETE_SAVED_POST, SAVE } from '@/util/constants';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { Bookmark } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import Overlay from '@/components/ui/overlay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type SaveButtonProps = {};

const SaveButton: FC<SaveButtonProps> = () => {
  const pathname = usePathname();
  const [_, postId] = pathname.split('/').slice(1);
  const [isPending, startTransition] = useTransition();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [isPostSaved, setIsPostSaved] = useState(currentUser?.savedPosts.includes(postId));

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SAVE POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleSavePost = () => {
    if (!currentUser) return setIsSignInDialogOpen(true);
    if (isPostSaved) return;

    setIsPostSaved(true);

    startTransition(async () => {
      const { signal } = new AbortController();

      if (!currentUser || !currentUser._id) throw new Error('User not found');

      const body: ActionButtonRequestBody = {
        actionId: SAVE,
        postId,
        userId: currentUser?._id.toString(),
      };

      const { response } = await fetch('/api/post', {
        signal,
        method: 'POST',
        body: JSON.stringify(body),
      }).then(res => res.json());

      if (!response) {
        setIsPostSaved(false);
        throw new Error('Failed to save post');
      }

      if (response) {
        setIsPostSaved(true);
        if (!currentUser.savedPosts.includes(postId)) {
          setCurrentUser({
            ...currentUser,
            savedPosts: [...currentUser.savedPosts, postId],
          });
        }
      }
    });
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * REMOVE SAVED POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleRemoveSavedPost = () => {
    startTransition(async () => {
      const { signal } = new AbortController();

      if (!currentUser || !currentUser._id) throw new Error('User not found');

      const body: ActionButtonRequestBody = {
        actionId: DELETE_SAVED_POST,
        postId,
        userId: currentUser?._id.toString(),
      };

      const { response } = await fetch('/api/post', {
        signal,
        method: 'POST',
        body: JSON.stringify(body),
      }).then(res => res.json());

      if (response) {
        setIsPostSaved(false);
        setCurrentUser({
          ...currentUser,
          savedPosts: currentUser.savedPosts.filter(id => id !== postId),
        });
      }
    });
  };

  return (
    <>
      <Overlay isOpen={isPopoverOpen} />

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger
                disabled={isPending}
                className='flex w-max flex-row items-center gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
                onClick={handleSavePost}
              >
                {isPostSaved ? (
                  <Bookmark className='h-5 w-5 fill-primary/80 stroke-muted/80 stroke-2 opacity-60 transition-opacity duration-100 hover:opacity-100' />
                ) : (
                  <Bookmark className='h-5 w-5 fill-none stroke-muted/80 stroke-2 transition-colors duration-100 hover:stroke-primary' />
                )}
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
              <p>Save</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className='flex flex-row items-center gap-3'>
          <Checkbox disabled={isPending} checked={isPostSaved} onCheckedChange={handleRemoveSavedPost} />
          <span className='text-muted'>Saved list</span>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SaveButton;
