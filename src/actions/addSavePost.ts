import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const addSavePost = async (postId: string, userId: string) => {
  if (!postId) throw new Error('No posts id found');
  if (!userId) throw new Error('No user id found');

  try {
    const { userCollection } = await connectToDatabase();

    const savedPostResponse = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { savedPosts: new ObjectId(postId) } }
    );

    return {
      savedPostResponse: savedPostResponse.acknowledged,
    };
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Error occurred while saving post');
  }
};
