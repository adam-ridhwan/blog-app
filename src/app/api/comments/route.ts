import { NextRequest, NextResponse } from 'next/server';
import { getComments } from '@/actions/getComments';
import { getPost } from '@/actions/getPost';

export async function POST(request: NextRequest) {
  const { username, postId } = await request.json();

  if (!username) return NextResponse.json({ 'Bad request': 'No commentIds found' }, { status: 400 });
  if (!postId) return NextResponse.json({ 'Bad request': 'No postId found' }, { status: 400 });

  const post = await getPost(postId);
  if (!post) return NextResponse.json({ 'Bad request': 'No post found' }, { status: 400 });

  const comments = await getComments(post?.comments);
  if (!comments) return NextResponse.json({ 'Bad request': 'No comments found' }, { status: 400 });

  return NextResponse.json({ comments }, { status: 200 });
}
