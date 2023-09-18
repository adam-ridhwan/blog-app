import { getCategories } from '@/actions/getCategories';
import { getPosts } from '@/actions/getPosts';
import { Category, Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

import Hydrator from '@/hooks/hydrator';
import PostList from '@/components/post-list';
import { SideMenuPlaceholder } from '@/components/side-menu';

const generatePost = (index: number): Post => {
  const title = `Mock Post ${index}`;
  const postSlug = `mock-post-${index}`;
  const category = new ObjectId('6505ecac822e8ec0e9b8a1be'); // You can change this if needed
  const author = new ObjectId('6503dc4a3d166bffdaeacc0c'); // You can change this if needed

  return {
    createdAt: new Date(),
    postSlug,
    title,
    content: `This is the content for the ${title}. It aims to provide readers with insights on topic ${index}. More in-depth content will be shared soon. Stay tuned for updates.`,
    views: Math.floor(Math.random() * 2000), // Generating views between 0 and 2000
    categorySlug: 'mock-category',
    category,
    author,
    comments: [], // Empty array for this mock
    likes: Math.floor(Math.random() * 100), // Generating likes between 0 and 100
  };
};

export default async function Home() {
  const [posts, categories]: [Post[], Category[]] = await Promise.all([getPosts(), getCategories()]);

  const { postCollection } = await connectToDatabase();
  const mockPosts = Array.from({ length: 30 }, (_, index) => generatePost(index + 1));
  // await postCollection.insertMany(mockPosts);

  return (
    <div className='container flex flex-col p-5 xl:flex-row xl:justify-center'>
      <Hydrator {...{ posts, categories }} />
      <PostList />
      <SideMenuPlaceholder />
    </div>
  );
}
