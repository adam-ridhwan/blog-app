import { getUsersById } from '@/actions/getUsersById';
import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';

import { AuthorDetails, Post } from '@/types/types';
import PostList from '@/components/main-section/post-list';
import BuiltWith from '@/components/side-menu/built-with';
import Draft from '@/components/side-menu/draft';
import EditorPosts from '@/components/side-menu/editor-posts';
import SavedPosts from '@/components/side-menu/saved-posts';
import SideMenu from '@/components/side-menu/side-menu';
import TrendingPosts from '@/components/side-menu/trending-posts';
import WhoToFollow from '@/components/side-menu/who-to-follow';

export default async function Home() {
  const { postCollection } = await connectToDatabase();

  const trendingPosts = await postCollection
    .find({ views: { $gt: 500 } })
    .sort({ views: -1 })
    .limit(6)
    .toArray();

  const authorIds = trendingPosts.map(post => post.authorId);
  const trendingAuthors = await getUsersById(authorIds);

  const trendingPostsAndAuthors = trendingPosts.map(post => {
    const author = trendingAuthors.find(author => author._id === post.authorId.toString());
    return {
      ...post,
      name: author?.name,
      username: author?.username,
      image: author?.image,
    };
  });

  return (
    <div className='container flex flex-col px-5 xl:flex-row xl:justify-center'>
      <PostList />
      <SideMenu>
        <>
          <TrendingPosts trendingPostsAndAuthors={plainify(trendingPostsAndAuthors)} />
          <Draft />
          <WhoToFollow trendingAuthors={plainify(trendingAuthors)} />
          {/*<EditorPosts />*/}
          <SavedPosts savedPosts={plainify(trendingPostsAndAuthors)} />
          <BuiltWith />
        </>
      </SideMenu>
    </div>
  );
}
