import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';
import { ObjectId, WithId } from 'mongodb';

import { Post } from '@/types/types';

export const getPost = async (postId: string): Promise<Post> => {
  try {
    const { postCollection } = await connectToDatabase();

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    return plainify(post);
  } catch (err) {
    console.error('Error getting post:', err);
    throw new Error('Error occurred while fetching post');
  }
};
