'use server';

import { connectToDatabase } from '@/util/connectToDatabase';
import { InsertOneResult, ObjectId } from 'mongodb';
import { type Account as NextAuthAccount } from 'next-auth';

import { type Account } from '@/types/types';

export const createAccount = async (
  account: NextAuthAccount | null,
  userId: ObjectId
): Promise<InsertOneResult<Account>> => {
  try {
    const { accountCollection } = await connectToDatabase();

    const newAccount = { ...account, userId: userId };

    return await accountCollection.insertOne(newAccount as Account);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error occurred while creating user');
  }
};
