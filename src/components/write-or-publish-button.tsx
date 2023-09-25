'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createPost } from '@/actions/createPost';
import { Post } from '@/types';
import { useAtom } from 'jotai';
import { PenSquare, Rocket } from 'lucide-react';
import { ObjectId } from 'mongodb';
import { useSession } from 'next-auth/react';
import { undefined } from 'zod';

import { Button } from '@/components/ui/button';
import { postAtom } from '@/components/write';

const WriteOrPublishButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useAtom(postAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePublish = async () => {
    const { signal } = new AbortController();

    const response = await fetch(`/api/posts`, {
      signal,
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  };

  return (
    <>
      {pathname === '/write-a-post' ? (
        <Button
          variant='confirmative'
          className='flex h-[40px] w-[120px] flex-row gap-2'
          onClick={handlePublish}
        >
          <Rocket className='h-4 w-4' />
          <span className='whitespace-nowrap'>Publish</span>
        </Button>
      ) : (
        <Button
          variant='accent'
          className='flex h-[40px] w-[120px] flex-row gap-2'
          onClick={() => router.push('/write-a-post')}
        >
          <PenSquare className='h-4 w-4' />
          <span className='whitespace-nowrap'>Write</span>
        </Button>
      )}
    </>
  );
};

export default WriteOrPublishButton;
