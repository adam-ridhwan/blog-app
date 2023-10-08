import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/actions/getPost';

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  if (!postId) return NextResponse.json({ 'Bad request': 'No postId found' }, { status: 400 });

  const post = await getPost(postId);
  if (!post) return NextResponse.json({ 'Bad request': 'No post found' }, { status: 400 });

  const likes = post.likes;
  if (!likes) return NextResponse.json({ 'Bad request': 'No likes found' }, { status: 400 });

  return NextResponse.json({ likes }, { status: 200 });
}
