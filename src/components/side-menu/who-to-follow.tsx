import * as React from 'react';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { UserPlus } from 'lucide-react';

import { AuthorDetails } from '@/types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WhoToFollowProps = {
  trendingAuthors: AuthorDetails[];
};

const WhoToFollow: FC<WhoToFollowProps> = ({ trendingAuthors }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Who to follow</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {trendingAuthors.map(author => (
            <div key={author?._id?.toString()} className='flex flex-row justify-between'>
              <Link href={`${author.username}`} className='flex flex-row items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  {author.image ? (
                    <Image src={author.image} alt='' />
                  ) : (
                    <AvatarFallback>{author.name?.split('')[0]}</AvatarFallback>
                  )}
                </Avatar>
                <span className='font-medium text-primary'>{author.name}</span>
              </Link>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' className='rounded-full text-muted'>
                      <UserPlus className='h-5 w-5' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className={cn(
                      `flex items-center justify-center rounded-md bg-primary font-medium text-secondary`
                    )}
                  >
                    <p>Follow</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default WhoToFollow;
