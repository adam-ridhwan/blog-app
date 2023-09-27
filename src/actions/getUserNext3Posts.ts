import { connectToDatabase } from '@/util/connectToDatabase';

export const getUserNext3Posts = async (username: string, postId: string) => {
  const { userCollection, postCollection } = await connectToDatabase();
};
