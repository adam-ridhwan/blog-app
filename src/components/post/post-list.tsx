/* eslint-disable */
'use client';

import { FC, Fragment, ReactNode, useCallback, useEffect, useRef } from 'react';
import { areAllPostsFetchedAtom, authorsAtom, postsAtom } from '@/providers/hydrate-atoms';
import { AuthorDetails, Post } from '@/types';
import { useIntersection } from '@mantine/hooks';
import { useAtom } from 'jotai';

import CardSkeleton from '@/components/ui/card-skeleton';
import { Separator } from '@/components/ui/separator';
import PostItem from '@/components/post/post-item';

const LIMIT = 5;

type PostListProps = {
  children: ReactNode;
};

const PostList: FC<PostListProps> = ({ children }) => {
  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * LOGIC
   * 1) First 5 posts are fetched from server
   * 2) Render the first 5 posts on initial page load
   * 3) When user scrolls to the bottom of the page, fetch the next 5 posts
   * 4) Render the next 5 posts
   *
   * ────────────────
   * Initially started with useInfiniteQuery, but it was too complicated to implement.
   * Was getting a lot of unexpected behaviour and bugs.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */

  const [posts, setPosts] = useAtom(postsAtom);
  const [authors, setAuthors] = useAtom(authorsAtom);
  const [areAllPostsFetched, setAreAllPostsFetched] = useAtom(areAllPostsFetchedAtom);

  const lastPostRef = useRef<HTMLDivElement>(null);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCHING NEXT POSTS AND AUTHORS
   * 1) Fetch next 5 posts from server
   * 2) Fetch authors of the next 5 posts
   * 3) Set the next 5 posts and authors to the state
   * 4) If there are no more posts to fetch, set areAllPostsFetched to true
   *
   * ────────────────
   * PROBLEM: Initially used server actions directly inside fetchInfinitePosts(), but it was causing a
   * lot of bugs.
   *
   * ISSUE: When using server actions directly, there were problems when navigating to a different page
   * and then coming back to the same page. When last post was in view, the server action stalled and the
   * next posts were not fetched.
   *
   * SOLUTION: Used fetch route handler instead. The route handler calls the server action.
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const fetchInfinitePosts = useCallback(async () => {
    if (areAllPostsFetched) return;

    const { signal } = new AbortController();

    const lastId = posts?.at(-1)?._id?.toString();

    // Fetch next 5 posts from server
    const postsResponse = await fetch(`/api/posts?limit=${LIMIT}&id=${lastId}`, {
      signal,
      method: 'GET',
    });

    const { fetchedPosts }: { fetchedPosts: Post[] } = await postsResponse.json();

    if (!fetchedPosts || fetchedPosts.length === 0) {
      return setAreAllPostsFetched(true);
    }

    // Fetch authors of the fetched 5 posts
    const authorsResponse = await fetch(`/api/authors`, {
      signal,
      method: 'POST',
      body: JSON.stringify({
        authorIds: fetchedPosts.map(post => post.authorId),
      }),
    });

    const { fetchedAuthors }: { fetchedAuthors: AuthorDetails[] } = await authorsResponse.json();

    // Filter out duplicate authors
    const seenAuthors = new Set();
    const uniqueAuthors = [...authors, ...fetchedAuthors].filter(author => {
      if (!seenAuthors.has(author._id)) {
        seenAuthors.add(author._id);
        return true;
      }
      return false;
    });

    // Set the next 5 posts and unique authors to the state
    if (uniqueAuthors.length > 0) setAuthors(uniqueAuthors);
    setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
  }, [posts, authors, areAllPostsFetched]);

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SETTING LAST POST REF TO THE LAST POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCH POSTS IF LAST POST IS INTERSECTING
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (entry?.isIntersecting && !areAllPostsFetched) {
      (async () => await fetchInfinitePosts())();
    }
  }, [areAllPostsFetched, entry]);

  return (
    <>
      <main className='relative mb-6 mt-[100px] md:flex md:flex-col md:items-center'>
        <div className='flex max-w-[728px] flex-col gap-5 md:items-center'>
          {children}

          {posts?.map((post, i) => {
            const lastPost = i === posts?.length - 1;
            const author = authors?.find(author => author._id === post.authorId);
            return (
              <Fragment key={post?._id?.toString()}>
                <div ref={lastPost ? ref : null} className='flex w-full flex-col gap-5'>
                  <PostItem {...{ post, author }} />
                  <Separator className='md:hidden' />
                </div>

                {areAllPostsFetched ||
                  (lastPost && (
                    <>
                      {Array.from({ length: 1 }).map((_, i) => (
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

          {/*<span ref={spanRef} className='mt-3 text-muted'>*/}
          {/*  {true ? 'Loading more posts...' : 'No more posts'}*/}
          {/*</span>*/}
        </div>
      </main>
    </>
  );
};

export default PostList;
