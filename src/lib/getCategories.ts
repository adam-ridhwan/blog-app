import prisma from '@/util/connect';

export const getCategories = async () => {
  try {
    return await prisma.category.findMany();
  } catch (error) {
    console.error('Error getting channels:', error);
    throw new Error('Error occurred while fetching channels');
  }
};
