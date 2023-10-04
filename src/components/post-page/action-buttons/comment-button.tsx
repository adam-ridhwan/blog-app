'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { cn } from '@/util/cn';
import { MD } from '@/util/constants';
import { useLocalStorage, useViewportSize } from '@mantine/hooks';
import DOMPurify from 'isomorphic-dompurify';
import { useSetAtom } from 'jotai';
import { MessageSquare, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Quill from 'quill';
import ReactQuill from 'react-quill';

import { Post, User } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { isSignInDialogOpenAtom } from '@/components/navbar/navbar';

import 'react-quill/dist/quill.bubble.css';

const Delta = Quill.import('delta');

type CommentButtonProps = {
  mainPost: Post;
  currentSignedInUser: User;
};

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike']],
};

const EMPTY_COMMENT = '<p><br></p>';

const CommentButton: FC<CommentButtonProps> = ({ mainPost, currentSignedInUser }) => {
  const { data: session } = useSession();
  const { width } = useViewportSize();

  const [comment, setComment] = useLocalStorage({
    key: `comment|${mainPost._id}`,
    defaultValue: EMPTY_COMMENT,
  });

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
    const cleanComment = DOMPurify.sanitize(comment);
    console.log({ cleanComment });

    // TODO: post comment to database
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
              <span className='hidden gap-1 text-muted/80 transition-colors duration-100 hover:text-primary sm:flex'>
                {mainPost.comments.length}
              </span>
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
          <X className='h-4 w-4 text-muted' />
        </Button>

        <span className='text-2xl font-medium text-primary'>Comments ({mainPost.comments.length})</span>

        <div className={cn(`relative mb-20 rounded-lg p-5 shadow-md`)}>
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
            className={cn(
              `comment-input ease text-primary outline-0 transition-all duration-400`,
              { 'py-[52px]': isInputExpanded }
              // 'border-4 border-emerald-500'
            )}
          />

          <div
            className={cn(
              `pointer-events-none absolute bottom-5 right-5 flex select-none flex-row
              items-center opacity-0 transition-all duration-400`,
              { 'opacity-1 pointer-events-auto select-auto delay-100': isInputExpanded }
            )}
          >
            <Button variant='ghost' className='text-muted' onClick={handleCancelPost}>
              Cancel
            </Button>
            <Button
              variant='accent'
              onClick={handlePostComment}
              className='h-8 text-white'
              disabled={comment === EMPTY_COMMENT}
            >
              Publish
            </Button>
          </div>
        </div>

        <div className='text flex flex-col items-center whitespace-nowrap italic'>
          <span className='text-center text-muted'>There are currently no responses for this post.</span>
          <span className='text-muted'>Be the first to respond.</span>
        </div>
      </div>
    </>
  );
};

export default CommentButton;
