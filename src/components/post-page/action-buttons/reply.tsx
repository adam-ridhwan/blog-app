'use client';

import * as React from 'react';
import { FC, useEffect, useRef, useState, useTransition } from 'react';
import { cn } from '@/util/cn';
import ReactQuill from 'react-quill';

import { Button } from '@/components/ui/button';

import 'react-quill/dist/quill.bubble.css';

import { usePathname } from 'next/navigation';
import { currentUserAtom } from '@/providers/hydrate-atoms';
import { GET_REPLIES, REPLY_COMMENT } from '@/util/constants';
import { delay } from '@/util/delay';
import { useLocalStorage } from '@mantine/hooks';
import { useAtomValue } from 'jotai';
import { Heart } from 'lucide-react';
import Quill from 'quill';
import sanitizeHtml from 'sanitize-html';
import { useEffectOnce } from 'usehooks-ts';

import { CommentWithUserInfo, CommentWithUserInfoDTO } from '@/types/types';
import { PostRepliesRequestBody } from '@/app/api/replies/route';

const Delta = Quill.import('delta');
const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike']],
};

type ReplyProps = {
  comment: CommentWithUserInfoDTO;
};

const EMPTY_COMMENT = '<p><br></p>';

const Reply: FC<ReplyProps> = ({ comment }) => {
  const pathname = usePathname();
  const [_, postId] = pathname.split('/').slice(1);
  const [isPending, startTransition] = useTransition();

  const currentUser = useAtomValue(currentUserAtom);

  const [isReplayBoxOpen, setIsReplayBoxOpen] = useState(false);

  const quillRef = useRef<ReactQuill | null>(null);

  const [commentLocalStorage, setCommentLocalStorage, removeCommentLocalStorage] = useLocalStorage({
    key: `comment|${comment._id}-reply`,
    defaultValue: EMPTY_COMMENT,
  });

  const handlePostReply = () => {
    startTransition(async () => {
      const { signal } = new AbortController();

      if (!currentUser) throw new Error('User not found');
      if (!comment || !comment._id) throw new Error('Comment not found');

      const userId = currentUser._id;
      if (!userId) throw new Error('ID not found');

      const body = {
        actionId: REPLY_COMMENT,
        commentId: comment._id.toString(),
        userId: userId.toString(),
        reply: sanitizeHtml(commentLocalStorage),
      };

      const pendingCreateCommentResponse = fetch('/api/replies', {
        signal,
        method: 'POST',
        body: JSON.stringify(body),
      });

      const [_, fetchedCreateCommentResponse] = await Promise.all([delay(0), pendingCreateCommentResponse]);

      const { response, newReply } = await fetchedCreateCommentResponse.json();

      if (response) {
        if (!quillRef.current) return;
        const quill = quillRef.current.getEditor();
        quill.blur();
        setCommentLocalStorage(EMPTY_COMMENT);
        setIsReplayBoxOpen(false);

        // Need to update the global postsAtom and commentsAtom for client-side rendering
        // setPosts(
        //   posts.map(post => {
        //     return post._id === postId ? { ...post, comments: [...post.comments, newComment._id] } : post;
        //   })
        // );
        // setCommentsWithUserInfo(prev => [newComment, ...prev]);

        removeCommentLocalStorage();
      }
    });
  };

  const handleCancelReply = () => {
    setIsReplayBoxOpen(false);
    removeCommentLocalStorage();
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
      <div className='flex flex-row items-center justify-between'>
        <Button variant='text' className='flex flex-row items-center gap-2 p-0'>
          {comment.likes.length !== 0 ? (
            <Heart className='h-5 w-5 fill-primary/80 stroke-none stroke-2 opacity-60 transition-opacity duration-100 hover:opacity-100' />
          ) : (
            <Heart className='h-5 w-5 fill-none stroke-muted/80 stroke-2 transition-colors duration-100 hover:stroke-primary' />
          )}
          <span>{comment.likes.length}</span>
        </Button>

        <Button variant='text' onClick={() => setIsReplayBoxOpen(prev => !prev)}>
          Reply
        </Button>
      </div>

      <div className='ml-2 border-l-4 border-l-muted/10'>
        <div
          className={cn('ml-6 flex-col rounded-lg p-5 pb-4 shadow-md', {
            hidden: !isReplayBoxOpen,
            flex: isReplayBoxOpen,
          })}
        >
          <ReactQuill
            ref={quillRef}
            theme='bubble'
            value={commentLocalStorage}
            onChange={setCommentLocalStorage}
            placeholder={`Reply to ${comment.name}...`}
            modules={modules}
            className={cn(
              `comment-input ease min-h-[100px] text-primary outline-0 transition-all duration-400`
            )}
          />

          <div className={cn(`ml-auto flex flex-row items-center transition-all duration-400`)}>
            <Button
              variant='text'
              className='text-muted'
              onClick={handleCancelReply}
              // disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant='accent'
              onClick={handlePostReply}
              className='h-8 w-[80px] text-white'
              disabled={commentLocalStorage === EMPTY_COMMENT || isPending}
            >
              {/*{isPending ? <LoadingSpinner /> : 'Publish'}*/}
              Publish
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reply;
