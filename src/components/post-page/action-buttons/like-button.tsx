'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { currentUserAtom, postsAtom } from '@/providers/hydrate-atoms';
import { cn } from '@/util/cn';
import { LIKE_POST } from '@/util/constants';
import { delay } from '@/util/delay';
import { useLongPress } from '@uidotdev/usehooks';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useEffectOnce } from 'usehooks-ts';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type LikeButtonProps = {};

const DEBOUNCE_DURATION = 300;
const TRANSITION_DELAY = 150;
export const MAX_LIKE_COUNT = 30;

export const totalLikeCountAtom = atom(0);
export const userLikeCountAtom = atom(0);

const LikeButton: FC<LikeButtonProps> = () => {
  const pathname = usePathname();
  const [_, postId] = pathname.split('/').slice(1);

  const { data: session } = useSession();

  const currentUser = useAtomValue(currentUserAtom);
  const [posts, setPosts] = useAtom(postsAtom);
  const [totalLikeCount, setTotalLikeCount] = useAtom(totalLikeCountAtom);
  const [userLikeCount, setUserLikeCount] = useAtom(userLikeCountAtom);

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isHeartPopoverOpen, setIsHeartPopoverOpen] = useState(false);
  const [isLikeCountPopoverOpen, setIsLikeCountPopoverOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // TODO: Implement pulse animation for toast like
  // const [shouldPulse, setShouldPulse] = useState(false);

  // TODO: Implement long pressing to like
  const attrs = useLongPress(
    () => {
      // console.log('Long press activated');
    },
    {
      // onStart: event => console.log('Press started'),
      // onFinish: event => console.log('Press Finished'),
      // onCancel: event => console.log('Press cancelled'),
      threshold: 500,
    }
  );

  const toastRef = useRef<HTMLDivElement | null>(null);

  const totalClicks = useRef(1);
  const lastClickedRef = useRef<number | null>(null);

  const toggleToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useEffectToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateDbAfterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffectOnce(() => {
    const { signal } = new AbortController();

    (async () => {
      const { likes } = await fetch('/api/likes', {
        signal,
        method: 'POST',
        body: JSON.stringify({ postId }),
      }).then(res => res.json());

      if (!likes) throw new Error('Likes not found');

      const validatedLikes = z.array(z.string()).safeParse(likes);

      if (!validatedLikes.success) {
        return;
      }

      setTotalLikeCount(validatedLikes.data.length);
      setUserLikeCount(validatedLikes.data.filter(id => id.toString() === currentUser?._id).length);
      setIsFetching(false);
    })();
  });

  useEffectOnce(() => {
    if (toastRef.current) {
      toastRef.current.style.transform = 'translateY(-20px)';
      toastRef.current.style.opacity = '0';
      toastRef.current.style.transition = 'none';
    }
    return () => {
      if (toggleToastTimeoutRef.current) clearTimeout(toggleToastTimeoutRef.current);
      lastClickedRef.current = null;
    };
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE DEBOUNCED LIKE_POST CLICK
   * @summary
   * This function is called when the user clicks the like button.
   * It uses a debounce implementation to prevent multiple clicks within a short time, causing spammed
   * network requests (not good for the server)
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleLikeClick = async () => {
    if (!session || !session?.user?.email) return setIsSignInDialogOpen(true);

    if (toggleToastTimeoutRef.current) clearTimeout(toggleToastTimeoutRef.current);
    setIsHeartPopoverOpen(false);
    setIsToastOpen(true);

    if (userLikeCount < MAX_LIKE_COUNT) {
      const currentTime = Date.now();

      // Optimistic update
      setTotalLikeCount(prev => prev + 1);
      setUserLikeCount(prev => prev + 1);

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
   * ADD LIKE_POST COUNT TO DATABASE
   * @param totalLikeCount The number of likes to add to the database
   * @summary
   * This function is called when the debounce window has ended.
   * It sends a request to the server to add the accumulated like count to the database.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const addLikeCountToDatabase = async (totalLikeCount: number) => {
    const { signal } = new AbortController();

    if (!currentUser) throw new Error('User not found');

    const userId = currentUser._id;
    if (!userId) throw new Error('ID not found');

    const body: ActionButtonRequestBody = {
      actionId: LIKE_POST,
      postId,
      userId: userId.toString(),
      totalLikeCount,
    };

    const { response, likes } = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    }).then(res => res.json());

    if (response) {
      const updatedPosts = posts.map(post =>
        post._id === postId
          ? { ...post, likes: [...post.likes, ...likes] }
          : post
      ); // prettier-ignore
      setPosts(updatedPosts);
    }

    if (!response) {
      toast.error('Failed to like post');
      await delay(1000);
      // Revert optimistic update
      setTotalLikeCount(prev => prev - totalLikeCount);
      setUserLikeCount(prev => prev - totalLikeCount);
    }
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
      }, TRANSITION_DELAY);
    }

    return () => {
      if (useEffectToastTimeoutRef.current) clearTimeout(useEffectToastTimeoutRef.current);
    };
  }, [isToastOpen]);

  return (
    <>
      <div className='flex flex-row items-center'>
        <TooltipProvider delayDuration={700}>
          <Tooltip open={isHeartPopoverOpen} onOpenChange={setIsHeartPopoverOpen}>
            <TooltipTrigger asChild>
              <Button
                variant='text'
                onClick={handleLikeClick}
                className='relative p-0'
                disabled={isFetching}
                {...attrs}
              >
                {userLikeCount > 0 && !isFetching ? (
                  <Heart className='h-5 w-5 fill-primary/80 stroke-muted/80 stroke-2 opacity-60 transition-opacity duration-100 hover:opacity-100' />
                ) : (
                  <Heart className='h-5 w-5 fill-none stroke-muted/80 stroke-2 transition-colors duration-100 hover:stroke-primary' />
                )}
                <div
                  ref={toastRef}
                  className={cn(
                    `pointer-events-none absolute top-[-40px] z-50 flex h-10 w-10 select-none items-center 
                    justify-center rounded-full border bg-primary px-3 py-1.5 text-sm font-medium
                    text-secondary shadow-md`
                  )}
                >
                  <span>+</span>
                  <span>{userLikeCount}</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                `flex items-center justify-center rounded-md bg-primary font-medium text-secondary`
              )}
            >
              <p>Like</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={700}>
          <Tooltip open={isLikeCountPopoverOpen} onOpenChange={setIsLikeCountPopoverOpen}>
            <TooltipTrigger asChild>
              <Button variant='text' className='relative ml-1 p-0'>
                <span className='min-w-[20px] text-left text-muted/80 transition-colors duration-100 hover:text-primary'>
                  {isFetching ? '--' : totalLikeCount}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                `flex items-center justify-center rounded-md bg-primary font-medium text-secondary`
              )}
            >
              <p>View likes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default LikeButton;
