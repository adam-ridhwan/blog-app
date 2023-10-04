'use client';

import * as React from 'react';
import { useState } from 'react';
import { Bookmark, Share } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ShareButton = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={700}>
        <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='flex w-max flex-row gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'
            >
              <Share className='h-5 w-5' />
              <span className='hidden sm:flex'>Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
            <p>Share</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ShareButton;
