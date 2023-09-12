'use client';

import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Plus } from 'lucide-react';
import Quill from 'quill';
import ReactQuill from 'react-quill';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import 'react-quill/dist/quill.bubble.css';
import 'highlight.js/styles/github.css';

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

const WriteAPost = () => {
  const [postValue, setPostValue] = useAtom(postAtom);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [position, setPosition] = useState(0);
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    const handleClick = () => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const bounds = quill.getBounds(range?.index || 0);
        const height = Math.floor(bounds.height);

        quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
          return delta.compose(new Delta().retain(delta.length(), { background: null, color: null, align: 'left' }));
        });

        // todo: fix highlighting of code blocks
        // quill.on('text-change', function () {
        //   const nodes = document.querySelectorAll('pre.ql-syntax');
        //   nodes.forEach(node => {
        //     hljs.highlightElement(node);
        //   });
        // });

        const [leaf] = quill.getLeaf(range?.index || 0);

        leaf.text ? setIsAddButtonVisible(false) : setIsAddButtonVisible(true);

        if (height === textAreaSize.h1.height) return setPosition(bounds.bottom + textAreaSize.h1.padding);
        if (height === textAreaSize.h2.height) return setPosition(bounds.bottom + textAreaSize.h2.padding);
        if (height === textAreaSize.p.height) return setPosition(bounds.bottom + textAreaSize.p.padding);
      }
    };

    document.addEventListener('mouseup', handleClick);
    document.addEventListener('keyup', handleClick);
    return () => {
      document.removeEventListener('mouseup', handleClick);
      document.removeEventListener('keyup', handleClick);
    };
  }, [position, postValue]);

  return (
    <>
      <div className='flex h-full min-h-screen flex-col items-center bg-secondary'>
        <div className='relative  w-full max-w-[840px] pt-[94px]'>
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

export default WriteAPost;
