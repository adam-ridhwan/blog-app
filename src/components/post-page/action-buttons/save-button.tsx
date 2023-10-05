'use client';

import * as React from 'react';
import { FC, useState, useTransition } from 'react';
import { SAVE } from '@/util/constants';
import { Bookmark } from 'lucide-react';

import { Post, User } from '@/types/types';
import { Checkbox } from '@/components/ui/checkbox';
import Overlay from '@/components/ui/overlay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type SaveButtonProps = {
  mainPost: Post;
  currentSignedInUser: User;
};

const SaveButton: FC<SaveButtonProps> = ({ mainPost, currentSignedInUser }) => {
  const [isPending, startTransition] = useTransition();

  const [isPostSaved, setIsPostSaved] = useState(
    mainPost._id ? currentSignedInUser.savedPosts.includes(mainPost._id) : false
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const openPopover = () => setIsPopoverOpen(true);
  const closePopover = () => setIsPopoverOpen(false);

  const handleSavePost = () => {
    if (isPostSaved) return;

    startTransition(async () => {
      console.log('saving post');
      const { signal } = new AbortController();
      if (!mainPost) throw new Error('Post not found');
      if (!currentSignedInUser) throw new Error('User not found');

      const postId = mainPost._id;
      const userId = currentSignedInUser._id;

      if (!postId || !userId) throw new Error('IDs not found');

      const body: ActionButtonRequestBody = {
        actionId: SAVE,
        postId: postId.toString(),
        userId: userId.toString(),
      };

      const pendingSavePost = await fetch('/api/post', {
        signal,
        method: 'POST',
        body: JSON.stringify(body),
      });

      const fetchedSavePost = await pendingSavePost.json();

      if (fetchedSavePost) {
        console.log('saved post');
        setIsPostSaved(true);
      }
    });
  };

  // TODO: Implement this
  const handleRemoveSavedPost = () => {
    console.log('removing saved post');
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
          <Checkbox
            disabled={isPending}
            checked={isPostSaved}
            onCheckedChange={() => setIsPostSaved(prev => !prev)}
            onClick={handleRemoveSavedPost}
          />
          <span className='text-muted'>Saved list</span>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SaveButton;
