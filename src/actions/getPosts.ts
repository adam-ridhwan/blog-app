'use server';

import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

interface QueryObject {
  _id?: {
    $lt?: ObjectId;
  };
}

export const getPosts = async (numberOfPostsToFetch: number = 5, lastFetchedId?: string | undefined) => {
  console.log(lastFetchedId !== undefined && lastFetchedId);
  try {
    const { postCollection } = await connectToDatabase();
    const totalDocuments = await postCollection.countDocuments();

    const queryObj: QueryObject = {};

    if (lastFetchedId) {
      queryObj['_id'] = { $lt: new ObjectId(lastFetchedId) };
    }

    const posts: Post[] = await postCollection
      .find(queryObj)
      .sort({ _id: -1 })
      .limit(numberOfPostsToFetch)
      .toArray();

    const convertObjectIdsToStrings = (posts: Post[]) => {
      return [...posts].map(post => {
        // Convert _id, category, and author
        if (post._id && post._id instanceof ObjectId) post._id = post._id.toString();
        if (post.category && post.category instanceof ObjectId) post.category = post.category.toString();
        if (post.author && post.author instanceof ObjectId) post.author = post.author.toString();

        // Convert comments array
        if (post.comments && Array.isArray(post.comments)) {
          post.comments = post.comments.map(commentId => commentId.toString());
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
