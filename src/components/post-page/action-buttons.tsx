import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { LIKE } from '@/util/constants';
import { Bookmark, Heart, MessageSquare, Share } from 'lucide-react';
import { Session } from 'next-auth';

import { Post } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LikeButton from '@/components/post-page/action-buttons/like-button';
import { ActionButtonRequestBody } from '@/app/api/post/route';

type ActionButtonsProps = {
  mainPost: Post;
  session: Session | null;
};

const ActionButtons: FC<ActionButtonsProps> = ({ mainPost }) => {
  return (
    <>
      <div className='mb-5 flex flex-row gap-5'>
        <LikeButton {...{ mainPost }} />

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
