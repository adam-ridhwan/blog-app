import { NextResponse } from 'next/server';
import prisma from '@/util/connect';

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();
    // @ts-ignore
    return new NextResponse(JSON.stringify(categories, { status: 200 }));
  } catch (err) {
    console.log(err);
    // @ts-ignore
    return new NextResponse({ message: 'Something went wrong' }, { status: 500 });
  }
};
