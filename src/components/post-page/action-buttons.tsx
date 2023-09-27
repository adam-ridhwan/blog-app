import * as React from 'react';
import { Bookmark, Heart, MessageSquare, Share } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ActionButtons = () => {
  return (
    <>
      <div className='mb-5 flex flex-row gap-5'>
        <Button
          variant='ghost'
          className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
        >
          <Heart className='h-5 w-5 ' />
          Like
        </Button>
        <Button
          variant='ghost'
          className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
        >
          <MessageSquare className='h-5 w-5' />
          Comment
        </Button>
        <Button
          variant='ghost'
          className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
        >
          <Bookmark className='h-5 w-5' />
          Save
        </Button>
        <Button
          variant='ghost'
          className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
        >
          <Share className='h-5 w-5' />
          Share
        </Button>
      </div>
    </>
  );
};

export default ActionButtons;
