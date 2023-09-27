import { useRouter } from 'next/navigation';
import { PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Write = () => {
  const router = useRouter();
  return (
    <>
      <Button
        variant='accent'
        className='flex h-[40px] w-[120px] flex-row gap-2'
        onClick={() => router.push('/write-a-main-section')}
      >
        <PenSquare className='h-4 w-4' />
        <span className='whitespace-nowrap'>Write</span>
      </Button>
    </>
  );
};

export default Write;
