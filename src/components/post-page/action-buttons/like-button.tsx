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
};

const DEBOUNCE_DURATION = 300;
const TRANSITION_DURATION = 300;

const LikeButton: FC<LikeButtonProps> = ({ mainPost }) => {
  const { data: session } = useSession();

  const [likeCount, setLikeCount] = useState(mainPost?.likes?.length);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  const totalClicks = useRef(0);
  const lastClickedRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      lastClickedRef.current = null;
    };
  }, []);

  useEffect(() => {
    console.log(isToastOpen);
  }, [isToastOpen]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE DEBOUNCED LIKE CLICK
   * @summary This function is called when the user clicks the like button.
   * It uses a debounce implementation to prevent multiple clicks within a short time, causing spammed
   * network requests (not good for the server)
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleLikeClick = async () => {
    setIsToastOpen(true);
    setIsPopoverOpen(false);

    if (likeCount !== 30) setLikeCount(prev => prev + 1);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    const currentTime = Date.now();

    // If the click is within the debounce window, accumulate the count
    // Else the click is outside the debounce window, reset the accumulated count and start again
    if (lastClickedRef.current && currentTime - lastClickedRef.current < DEBOUNCE_DURATION)
      totalClicks.current += 1;
    else totalClicks.current = 1;

    lastClickedRef.current = currentTime; // Record the time of the last click

    // Timeout to determine when the debounce window has ended
    setTimeout(async () => {
      if (Date.now() - (lastClickedRef.current || 0) >= DEBOUNCE_DURATION) {
        await addLikeCountToDatabase(totalClicks.current);
      }
    }, DEBOUNCE_DURATION);

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastOpen(false);
    }, DEBOUNCE_DURATION * 3) as unknown as number;
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * ADD LIKE COUNT TO DATABASE
   * @param likeCount The number of likes to add to the database
   * @summary
   * This function is called when the debounce window has ended.
   * It sends a request to the server to add the accumulated like count to the database.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const addLikeCountToDatabase = async (likeCount: number) => {
    const { signal } = new AbortController();

    if (!mainPost) throw new Error('Post not found');
    if (!session) throw new Error('Session not found');
    if (!session?.user?.email) throw new Error('Email session not found');

    const body: ActionButtonRequestBody = {
      actionId: LIKE,
      postId: mainPost._id,
      email: session.user.email,
      likeCount,
    };

    const response = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    });

    console.log(await response.json());
  };

  useEffect(() => {
    if (!toastRef.current) return;

    if (isToastOpen) {
      toastRef.current.style.transform = 'translateY(0px)';
      toastRef.current.style.opacity = '1';
    }

    if (!isToastOpen) {
      toastRef.current.style.transform = 'translateY(-20px)';
      toastRef.current.style.opacity = '0';

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        toastRef.current!.style.transform = 'translateY(40px)';
      }, TRANSITION_DURATION);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isToastOpen]);

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              onClick={handleLikeClick}
              className='relative flex w-max flex-row gap-1 p-0 text-muted/80 transition-colors hover:bg-transparent hover:text-primary'
            >
              <Heart className='h-5 w-5' />
              Like
              <div
                ref={toastRef}
                className={cn(
                  `pointer-events-none absolute top-[-40px] z-50 flex h-10 w-10 select-none items-center 
                  justify-center rounded-full border bg-foreground px-3 py-1.5 text-sm 
                  font-medium text-secondary shadow-md transition-all`
                )}
              >
                <span>+</span>
                <span>{likeCount}</span>
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
