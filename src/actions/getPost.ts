import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const getPost = async (postId: string) => {
  try {
    const { postCollection } = await connectToDatabase();

    return await postCollection.findOne({ _id: new ObjectId(postId) });
  } catch (err) {
    console.error('Error getting main-section:', err);
    throw new Error('Error occurred while fetching main-section');
  }
};
