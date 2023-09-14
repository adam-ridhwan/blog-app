'use server';

import { Category } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { categoryCollection } = await connectToDatabase();

    return await categoryCollection.find({}).toArray();
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Error occurred while fetching categories');
  }
};
