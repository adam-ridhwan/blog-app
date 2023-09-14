'use server';

import { Account, User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

export async function getAccount(userId: ObjectId, provider: string | undefined): Promise<User | null> {
  try {
    const { accountCollection } = await connectToDatabase();

    const existingAccount: Account = accountCollection.findOne({ userId, provider });

    return !existingAccount ? null : existingAccount;
  } catch (error) {
    console.error('Error getting account:', error);
    throw new Error('Error occurred while fetching account');
  }
}
