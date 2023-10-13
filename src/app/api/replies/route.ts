import { NextRequest, NextResponse } from 'next/server';
import { createNewReply } from '@/actions/createNewReply';
import { GET_REPLIES, REPLY_COMMENT } from '@/util/constants';

type action = typeof GET_REPLIES | typeof REPLY_COMMENT;

export type PostRepliesRequestBody = {
  actionId: action;
  commentId: string;
  userId: string;
  reply: string;
  replies: string[];
};

export async function POST(request: NextRequest) {
  const { actionId, commentId, userId, reply } = await request.json();

  if (!actionId) return NextResponse.json({ 'Bad request': 'No actionId found' }, { status: 400 });

  if (actionId === REPLY_COMMENT) {
    if (!commentId) return NextResponse.json({ 'Bad request': 'No username found' }, { status: 400 });
    if (!userId) return NextResponse.json({ 'Bad request': 'No userId found' }, { status: 400 });
    if (!reply) return NextResponse.json({ 'Bad request': 'No reply found' }, { status: 400 });

    const { response, newReply } = await createNewReply(commentId, userId, reply);

    if (!response) return NextResponse.json({ 'Bad request': 'No response found' }, { status: 400 });
    if (!newReply) return NextResponse.json({ 'Bad request': 'No newReply found' }, { status: 400 });

    return NextResponse.json({ response, newReply }, { status: 200 });
  }

  if (actionId === GET_REPLIES) {
    return NextResponse.json({ ayo: 'ayo' }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
