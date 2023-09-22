import { AuthorDetails } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const getUserById = async (userId: ObjectId | string): Promise<AuthorDetails> => {
  if (!userId) throw new Error('Either email or userId must be provided');

  try {
    const { userCollection } = await connectToDatabase();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      image: user.image,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
};
