'use client';

import 'react-quill/dist/quill.bubble.css';

import * as React from 'react';
import { FC, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { commentsAtom, postsAtom } from '@/providers/hydrate-atoms';
import { cn } from '@/util/cn';
import { COMMENT, MD } from '@/util/constants';
import { delay } from '@/util/delay';
import { formatDate } from '@/util/formatDate';
import { useLocalStorage, useViewportSize } from '@mantine/hooks';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { Heart, Loader2, MessageSquare, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import sanitizeHtml from 'sanitize-html';

import { CommentWithUserInfo, Post, User } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';
import { ActionButtonRequestBody } from '@/app/api/post/route';

const Delta = Quill.import('delta');

type CommentButtonProps = {
  mainPost: Post;
  currentSignedInUser: User;
  fetchedCommentsWithUserInfo: CommentWithUserInfo[];
};

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike']],
};

const EMPTY_COMMENT = '<p><br></p>';

const postAtom = atom<Post | null>(null);

const CommentButton: FC<CommentButtonProps> = ({
  mainPost,
  currentSignedInUser,
  fetchedCommentsWithUserInfo,
}) => {
  const { data: session } = useSession();
  const { width } = useViewportSize();
  const [isPending, startTransition] = useTransition();

  const [comment, setComment] = useLocalStorage({
    key: `comment|${mainPost._id}`,
    defaultValue: EMPTY_COMMENT,
  });

  useHydrateAtoms(
    [
      [commentsAtom, fetchedCommentsWithUserInfo],
      [postAtom, mainPost],
    ],
    { dangerouslyForceHydrate: true }
  );

  const [posts, setPosts] = useAtom(postsAtom);
  const [comments, setComments] = useAtom(commentsAtom);
  const numberOfComments = comments.length;

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const quillRef = useRef<ReactQuill | null>(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const expandInput = () => setIsInputExpanded(true);
  const collapseInput = () => setIsInputExpanded(false);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * OPENING DIALOG
   * @summary
   * If user is not signed in, open sign in dialog
   * Otherwise, open comment dialog
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleOpenDialog = () => {
    if (!session || !session?.user?.email) return setIsSignInDialogOpen(true);
    if (comment !== EMPTY_COMMENT) expandInput();
    openDialog();
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * CLICKING OVERLAY
   * @summary
   * If comment is empty, collapse input
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleCloseDialog = () => {
    if (comment === EMPTY_COMMENT) collapseInput();
    closeDialog();
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * CANCEL POSTING COMMENT
   * @summary
   * Blurs quill editor, collapses input, and resets comment
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleCancelPost = () => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    quill.blur();
    collapseInput();
    setComment(EMPTY_COMMENT);
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * POSTING COMMENT
   * @summary
   * Sanitizes comment and posts to database
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handlePostComment = () => {
    startTransition(async () => {
      const { signal } = new AbortController();
      if (!mainPost) throw new Error('Post not found');
      if (!currentSignedInUser) throw new Error('User not found');

      const postId = mainPost._id;
      const userId = currentSignedInUser._id;

      if (!postId || !userId) throw new Error('ID not found');

      const cleanComment = sanitizeHtml(comment);

      const body: ActionButtonRequestBody = {
        actionId: COMMENT,
        postId: postId.toString(),
        userId: userId.toString(),
        comment: cleanComment,
      };

      const pendingCreateCommentResponse = fetch('/api/post', {
        signal,
        method: 'POST',
        body: JSON.stringify(body),
      });

      const [_, fetchedCreateCommentResponse] = await Promise.all([
        delay(2000),
        pendingCreateCommentResponse,
      ]);

      const { insertCommentResponse, newCommentWithUserInfo } = await fetchedCreateCommentResponse.json();

      if (insertCommentResponse) {
        if (!quillRef.current) return;
        const quill = quillRef.current.getEditor();
        quill.blur();
        setComment(EMPTY_COMMENT);
        collapseInput();

        // Need to update the global postsAtom and commentsAtom for client-side rendering
        setPosts(
          posts.map(post => {
            return post._id === postId
              ? { ...post, comments: [...post.comments, insertCommentResponse] }
              : post;
          })
        );
        setComments(prev => [newCommentWithUserInfo, ...prev]);
      }
    });
  };

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * COPY AND PASTE EVENT ON QUILL
   * @summary
   * Removes formatting when pasting
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handlePaste = () => {
      if (!quillRef.current) return;

      const quill = quillRef.current.getEditor();

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        if (node.tagName === 'PRE') {
          return new Delta().insert(node.textContent);
        } else if (node.tagName === 'SPAN') {
          return new Delta().insert(node.textContent);
        }
        return delta.compose(
          new Delta().retain(delta.length(), { background: null, color: null, align: 'left', size: null })
        );
      });
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <>
      <TooltipProvider delayDuration={700}>
        <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              onClick={handleOpenDialog}
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <MessageSquare className='h-5 w-5' />
              <span className='min-w-[20px] text-left'>{numberOfComments}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
            <p>Comment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        onClick={handleCloseDialog}
        className={cn(`pointer-events-none fixed inset-0 z-50 bg-black/10 opacity-0 transition`, {
          'opacity-1 pointer-events-auto cursor-pointer duration-500': isDialogOpen,
        })}
      />

      <div
        className={cn(
          `fixed right-0 top-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full translate-y-[100dvh] 
          flex-col gap-4 overflow-y-auto overflow-x-hidden bg-background p-6 opacity-0 
          shadow-lg transition-transform duration-500 ease-in-out
          md:max-w-[450px] md:translate-x-[450px] md:translate-y-0`,
          { 'opacity-1': isDialogOpen },
          { 'translate-y-0': isDialogOpen && width < MD },
          { 'md:translate-x-0': isDialogOpen && width > MD }
          // 'border-4 border-fuchsia-600'
        )}
      >
        <Button variant='ghost' size='icon' className='ml-auto' onClick={handleCloseDialog}>
          <X className='h-5 w-5 text-muted' />
        </Button>

        <span className='text-2xl font-medium text-primary'>Comments ({numberOfComments})</span>

        <div className={cn(`relative mb-10 rounded-lg p-5 shadow-md`)}>
          <div
            className={cn(
              `pointer-events-none absolute flex translate-y-[-21px] select-none flex-row items-center 
              gap-2 opacity-0 transition-all duration-400`,
              { 'pointer-auto opacity-1 translate-y-0 select-text': isInputExpanded }
            )}
          >
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='text-primary'>
                {currentSignedInUser?.name?.split('')[0]}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium text-primary'>{currentSignedInUser?.name}</span>
            </div>
          </div>

          <ReactQuill
            ref={quillRef}
            onFocus={expandInput}
            theme='bubble'
            value={comment}
            onChange={setComment}
            placeholder={'Post comment...'}
            modules={modules}
            className={cn(`comment-input ease text-primary outline-0 transition-all duration-400`, {
              'py-[52px]': isInputExpanded,
            })}
          />

          <div
            className={cn(
              `pointer-events-none absolute bottom-5 right-5 flex select-none flex-row
              items-center opacity-0 transition-all duration-400`,
              { 'opacity-1 pointer-events-auto select-auto delay-100': isInputExpanded }
            )}
          >
            <Button variant='text' className='text-muted' onClick={handleCancelPost} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant='accent'
              onClick={handlePostComment}
              className='h-8 w-[80px] text-white'
              disabled={comment === EMPTY_COMMENT || isPending}
            >
              {isPending ? <Loader2 className='h-5 w-5 animate-spin' /> : 'Publish'}
            </Button>
          </div>
        </div>

        <Separator />

        <div className='my-5 '>
          {comments.length > 0 ? (
            <div className='flex flex-col gap-5'>
              {comments.map(comment => (
                <div key={comment._id?.toString()} className='flex flex-col gap-3'>
                  <Link href={`${comment.username}`} className='flex flex-row items-center gap-2'>
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback className='text-primary'>{comment.name?.split('')[0]}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col'>
                      <span className='font-bold text-primary'>{comment.name}</span>
                      <div className='flex flex-row items-center gap-2'>
                        <span className='text-muted '>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </Link>

                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.response) }}
                    className={cn(`text-primary`)}
                  />

                  <div className='flex flex-row items-center justify-between'>
                    <Button variant='text' className='flex flex-row items-center gap-2 p-0'>
                      {comment.likes.length !== 0 ? (
                        <Heart className='h-5 w-5 fill-primary/80 stroke-none stroke-2 opacity-60 transition-opacity duration-100 hover:opacity-100' />
                      ) : (
                        <Heart className='h-5 w-5 fill-none stroke-muted/80 stroke-2 transition-colors duration-100 hover:stroke-primary' />
                      )}
                      <span>{comment.likes.length}</span>
                    </Button>

                    <Button variant='text'>Reply</Button>
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
      </div>
    </>
  );
};

export default CommentButton;
