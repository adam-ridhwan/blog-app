import Link from 'next/link';
import { cn } from '@/util/cn';
import { Dot } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import SeparatorDot from '@/components/ui/separator-dot';

const MostPopularPosts = () => {
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
      <div className='mt-6 flex flex-col gap-[35px] md:grid md:grid-cols-2 lg:flex lg:flex-col'>
        {mostPopularPosts.map(post => {
          return (
            <Link key={post.title} href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <div className='flex items-center gap-[5px]'>
                  <Badge variant='outline' className={cn('mr-[5px] w-max', `${post.color}`)}>
                    Fashion
                  </Badge>
                  <span>{post.author}</span>
                  <SeparatorDot />
                  <span>{post.date}</span>
                </div>
                <h3 className='font-semibold text-muted-foreground'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default MostPopularPosts;
