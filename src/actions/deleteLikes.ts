import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const deleteLikes = async (postId: string, userId: string) => {
  const { postCollection, userCollection } = await connectToDatabase();

  const pendingDeletePostLikes = postCollection.updateOne(
    { _id: new ObjectId(postId) },
    { $pull: { likes: new ObjectId(userId) } }
  );

  // TODO: Add likes array in user schema. then delete the like from the user's likes array
  // const pendingDeleteUserLikes = userCollection.updateOne(
  //   { _id: new ObjectId(userId) },
  //   { $pull: { likes: new ObjectId(postId) } }
  // )

  const [deletedPostLikes] = await Promise.all([pendingDeletePostLikes]);

  return {
    response: deletedPostLikes.acknowledged,
  };
};
