'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

const WriteOrPublishButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {pathname === '/write-a-post' ? (
        <Button variant='accent' className='flex h-[32px] flex-row gap-2 bg-[#147412] text-white hover:bg-[#0d600c]'>
          <span className='whitespace-nowrap'>Publish</span>
        </Button>
      ) : (
        <Button variant='outline' className='flex h-[32px] flex-row gap-2' onClick={() => router.push('/write-a-post')}>
          <PenSquare className='h-4 w-4' />
          <span className='whitespace-nowrap'>Write</span>
        </Button>
      )}
    </>
  );
};

export default WriteOrPublishButton;
