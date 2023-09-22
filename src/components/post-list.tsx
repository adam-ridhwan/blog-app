'use client';

import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { getPosts } from '@/actions/getPosts';
import { AuthorDetails } from '@/actions/getUserById';
import { getUsersById } from '@/actions/getUsersById';
import { type Post } from '@/types';
import { useIntersection } from '@mantine/hooks';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';

import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import Categories from '@/components/categories';
import PostItem from '@/components/post-item';

const LIMIT = 5;

type PostListProps = {
  initialPosts: Post[];
  initialAuthors: AuthorDetails[];
};

const postAtom = atom<Post[]>([]);
const authorsAtom = atom<AuthorDetails[]>([]);

const PostList: FC<PostListProps> = ({ initialPosts, initialAuthors }) => {
  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * LOGIC
   * 1) Get first 5 posts from server first
   * 2) Render the first 5 posts
   * 3) When user scrolls to the bottom of the page, fetch the next 5 posts
   * 4) Render the next 5 posts
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const [posts, setPosts] = useAtom(postAtom);
  const [authors, setAuthors] = useAtom(authorsAtom);
  const [areAllPostsFetched, setAreAllPostsFetched] = useState(false);
  const lastPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!posts.length && !authors.length) {
      setPosts(initialPosts);
      setAuthors(initialAuthors);
    }
  }, [initialPosts, setPosts, posts, setAuthors, initialAuthors, authors.length]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * USE INFINITE QUERY
   * Fetches posts infinitely
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const fetchInfinitePosts = async (data: InfiniteData<Post[]> | undefined) => {
    console.log('fetchInfinitePosts');
    if (areAllPostsFetched) return [];

    const postsFromReactQuery = data?.pages.flatMap(page => page);
    if (!postsFromReactQuery) throw new Error('Failed to fetch posts');

    setPosts(postsFromReactQuery);

    const [fetchedPosts, totalDocuments] = await getPosts(
      LIMIT,
      postsFromReactQuery?.at(-1)?._id?.toString()
    );

    const fetchedAuthors = await getUsersById(fetchedPosts.map(post => post.author));
    if (!fetchedAuthors) throw new Error('Failed to fetch authors');

    const seenAuthors = new Set();
    const uniqueAuthors = [...authors, ...fetchedAuthors].filter(author => {
      if (seenAuthors.has(author._id)) return false;

      seenAuthors.add(author._id);
      return true;
    });

    if (uniqueAuthors.length > 0) setAuthors(uniqueAuthors);

    totalDocuments === postsFromReactQuery.length && setAreAllPostsFetched(true);

    return fetchedPosts;
  };

  useEffect(() => {
    console.log({ posts, authors });
  }, [authors, posts]);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<Post[]>({
    queryKey: ['fetchedPosts'],
    queryFn: async ({ pageParam }): Promise<Post[]> => await fetchInfinitePosts(data),
    getNextPageParam: (_, pages) => pages.length + 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * HANDLE INFINITE SCROLL FETCHING
   * Checks if last post is intersecting with the viewport
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const { ref, entry } = useIntersection({ root: lastPostRef.current, threshold: 1 });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage().then(() => {});
  }, [entry?.isIntersecting, fetchNextPage]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * Posts fetched from useInfiniteQuery
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const postsToRender = data?.pages.flatMap(page => page);

  // console.log({
  //   length: postsToRender?.length,
  //   data: postsToRender?.map(post => post).map(po => po._id),
  //   pageParam: data?.pageParams,
  //   lastPostId: postsToRender?.at(-1)?._id,
  // });

  return (
    <>
      <main className='relative mb-6 md:flex md:flex-col md:items-center'>
        <div className='flex max-w-[728px] flex-col gap-5 md:items-center'>
          <Categories />

          {postsToRender?.map((post, i) => {
            const lastPost = i === postsToRender?.length - 1;
            const author = authors?.find(author => author._id === post.author);
            return (
              <Fragment key={post?.title}>
                <div ref={lastPost ? ref : null} className='flex w-full flex-col gap-5'>
                  <PostItem {...{ post, author }} />
                  <Separator className='md:hidden' />
                </div>

                {areAllPostsFetched ||
                  (lastPost && (
                    <>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Fragment key={i}>
                          <CardSkeleton />
                          <Separator className='md:hidden' />
                        </Fragment>
                      ))}
                    </>
                  ))}
              </Fragment>
            );
          })}

          <span className='mt-3 text-muted'>
            {isFetchingNextPage ? 'Loading more posts...' : 'No more posts'}
          </span>
        </div>
      </main>
    </>
  );
};

export default PostList;
