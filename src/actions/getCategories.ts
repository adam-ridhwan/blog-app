'use server';

import { Category } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export const getCategories = async () => {
  try {
    const { categoryCollection } = await connectToDatabase();
    const categories: Category[] = await categoryCollection.find({}).toArray();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Error occurred while fetching categories');
  }
};
