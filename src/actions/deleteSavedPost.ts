import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const deleteSavedPost = async (postId: string, userId: string) => {
  const { userCollection } = await connectToDatabase();

  const deletedSavedPost = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { savedPosts: new ObjectId(postId) } }
  );

  return {
    response: deletedSavedPost.acknowledged,
  };
};
