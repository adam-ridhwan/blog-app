'use server';

import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const getPosts = async (): Promise<Post[]> => {
  try {
    const { postCollection } = await connectToDatabase();

    const posts: Post[] = await postCollection.find().toArray();

    const convertObjectIdsToStrings = (posts: Post[]) => {
      return posts.map(post => {
        // Convert _id, category, and author
        if (post._id && typeof post._id !== 'string') post._id = post._id.toString();
        if (post.category && typeof post.category !== 'string') post.category = post.category.toString();
        if (post.author && typeof post.author !== 'string') post.author = post.author.toString();

        // Convert comments array
        if (post.comments && Array.isArray(post.comments)) {
          post.comments = post.comments.map((commentId: ObjectId) => commentId.toString());
        }

        return post;
      });
    };

    return convertObjectIdsToStrings(posts);
  } catch (err) {
    console.error('Error getting posts:', err);
    throw new Error('Error occurred while fetching posts');
  }
};
