'use server';

import { User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export async function getUser(email: string | undefined): Promise<User | null> {
  try {
    const { userCollection } = await connectToDatabase();

    const user: User = userCollection.findOne({ email });

    return !user ? null : user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
}
