'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PublishDialog from '@/components/publish-dialog';

const WriteOrPublishButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {pathname === '/write-a-post' ? (
        <PublishDialog />
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
