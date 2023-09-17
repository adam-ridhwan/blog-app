'use server';

import { Category } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { categoryCollection } = await connectToDatabase();
    const categories: Category[] = await categoryCollection.find({}).toArray();

    const convertObjectIdsToStringsInCategories = (categories: Category[]) => {
      return categories.map(category => {
        // Convert category _id
        if (category._id && typeof category._id !== 'string') {
          category._id = category._id.toString();
        }

        // Convert post ObjectIds within the category's posts array to strings
        if (category.posts && Array.isArray(category.posts)) {
          category.posts = category.posts.map(postId => (typeof postId !== 'string' ? postId.toString() : postId));
        }

        return category;
      });
    };

    return convertObjectIdsToStringsInCategories(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Error occurred while fetching categories');
  }
};
