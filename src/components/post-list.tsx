'use client';

import { Fragment, useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';

import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import Categories from '@/components/categories';
import Post from '@/components/post';

// mock data
const posts = [
  {
    title: 'Whispers of the Shore Whispers of the Shore Whispers of the Shore Whispers of the Shore',
    date: 'Mar 21',
    content: `The sun painted vibrant hues across the evening sky as stars began their nocturnal vigil. Waves gently lapped the shore, whispering tales of distant lands and ancient mariners. Every grain of sand, having journeyed from far and wide, seemed to hold a secret tale, eagerly waiting for the right ear to listen and uncover its age-old mysteries.`,
  },
  {
    title: 'City Chronicles',
    date: 'Oct 01',
    content: `Amidst the bustling city streets, old bookstores stood resiliently, acting as time capsules amidst modernity. Every cobblestone corner and winding alley unveiled a new story, hinting at forgotten romances and bygone eras. Strangers from all walks of life passed by in a hurried dance, each carrying their unique universe of dreams, regrets, whispered promises, and hidden sorrows.`,
  },
  {
    title: 'Guardians of Time',
    date: 'Sep 21',
    content: `Mountains, ancient and majestic, stood tall against the horizon, their peaks confidently kissing the wandering clouds. Birds, like poets of the air, danced gracefully through the valleys below, composing intricate melodies of freedom and joy. The trees, with their gnarled and twisted branches, have seen the passing of countless seasons, standing firm as nature's sentinels, guarding the sacred lore of the land and its many tales.`,
  },
  {
    title: 'Echoes of the Abyss',
    date: 'Dec 05',
    content: `Beneath the vast blue, the ocean depths remain the last great uncharted territory. Mysterious creatures weave through the cold, dark waters, their luminous forms creating a mesmerizing dance of lights. Forgotten shipwrecks, remnants of mankind's adventures, lay scattered on the seabed, a testament to nature's might. Each silent bubble that rises to the surface carries a story, a whisper from the abyss, awaiting discovery.`,
  },
  {
    title: 'Starlit Memories',
    date: 'Jan 09',
    content: `In the vast expanse of the cosmos, stars burn brilliantly, each a beacon of ancient history. Constellations tell tales of mythological heroes and age-old legends, guiding wanderers for generations. Across the inky void, comets streak, leaving trails of cosmic dust, like tears of the universe. Each celestial event serves as a reminder that our fleeting lives are part of a grand, intricate tapestry of existence.`,
  },
  {
    title: "Desert's Lullaby",
    date: 'Jul 17',
    content: `Amidst endless dunes, the desert paints a landscape of solitude and reflection. The relentless sun casts long shadows, creating mirages that dance with the wind. Cacti stand resilient, storing life-giving water, while nocturnal creatures emerge in the cooler hours, revealing a hidden world. The desert, with its stark contrasts and serene beauty, teaches lessons of endurance, resilience, and the delicate balance of life.`,
  },
];

const numberOfPostsToFetch = 5;
const fetchPost = async (page: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return posts.slice((page - 1) * numberOfPostsToFetch, page * numberOfPostsToFetch);
};

const PostList = () => {
  const lastPostRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['posts'],
    async ({ pageParam = 1 }) => await fetchPost(pageParam),
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: {
        pages: [posts.slice(0, numberOfPostsToFetch)],
        pageParams: [1],
      },
    }
  );

  useEffect(() => {
    // if (entry?.isIntersecting) fetchNextPage().then(() => {});
  }, [entry, fetchNextPage]);

  const _posts = data?.pages.flatMap(page => page);

  return (
    <>
      <main className='relative mb-6 mt-12  md:flex md:flex-col md:items-center'>
        <div className='flex w-full max-w-[728px] flex-col gap-5 md:items-center'>
          <Categories />
          {_posts?.map((post, i) => {
            return (
              <Fragment key={post.title}>
                <div ref={i === _posts.length - 1 ? ref : null} key={post.title} className='flex flex-col gap-5'>
                  <Post title={post.title} date={post.date} content={post.content} />
                  <Separator className='md:hidden' />
                </div>

                {i === _posts.length - 1 && i !== posts.length - 1 && (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => {
                      return (
                        <Fragment key={i}>
                          <CardSkeleton key={i} />
                          <Separator className='md:hidden' />
                        </Fragment>
                      );
                    })}
                  </>
                )}
              </Fragment>
            );
          })}

          <span className='mt-3 text-muted'>
            {posts.length !== _posts?.length && isFetchingNextPage ? 'Loading more posts...' : "You're all caught up"}
          </span>
        </div>
      </main>
    </>
  );
};

export default PostList;
