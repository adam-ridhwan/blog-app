'use client';

import * as React from 'react';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MoreOptionsButtons = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen} modal={false}>
        <TooltipProvider delayDuration={700}>
          <Tooltip open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger className='flex w-max flex-row items-center gap-1 p-0 text-muted/80 hover:bg-transparent hover:text-primary'>
                <MoreHorizontal className='h-5 w-5' />
              </TooltipTrigger>
            </DropdownMenuTrigger>

            <TooltipContent className='flex items-center justify-center rounded-md bg-primary font-medium text-secondary'>
              <p>More</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align='end' onCloseAutoFocus={e => e.preventDefault()}>
          {/*<DropdownMenuLabel className='ml-[15px]'>More options</DropdownMenuLabel>*/}
          {/*<DropdownMenuSeparator />*/}
          <DropdownMenuItem>
            <Button variant='ghost'>Undo like for this blog post</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MoreOptionsButtons;
