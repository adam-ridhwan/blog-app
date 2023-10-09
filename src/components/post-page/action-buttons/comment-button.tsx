'use client';

import 'react-quill/dist/quill.bubble.css';

import * as React from 'react';
import { FC, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { currentUserAtom, postsAtom } from '@/providers/hydrate-atoms';
import { cn } from '@/util/cn';
import { COMMENT, MD } from '@/util/constants';
import { delay } from '@/util/delay';
import { formatDate } from '@/util/formatDate';
import { useLocalStorage, useViewportSize } from '@mantine/hooks';
import { useAtom, useSetAtom } from 'jotai';
import { Heart, Loader2, MessageSquare, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import sanitizeHtml from 'sanitize-html';
import { useEffectOnce } from 'usehooks-ts';
import { z } from 'zod';

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
};

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike']],
};

const EMPTY_COMMENT = '<p><br></p>';

const CommentButton: FC<CommentButtonProps> = ({ mainPost }) => {
  const pathname = usePathname();
  const [username, postId] = pathname.split('/').slice(1);
  const { data: session } = useSession();
  const { width } = useViewportSize();

  const [isPending, startTransition] = useTransition();

  const [comment, setComment] = useLocalStorage({
    key: `comment|${mainPost._id}`,
    defaultValue: EMPTY_COMMENT,
  });

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [posts, setPosts] = useAtom(postsAtom);
  const [commentsWithUserInfo, setCommentsWithUserInfo] = useState<CommentWithUserInfo[]>([]);

  /*
   * Get the number of comments from the global postsAtom OR commentsWithUserInfo
   * 1st priority: global postsAtom
   * 2nd priority: commentsWithUserInfo
   *
   * If the post is not found in the global postsAtom, then use commentsWithUserInfo
   * 2nd priority is used the user navigates to the post page directly using a link
   */
  const numberOfComments =
    posts.find(post => post._id === mainPost._id)?.comments.length || commentsWithUserInfo.length;

  const setIsSignInDialogOpen = useSetAtom(isSignInDialogOpenAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const quillRef = useRef<ReactQuill | null>(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const expandInput = () => setIsInputExpanded(true);
  const collapseInput = () => setIsInputExpanded(false);

  useEffectOnce(() => {
    (async () => {
      const { comments } = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ username, postId }),
      }).then(res => res.json());
      if (!comments) throw new Error('Comments not found');

      const commentSchema = z.object({
        _id: z.string(),
        createdAt: z.string(),
        comment: z.string(),
        userId: z.string(),
        postId: z.string(),
        likes: z.array(z.string()),
        name: z.string(),
        username: z.string(),
        image: z.string().optional(),
        posts: z.array(z.string()),
        followers: z.array(z.string()),
      });

      const validatedComments = z.array(commentSchema).safeParse(comments);

      if (!validatedComments.success) {
        console.error(validatedComments.error);
        return;
      }

      setCommentsWithUserInfo(validatedComments.data);
    })();
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * OPENING DIALOG
   * @summary
   * If user is not signed in, open sign in dialog
   * Otherwise, open comment dialog
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const handleOpenDialog = () => {
    if (!currentUser) return setIsSignInDialogOpen(true);
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
  const handleCancelComment = () => {
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

      if (!currentUser) throw new Error('User not found');

      const userId = currentUser._id;
      if (!userId) throw new Error('ID not found');

      const body: ActionButtonRequestBody = {
        actionId: COMMENT,
        postId,
        userId: userId.toString(),
        comment: sanitizeHtml(comment),
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

      const { response, newComment } = await fetchedCreateCommentResponse.json();

      if (response) {
        if (!quillRef.current) return;
        const quill = quillRef.current.getEditor();
        quill.blur();
        setComment(EMPTY_COMMENT);
        collapseInput();

        // Need to update the global postsAtom and commentsAtom for client-side rendering
        setPosts(
          posts.map(post => {
            return post._id === postId ? { ...post, comments: [...post.comments, newComment._id] } : post;
          })
        );
        setCommentsWithUserInfo(prev => [newComment, ...prev]);
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
              <AvatarFallback className='text-primary'>{currentUser?.name?.split('')[0]}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium text-primary'>{currentUser?.name}</span>
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
            <Button variant='text' className='text-muted' onClick={handleCancelComment} disabled={isPending}>
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
          {numberOfComments ? (
            <div className='flex flex-col gap-5'>
              {commentsWithUserInfo.map(comment => (
                <div key={comment._id?.toString()} className='flex flex-col gap-3'>
                  <Link href={`${comment.username}`} className='flex flex-row items-center gap-2'>
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback className='text-primary'>{comment.name?.split('')[0]}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col'>
                      <span className='font-bold text-primary'>{comment.name}</span>
                      <div className='flex flex-row items-center gap-2'>
                        <span className='text-muted'>{formatDate(comment.createdAt.toString())}</span>
                      </div>
                    </div>
                  </Link>

                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.comment) }}
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
