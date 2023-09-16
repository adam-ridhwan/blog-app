'use client';

import { FC, Fragment, useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { postsAtom } from '@/hooks/hydrator';
import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import Categories from '@/components/categories';
import Post from '@/components/post';

const NUMBER_OF_POSTS_TO_FETCH = 5;

const PostList: FC = () => {
  const convertedPosts = useAtomValue(postsAtom);

  const lastPostRef = useRef<HTMLDivElement>(null);

  const fetchPost = async (page: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return convertedPosts.slice((page - 1) * NUMBER_OF_POSTS_TO_FETCH, page * NUMBER_OF_POSTS_TO_FETCH);
  };

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['fetchedPosts'],
    async ({ pageParam = 1 }) => await fetchPost(pageParam),
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: {
        pages: [convertedPosts.slice(0, NUMBER_OF_POSTS_TO_FETCH)],
        pageParams: [1],
      },
    }
  );

  useEffect(() => {
    entry?.isIntersecting && fetchNextPage();
  }, [entry, fetchNextPage]);

  const _fetchedPosts = data?.pages.flatMap(page => page);

  return (
    <>
      <main className='relative mb-6 mt-12  md:flex md:flex-col md:items-center'>
        <div className='flex w-full max-w-[728px] flex-col gap-5 md:items-center'>
          <Categories />

          {_fetchedPosts?.map((post, i) => {
            return (
              <Fragment key={post.title}>
                <div ref={i === _fetchedPosts.length - 1 ? ref : null} key={post.title} className='flex flex-col gap-5'>
                  <Post {...{ post }} />
                  <Separator className='md:hidden' />
                </div>

                {i === _fetchedPosts.length - 1 && i !== convertedPosts.length - 1 && (
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
            {convertedPosts.length !== _fetchedPosts?.length && isFetchingNextPage
              ? 'Loading more posts...'
              : "You're all caught up"}
          </span>
        </div>
      </main>
    </>
  );
};

export default PostList;
