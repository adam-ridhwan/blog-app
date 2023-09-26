import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';

const TrendingPosts = () => {
  const mostPopularPosts = [
    {
      author: 'John Doe',
      category: 'Fashion',
      color: 'bg-darkBlue',
      title: 'Whispers of the Shore',
      date: 'Mar 21',
      content: `The sun painted vibrant hues across the evening sky as stars began their nocturnal vigil. Waves gently lapped the shore, whispering tales of distant lands and ancient mariners. Every grain of sand, having journeyed from far and wide, seemed to hold a secret tale, eagerly waiting for the right ear to listen and uncover its age-old mysteries.`,
    },
    {
      author: 'Steve Rogers',
      category: 'Coding',
      color: 'bg-darkRed',
      title: 'City Chronicles',
      date: 'Oct 01',
      content: `Amidst the bustling city streets, old bookstores stood resiliently, acting as time capsules amidst modernity. Every cobblestone corner and winding alley unveiled a new story, hinting at forgotten romances and bygone eras. Strangers from all walks of life passed by in a hurried dance, each carrying their unique universe of dreams, regrets, whispered promises, and hidden sorrows.`,
    },
    {
      author: 'Ragnar Lothbrok',
      category: 'Business',
      color: 'bg-darkGreen',
      title: 'Guardians of Time',
      date: 'Sep 21',
      content: `Mountains, ancient and majestic, stood tall against the horizon, their peaks confidently kissing the wandering clouds. Birds, like poets of the air, danced gracefully through the valleys below, composing intricate melodies of freedom and joy. The trees, with their gnarled and twisted branches, have seen the passing of countless seasons, standing firm as nature's sentinels, guarding the sacred lore of the land and its many tales.`,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className=''>Trending posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3 md:grid md:grid-cols-2 lg:flex lg:flex-col'>
            {mostPopularPosts.map(post => {
              return (
                <Link key={post.title} href='/' className='flex items-center'>
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-2'>
                      <Avatar className='h-5 w-5'>
                        {/*{image ? <Image src={image} alt='' /> : <AvatarFallback>{name?.split('')[0]}</AvatarFallback>}*/}
                        {<AvatarFallback className='text-[12px]'>{post.author?.split('')[0]}</AvatarFallback>}
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <h3 className='text-muted-foreground font-semibold'>Whispers of the Shore</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>

        <CardFooter>
          <Link
            href='/'
            className={cn(
              `flex h-[40px] w-full items-center justify-center rounded-full border border-border 
                  bg-background text-muted underline-offset-4 hover:underline`
            )}
          >
            See more
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default TrendingPosts;
