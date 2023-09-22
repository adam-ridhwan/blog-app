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

  const [fetchedPosts, totalDocuments] = await getPosts(Number(limit), id);

  revalidatePath('/api/posts');

  return NextResponse.json({ posts: fetchedPosts, totalDocuments });
}
