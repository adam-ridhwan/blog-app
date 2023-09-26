'use server';

import { createAccount } from '@/actions/createAccount';
import { Account, User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';
import { Account as NextAuthAccount } from 'next-auth';

export async function updateProviders(account: NextAuthAccount | null, existingUser: User | Partial<User>) {
  try {
    const { userCollection } = await connectToDatabase();

    /**
     * 1) Create new providers account first
     * 2) Update user by pushing the providers to accounts[]
     * */
    const convertToMyAccountType = (account: NextAuthAccount | null) => ({
      ...account,
      userId: new ObjectId(account?.userId),
    });

    const convertedAccount = convertToMyAccountType(account) as Account;

    if (!account) return new Error('Account is null');

    await Promise.all([
      createAccount(account, new ObjectId(existingUser._id)),
      userCollection.updateOne({ email: existingUser.email }, { $push: { accounts: convertedAccount } }),
    ]);
  } catch (error) {
    console.error('Error updating providers:', error);
    throw new Error('Error occurred while updating providers');
  }
}
