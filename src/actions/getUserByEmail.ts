'use server';

import { User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export async function getUserByEmail(email?: string | undefined | null) {
  if (!email) throw new Error('Either email or userId must be provided');

  try {
    const { userCollection } = await connectToDatabase();
    return await userCollection.findOne({ email });
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
}
