'use client';

import { FC, Fragment, ReactNode, useCallback, useEffect, useRef } from 'react';
import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import { areAllPostsFetchedAtom, authorsAtom, postAtom } from '@/provider/hydrate-atoms';
import { useIntersection } from '@mantine/hooks';
import { useAtom } from 'jotai';

import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import PostItem from '@/components/post-item';

const LIMIT = 5;

type PostListProps = {
  children: ReactNode;
};

const PostList: FC<PostListProps> = ({ children }) => {
  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * LOGIC
   * 1) Get first 5 posts from server first
   * 2) Render the first 5 posts
   * 3) When user scrolls to the bottom of the page, fetch the next 5 posts
   * 4) Render the next 5 posts
   *
   * ────────────────
   * Initially started with useInfiniteQuery, but it was too complicated to implement.
   * Was getting a lot of unexpected behaviour and bugs.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */

  const [posts, setPosts] = useAtom(postAtom);
  const [authors, setAuthors] = useAtom(authorsAtom);
  const [areAllPostsFetched, setAreAllPostsFetched] = useAtom(areAllPostsFetchedAtom);
  const lastPostRef = useRef<HTMLDivElement>(null);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SETTING LAST POST REF TO THE LAST POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const { ref: lastPostIntersectionRef, entry: lastPostIntersectionEntry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCHING NEXT POSTS AND AUTHORS
   * 1) Fetch next 5 posts from server
   * 2) Fetch authors of the next 5 posts
   * 3) Set the next 5 posts and authors to the state
   * 4) If there are no more posts to fetch, set areAllPostsFetched to true
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const fetchNextPosts = useCallback(async () => {
    // Fetch next 5 posts based on the last post id
    const [fetchedPosts, totalDocuments] = await getPosts(LIMIT, posts?.at(-1)?._id?.toString());
    if (!fetchedPosts || fetchedPosts.length === 0) {
      return setAreAllPostsFetched(true);
    }

    // Fetch the authors of the next 5 posts
    const fetchedAuthors = await getUsersById(fetchedPosts.map(post => post.author));
    if (!fetchedAuthors) throw new Error('Failed to fetch authors');

    // Filter out duplicate authors
    const seenAuthors = new Set();
    const uniqueAuthors = [...authors, ...fetchedAuthors].filter(author => {
      if (seenAuthors.has(author._id)) return false;

      seenAuthors.add(author._id);
      return true;
    });

    // Set the next 5 posts and unique authors to the state
    if (uniqueAuthors.length > 0) setAuthors(uniqueAuthors);
    setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
  }, [posts, authors, setAuthors, setPosts, setAreAllPostsFetched]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCH POSTS IF LAST POSTS IS INTERSECTING
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (lastPostIntersectionEntry?.isIntersecting && !areAllPostsFetched) {
      (async () => await fetchNextPosts())();
    }
  }, [fetchNextPosts, lastPostIntersectionEntry, areAllPostsFetched]);

  useEffect(() => {
    // console.log(posts);
    console.log(lastPostIntersectionEntry?.isIntersecting);
  }, [lastPostIntersectionEntry?.isIntersecting, posts]);

  return (
    <>
      <main className='relative mb-6 md:flex md:flex-col md:items-center'>
        <div className='flex max-w-[728px] flex-col gap-5 md:items-center'>
          {children}

          {posts?.map((post, i) => {
            const lastPost = i === posts?.length - 1;
            const author = authors?.find(author => author._id === post.author);
            if (lastPost) console.log(author?.name);
            return (
              <Fragment key={post?.title}>
                <div ref={lastPost ? lastPostIntersectionRef : null} className='flex w-full flex-col gap-5'>
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

          {/*<span className='mt-3 text-muted'>*/}
          {/*  {isFetchingNextPage ? 'Loading more posts...' : 'No more posts'}*/}
          {/*</span>*/}
        </div>
      </main>
    </>
  );
};

export default PostList;
