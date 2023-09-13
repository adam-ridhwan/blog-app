import prisma from '@/util/connect';

export const getPosts = async () => {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error('Error getting channels:', error);
    throw new Error('Error occurred while fetching channels');
  }
};
