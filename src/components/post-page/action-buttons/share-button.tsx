'use client';

import * as React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import copy from 'copy-to-clipboard';
import { Bookmark, Link, MoreHorizontal, Share } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Overlay from '@/components/ui/overlay';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ShareButton = () => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleCopyLink = () => {
    copy(window.location.href);
    toast('Link copied!');
  };

  return (
    <>
      <Overlay isOpen={isDropdownMenuOpen} />

      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen} modal={false}>
        <TooltipProvider delayDuration={700}>
          <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger className='flex w-max flex-row items-center gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'>
                <Share className='h-5 w-5' />
              </TooltipTrigger>
            </DropdownMenuTrigger>

            <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align='center' onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenuItem>
            <Button
              variant='ghost'
              onClick={handleCopyLink}
              className='flex w-[130px] flex-row items-center gap-3'
            >
              <Link className='h-5 w-5' />
              <span className='whitespace-pre'>Copy link</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ShareButton;
