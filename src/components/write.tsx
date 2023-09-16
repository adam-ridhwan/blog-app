'use client';

import { useEffect, useRef, useState } from 'react';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Quill from 'quill';
import ReactQuill from 'react-quill';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/github.css';

import { MOBILE, useWindowSize } from '@/hooks/useWindowSize';

const Delta = Quill.import('delta');

const textAreaSize = {
  h1: { height: 48, padding: 57 },
  h2: { height: 36, padding: 62 },
  p: { height: 24, padding: 66 },
};

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['code-block'],
  ],
};

const postAtom = atomWithStorage('post', '');

const Write = () => {
  const { data: session, status } = useSession();
  const [postValue, setPostValue] = useAtom(postAtom);
  const windowSize = useWindowSize();

  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [position, setPosition] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => setScrollY(window.scrollY), []);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLES MOUSEUP AND KEYUP EVENTS
   * - Determines where to position the add button
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleClick = () => {
      setScrollY(window.scrollY);

      if (!quillRef.current) return;
      if (windowSize === MOBILE) return;

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const bounds = quill.getBounds(range?.index || 0);
      const height = Math.floor(bounds.height);

      const [leaf] = quill.getLeaf(range?.index || 0);

      leaf.text ? setIsAddButtonVisible(false) : setIsAddButtonVisible(true);

      if (height === textAreaSize.h1.height) return setPosition(bounds.bottom + textAreaSize.h1.padding);
      if (height === textAreaSize.h2.height) return setPosition(bounds.bottom + textAreaSize.h2.padding);
      if (height === textAreaSize.p.height) return setPosition(bounds.bottom + textAreaSize.p.padding);
    };

    document.addEventListener('mouseup', handleClick);
    document.addEventListener('keyup', handleClick);
    return () => {
      document.removeEventListener('mouseup', handleClick);
      document.removeEventListener('keyup', handleClick);
    };
  }, [position, postValue, scrollY, windowSize]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLES PASTE EVENT
   * - Removes formatting from pasted text
   * - Scrolls to the position the user was at before pasting
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handlePaste = () => {
      if (!quillRef.current) return;

      const quill = quillRef.current.getEditor();

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        return delta.compose(new Delta().retain(delta.length(), { background: null, color: null, align: 'left' }));
      });

      // IMPORTANT: this prevents the page from scrolling to the top when pasting
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 1);
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [scrollY]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE SCROLL EVENT
   * - updates the position of scrollRef
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleScroll = () => setScrollY(window.scrollY);
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE ENTER KEY
   * - automatic scroll down when cursor is at the bottom of the viewport
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const NAVBAR_HEIGHT = 64;
  const THRESHOLD = 150;
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (!quillRef.current) return;

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const bounds = quill.getBounds(range?.index || 0);
      const height = Math.floor(bounds.height);
      const bottomOfViewport = window.scrollY + window.innerHeight - NAVBAR_HEIGHT - THRESHOLD;

      if (bounds.bottom > bottomOfViewport) {
        const extraScrollThreshold = bounds.bottom - bottomOfViewport + height;
        window.scrollTo({ top: window.scrollY + extraScrollThreshold, behavior: 'smooth' });
      }
    };
    document.addEventListener('keydown', handleEnterKey);
    return () => document.removeEventListener('keydown', handleEnterKey);
  }, [scrollY]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * LOADING AND REDIRECTING
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (status === 'loading') return null;
  if (!session) redirect('/');

  return (
    <>
      <div className='flex h-full min-h-screen flex-col items-center bg-background pb-[100px]'>
        <div className='relative w-full max-w-[840px] pt-[94px]'>
          <div className='absolute translate-x-[-32px]' style={{ top: `${position}px` }}>
            {isAddButtonVisible && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='icon' className='rounded-full'>
                    <Plus className='text-muted-foreground' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='flex h-[32px] items-center' align='center' side='right'>
                  <div>yo</div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <ReactQuill
            ref={quillRef}
            theme='bubble'
            value={postValue}
            onChange={setPostValue}
            placeholder='Write a new post...'
            modules={modules}
          />
        </div>
      </div>
    </>
  );
};

export default Write;
