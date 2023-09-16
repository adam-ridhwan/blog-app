import { Category, CategoryWithStrings, Post, PostWithStrings } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

import Hydrator from '@/hooks/hydrator';
import PostList from '@/components/post-list';
import { SideMenuPlaceholder } from '@/components/side-menu';

export default async function Home() {
  const { postCollection, categoryCollection } = await connectToDatabase();
  const posts = await postCollection.find().toArray();
  const categories = await categoryCollection.find().toArray();

  const convertPostToObjectWithStrings = (post: Post): PostWithStrings => {
    return {
      ...post,
      _id: post._id.toString(),
      category: post.category.toString(),
      author: post.author.toString(),
      comments: post.comments.map((comment: ObjectId) => comment.toString()),
    };
  };

  const convertedPosts = posts.map(convertPostToObjectWithStrings);

  const convertCategoriesToObjectWithStrings = (category: Category): CategoryWithStrings => {
    return {
      ...category,
      _id: category._id.toString(),
    };
  };

  const convertedCategories = categories.map(convertCategoriesToObjectWithStrings);

  return (
    <div className='container flex flex-col p-5 xl:flex-row xl:justify-center'>
      <Hydrator {...{ convertedPosts, convertedCategories }} />
      <PostList />
      <SideMenuPlaceholder />
    </div>
  );
}
