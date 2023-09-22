'use server';

import { connectToDatabase } from '@/util/connectToDatabase';

export async function getUserByUsername(username: string) {
  if (!username) throw new Error('Either username or userId must be provided');

  try {
    const { userCollection } = await connectToDatabase();
    const user = await userCollection.findOne({ username });

    return {
      name: user?.name,
      username: user?.username,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
}
