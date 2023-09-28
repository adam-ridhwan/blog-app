'use server';

import { NextResponse } from 'next/server';
import { getPost } from '@/actions/getPost';
import { getPosts } from '@/actions/getPosts';
import { getUserByEmail } from '@/actions/getUserByEmail';
import { connectToDatabase } from '@/util/connectToDatabase';
import { COMMENT, LIKE, SAVE, SHARE } from '@/util/constants';
import { ObjectId } from 'mongodb';

import { MongoId } from '@/types/types';

export type Action = typeof LIKE | typeof COMMENT | typeof SAVE | typeof SHARE;
export type ActionButtonRequestBody = {
  actionId: Action;
  postId: MongoId | undefined;
  email: string | undefined;
};
export type ActionButtonResponseBody = {};

export async function POST(request: Request) {
  const { actionId, postId, email } = await request.json();

  if (!postId) {
    return NextResponse.error();
  }

  const { postCollection } = await connectToDatabase();
  const pendingPost = getPost(postId);
  const pendingUser = getUserByEmail(email);

  const [fetchedPost, fetchedUser] = await Promise.all([pendingPost, pendingUser]);

  //TODO: Allow users to like posts multiple times: limit 10 likes per user
  //TODO: Allow users to unlike posts: remove all likes of posts by user
  if (actionId === LIKE) {
    const response = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: new ObjectId(fetchedUser?._id) } }
    );
    console.log(response);
  }

  if (!fetchedPost) {
    return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });
  }

  return NextResponse.json({ success: 'Liked post' }, { status: 200 });
}
