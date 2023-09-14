'use server';

import { createAccount } from '@/actions/createAccount';
import { Account, User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export async function updateProviders(account: Account, existingUser: User): Promise<User | null> {
  try {
    const { userCollection } = await connectToDatabase();

    /**
     * 1) Create new provider account first
     * 2) Update user by pushing the provider to accounts[]
     * */

    const newAccount = createAccount(account, existingUser._id);
    const updateAccount = userCollection.updateOne(
      { email: existingUser.email },
      {
        $push: {
          accounts: account,
        },
      }
    );

    return await Promise.all([newAccount, updateAccount]);
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error occurred while fetching user');
  }
}
