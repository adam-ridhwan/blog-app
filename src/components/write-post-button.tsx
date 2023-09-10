import { PenSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

const WritePostButton = () => {
  return (
    <>
      <Button variant='outline' className='flex h-[32px] flex-row gap-2'>
        <PenSquare className='h-4 w-4' />
        <span className='whitespace-nowrap'>Write a post</span>
      </Button>
    </>
  );
};

export default WritePostButton;
