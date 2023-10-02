'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { cn } from '@/util/cn';
import { LIKE } from '@/util/constants';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Post } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type LikeButtonProps = {
  mainPost: Post;
  currentSignedInUserId: string;
};

const DEBOUNCE_DURATION = 300;
const TRANSITION_DELAY = 300;

const LikeButton: FC<LikeButtonProps> = ({ mainPost, currentSignedInUserId }) => {
  const { data: session } = useSession();

  const [totalLikeCount, setTotalLikeCount] = useState(mainPost?.likes?.length);
  const [userLikeCount, setUserLikeCount] = useState(
    mainPost.likes.filter(id => id === currentSignedInUserId).length
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // const [shouldPulse, setShouldPulse] = useState(false);

  const toastRef = useRef<HTMLDivElement | null>(null);

  const totalClicks = useRef(1);
  const lastClickedRef = useRef<number | null>(null);

  const toggleToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useEffectToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateDbAfterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount and unmount
  useEffect(() => {
    // TODO: remove transition animation on mount
    if (toastRef.current) {
      toastRef.current.style.transform = 'translateY(-20px)';
      toastRef.current.style.opacity = '0';
      toastRef.current.style.transition = 'none';
    }
    return () => {
      if (toggleToastTimeoutRef.current) clearTimeout(toggleToastTimeoutRef.current);
      lastClickedRef.current = null;
    };
  }, []);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE DEBOUNCED LIKE CLICK
   * @summary
   * This function is called when the user clicks the like button.
   * It uses a debounce implementation to prevent multiple clicks within a short time, causing spammed
   * network requests (not good for the server)
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleLikeClick = async () => {
    if (toggleToastTimeoutRef.current) clearTimeout(toggleToastTimeoutRef.current);
    setIsPopoverOpen(false);
    setIsToastOpen(true);

    if (userLikeCount < 30) {
      const currentTime = Date.now();

      setUserLikeCount(prev => prev + 1);
      setTotalLikeCount(prev => prev + 1);

      // If the click is within the debounce window, accumulate the count
      // Else the click is outside the debounce window, reset the accumulated count and start again
      if (lastClickedRef.current) {
        if (currentTime - lastClickedRef.current < DEBOUNCE_DURATION) totalClicks.current += 1;
        else totalClicks.current = 1;
      }

      lastClickedRef.current = currentTime; // Record the time of the last click

      // If the debounce window has ended, send a request to the server to update the database
      updateDbAfterDebounceRef.current = setTimeout(async () => updateDbAfterDebounce(), DEBOUNCE_DURATION);
    }

    // Toggle toast after debounce window has ended
    toggleToastTimeoutRef.current = setTimeout(() => setIsToastOpen(false), DEBOUNCE_DURATION * 3);
  };

  const updateDbAfterDebounce = async () => {
    if (Date.now() - (lastClickedRef.current || 0) >= DEBOUNCE_DURATION) {
      await addLikeCountToDatabase(totalClicks.current);
    }
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * ADD LIKE COUNT TO DATABASE
   * @param totalLikeCount The number of likes to add to the database
   * @summary
   * This function is called when the debounce window has ended.
   * It sends a request to the server to add the accumulated like count to the database.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const addLikeCountToDatabase = async (totalLikeCount: number) => {
    const { signal } = new AbortController();

    if (!mainPost) throw new Error('Post not found');
    if (!session) throw new Error('Session not found');
    if (!session?.user?.email) throw new Error('Email session not found');

    const body: ActionButtonRequestBody = {
      actionId: LIKE,
      postId: mainPost._id,
      userId: currentSignedInUserId,
      totalLikeCount,
    };

    const response = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    });

    console.log(await response.json());
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * TOGGLE TOAST
   * @summary
   * This function is called when the user clicks the like button.
   * It toggles the toast to show the number of likes the user has accumulated.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!toastRef.current) return;

    if (isToastOpen) {
      toastRef.current.style.transition = 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)';
      toastRef.current.style.transform = 'translateY(0px)';
      toastRef.current.style.opacity = '1';
    }

    if (!isToastOpen) {
      toastRef.current.style.transform = 'translateY(-20px)';
      toastRef.current.style.opacity = '0';

      if (useEffectToastTimeoutRef.current) clearTimeout(useEffectToastTimeoutRef.current);

      useEffectToastTimeoutRef.current = setTimeout(() => {
        if (!toastRef.current) return;
        toastRef.current.style.transform = 'translateY(40px)';
        toastRef.current.style.transition = 'none';
      }, 150);
    }

    return () => {
      if (useEffectToastTimeoutRef.current) clearTimeout(useEffectToastTimeoutRef.current);
    };
  }, [isToastOpen]);

  return (
    <>
      <TooltipProvider delayDuration={700}>
        <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              onClick={handleLikeClick}
              className='relative flex w-max flex-row gap-1 p-0 text-muted/80 transition-colors hover:bg-transparent hover:text-primary'
            >
              <Heart className='h-5 w-5' />
              {totalLikeCount}
              <div
                ref={toastRef}
                className={cn(
                  `pointer-events-none absolute top-[-40px] z-50 flex h-10 w-10 select-none items-center 
                  justify-center rounded-full border bg-foreground px-3 py-1.5 text-sm 
                  font-medium text-secondary shadow-md`
                )}
              >
                <span>+</span>
                <span>{userLikeCount}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className=' flex items-center justify-center rounded-md bg-foreground font-medium text-secondary'>
            <p>Like</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default LikeButton;
