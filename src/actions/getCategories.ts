'use server';

import { Category, Post } from '@/types';
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

        // Convert post IDs within the category's post array
        if (category.post && Array.isArray(category.post)) {
          category.post = category.post.map((post: Post) => {
            if (post._id && typeof post._id !== 'string') post._id = post._id.toString();

            return post;
          });
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
