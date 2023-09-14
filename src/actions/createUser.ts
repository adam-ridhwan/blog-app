'use server';

import { createAccount } from '@/actions/createAccount';
import { type Account, type User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { generateRandomString } from '@/util/generateRandomString';

export const createUser = async (account: Account, user: User) => {
  try {
    const { userCollection } = await connectToDatabase();

    const newUser: User = {
      name: user.name,
      email: user.email,
      username: '@' + user.email.split('@')[0] + '_' + generateRandomString(),
      accounts: [account],
      sessions: [],
      posts: [],
      comments: [],
    };

    const createdNewUser: User = await userCollection.insertOne(newUser);

    await createAccount(account, createdNewUser.insertedId);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error occurred while creating user');
  }
};
