'use server';

import { User, UserWithStrings } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export async function getUser(
  email?: string | undefined,
  userId?: string | undefined
): Promise<User | UserWithStrings | null> {
  if (!email && !userId) {
    throw new Error('Either email or userId must be provided');
  }

  try {
    const { userCollection } = await connectToDatabase();

    if (email) {
      const user: User = await userCollection.findOne({ email });

      return !user ? null : user;
    }

    if (userId) {
      const userIdAsObjectId = new ObjectId(userId);

      const user: User = await userCollection.findOne({ _id: userIdAsObjectId });

      return !user ? null : { userId: user._id.toString(), name: user.name, username: user.username };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
}
