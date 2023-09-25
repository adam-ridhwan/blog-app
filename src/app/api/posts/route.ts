import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createPost } from '@/actions/createPost';
import { getPosts } from '@/actions/getPosts';
import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { getServerSession } from 'next-auth';

// GET POSTS
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

export const POST = async (request: Request) => {
  const session = await getServerSession();
  const { content }: { content: string } = await request.json();

  if (!session) {
    return NextResponse.json({ 'Bad request': 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await createPost(content, session);

    if (!response.acknowledged) {
      NextResponse.json({ success: 'Error creating post' }, { status: 400 });
    }

    return NextResponse.json({ success: 'Post successfully created' }, { status: 200 });
  } catch (err) {
    console.error('Error creating post:', err);
    throw new Error('Error occurred while creating post');
  }
};
