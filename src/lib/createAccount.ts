'use server';

import { type Account } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export const createAccount = async (account: Account, userId: ObjectId): Promise<Account> => {
  try {
    const { accountCollection } = await connectToDatabase();

    const newAccount: Account = { ...account, userId: userId };

    const createNewAccount: Account = accountCollection.insertOne(newAccount);

    return await Promise.all([createNewAccount]);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error occurred while creating user');
  }
};
