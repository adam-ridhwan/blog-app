import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

import PostList from '@/components/post-list';
import SideMenu from '@/components/side-menu';

const generatePost = (index: number): Post => {
  const title = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`;
  const postSlug = `mock-post-${index}`;
  const category = new ObjectId('6505ecac822e8ec0e9b8a1be');
  const author = new ObjectId('650b3f0649c072e2777bfcd5');

  return {
    createdAt: new Date(),
    postSlug,
    title,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At elementum eu facilisis sed odio morbi quis. Vitae suscipit tellus mauris a diam maecenas sed enim. Egestas sed tempus urna et pharetra. Phasellus faucibus scelerisque eleifend donec pretium vulputate.`,
    views: Math.floor(Math.random() * 2000),
    categorySlug: 'mock-category',
    category,
    author,
    comments: [],
    likes: Math.floor(Math.random() * 100),
  };
};

export default async function Home() {
  const { postCollection } = await connectToDatabase();
  const mockPosts = Array.from({ length: 1 }, (_, index) => generatePost(index + 1));
  // await postCollection.deleteMany({});
  // await postCollection.insertMany(mockPosts);

  const initialPosts = await getPosts(5, 0, undefined);
  if (!initialPosts) throw new Error('Failed to fetch initial posts');

  const authorIds = initialPosts.map(post => post.author);
  const initialAuthors = await getUsersById(authorIds);
  if (!initialAuthors) throw new Error('Failed to fetch initial authors');

  if (!initialPosts && !initialAuthors) return <div>Please refresh page</div>;

  return (
    <div className='container flex flex-col px-5 xl:flex-row xl:justify-center'>
      <PostList {...{ initialPosts, initialAuthors }} />
      <SideMenu />
    </div>
  );
}
