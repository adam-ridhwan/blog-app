'use server';

import { getUserById } from '@/actions/getUserById';
import { ObjectId } from 'mongodb';

import { AuthorDetails, MongoId } from '@/types/types';

export async function getUsersById(authorIds: MongoId[]) {
  // if (!authorIds || authorIds.length === 0) throw new Error('userId array must be provided');

  try {
    const authors: AuthorDetails[] = await Promise.all(authorIds.map(authorId => getUserById(authorId)));

    return authors;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error occurred while fetching users');
  }
}
