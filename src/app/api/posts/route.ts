import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getPosts } from '@/actions/getPosts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const id = searchParams.get('id');

  if (!limit || !id) {
    return NextResponse.error();
  }

  const [fetchedPosts] = await getPosts(Number(limit), id);

  if (!fetchedPosts) {
    return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });
  }

  return NextResponse.json({ fetchedPosts });
}
