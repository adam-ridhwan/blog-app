'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { postsAtom } from '@/providers/hydrate-atoms';
import { cn } from '@/util/cn';
import { LIKE } from '@/util/constants';
import { useRenderCount } from '@uidotdev/usehooks';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { Heart } from 'lucide-react';
import { ObjectId } from 'mongodb';
import { useSession } from 'next-auth/react';
import { useEffectOnce } from 'usehooks-ts';
import { string, z } from 'zod';

import { mongoIdSchema, Post, User } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type LikeButtonProps = {
  currentSignedInUser: User;
};

const LikesSchema = z.array(z.string());

const DEBOUNCE_DURATION = 300;
const TRANSITION_DELAY = 300;

export const totalLikeCountAtom = atom(0);
export const userLikeCountAtom = atom(0);

const LikeButton: FC<LikeButtonProps> = ({ currentSignedInUser }) => {
  const pathname = usePathname();
  const [_, postId] = pathname.split('/').slice(1);

  const { data: session } = useSession();

  const [posts, setPosts] = useAtom(postsAtom);
  const [totalLikeCount, setTotalLikeCount] = useAtom(totalLikeCountAtom);
  const [userLikeCount, setUserLikeCount] = useAtom(userLikeCountAtom);

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isHeartPopoverOpen, setIsHeartPopoverOpen] = useState(false);
  const [isLikeCountPopoverOpen, setIsLikeCountPopoverOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // TODO: Implement pulse animation
  // const [shouldPulse, setShouldPulse] = useState(false);

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

      const validatedLikes = LikesSchema.safeParse(likes);
      if (!validatedLikes.success) {
        return;
      }

      setTotalLikeCount(validatedLikes.data.length);
      setUserLikeCount(validatedLikes.data.filter(id => id.toString() === currentSignedInUser._id).length);
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
   * HANDLE DEBOUNCED LIKE CLICK
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

    if (userLikeCount < 30) {
      const currentTime = Date.now();

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
   * ADD LIKE COUNT TO DATABASE
   * @param totalLikeCount The number of likes to add to the database
   * @summary
   * This function is called when the debounce window has ended.
   * It sends a request to the server to add the accumulated like count to the database.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const addLikeCountToDatabase = async (totalLikeCount: number) => {
    const { signal } = new AbortController();

    if (!currentSignedInUser) throw new Error('User not found');

    const userId = currentSignedInUser._id;
    if (!userId) throw new Error('ID not found');

    const body: ActionButtonRequestBody = {
      actionId: LIKE,
      postId,
      userId: userId.toString(),
      totalLikeCount,
    };

    const response = await fetch('/api/post', {
      signal,
      method: 'POST',
      body: JSON.stringify(body),
    }).then(res => res.json());

    if (response) {
      // prettier-ignore
      setPosts(
        posts.map(post => {
          return post._id === postId
            ? { ...post, likes: [...post.likes, ...response.likes] }
            : post;
        })
      );
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
      }, 150);
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
              <Button variant='text' onClick={handleLikeClick} className='relative p-0'>
                {userLikeCount > 0 ? (
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
                  {totalLikeCount}
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
