import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const getPost = async (postId: string) => {
  try {
    const { postCollection } = await connectToDatabase();

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    return post;
  } catch (err) {
    console.error('Error getting post:', err);
    throw new Error('Error occurred while fetching post');
  }
};
