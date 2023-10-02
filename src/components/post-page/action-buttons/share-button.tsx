import * as React from 'react';
import { Share } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ShareButton = () => {
  return (
    <>
      <Button
        variant='ghost'
        className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
      >
        <Share className='h-5 w-5' />
        <span className='hidden sm:flex'>Share</span>
      </Button>
    </>
  );
};

export default ShareButton;
