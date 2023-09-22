'use server';

import { getUserById } from '@/actions/getUserById';
import { AuthorDetails } from '@/types';
import { ObjectId } from 'mongodb';

export async function getUsersById(authorIds: (ObjectId | string)[]) {
  // if (!authorIds || authorIds.length === 0) throw new Error('userId array must be provided');

  try {
    const authors: AuthorDetails[] = await Promise.all(authorIds.map(authorId => getUserById(authorId)));

    return authors;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Handle error accordingly
  }
}
