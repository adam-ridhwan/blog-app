'use server';

import prisma from '@/util/connect';

export const getUser = async (email: string) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error('Error getting channels:', error);
    throw new Error('Error occurred while fetching channels');
  }
};
