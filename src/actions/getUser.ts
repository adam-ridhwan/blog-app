'use server';

import { User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export async function getUser(
  email?: string | undefined,
  userId?: ObjectId | string
): Promise<User | Partial<User> | null> {
  if (!email && !userId) throw new Error('Either email or userId must be provided');

  try {
    const { userCollection } = await connectToDatabase();

    if (email) return await userCollection.findOne({ email });

    if (userId) {
      const user: User | null = await userCollection.findOne({ _id: new ObjectId(userId) });

      if (!user) return null;

      if (!user._id) throw new Error('User is missing _id field.');

      return {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
      };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
  return null;
}
