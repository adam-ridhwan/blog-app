'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

const WritePostButton = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button variant='outline' className='flex h-[32px] flex-row gap-2' onClick={() => router.push('/write-a-post')}>
        <PenSquare className='h-4 w-4' />
        <span className='whitespace-nowrap'>Write a post</span>
      </Button>
    </>
  );
};

export default WritePostButton;
