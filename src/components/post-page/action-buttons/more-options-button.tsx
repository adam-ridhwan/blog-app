import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MoreOptionsButtons = () => {
  return (
    <>
      <Button
        variant='ghost'
        className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
      >
        <MoreHorizontal className='h-5 w-5' />
      </Button>
    </>
  );
};

export default MoreOptionsButtons;
