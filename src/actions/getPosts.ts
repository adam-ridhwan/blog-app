'use server';

import { revalidatePath } from 'next/cache';
import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

interface QueryObject {
  _id?: {
    $lt?: ObjectId;
  };
}

export const getPosts = async (
  numberOfPostsToFetch: number = 5,
  lastFetchedId?: string | undefined
): Promise<Post[]> => {
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

    return JSON.parse(JSON.stringify(posts));
  } catch (err) {
    console.error('Error getting posts:', err);
    throw new Error('Error occurred while fetching posts');
  }
};
