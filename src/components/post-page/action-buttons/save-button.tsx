import * as React from 'react';
import { Book, Bookmark, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';

const SaveButton = () => {
  return (
    <>
      <Button
        variant='ghost'
        className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
      >
        <Bookmark className='h-5 w-5' />
        <span className='hidden sm:flex'>Save</span>
      </Button>
    </>
  );
};

export default SaveButton;
