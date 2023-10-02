'use server';

import { NextResponse } from 'next/server';
import { getPost } from '@/actions/getPost';
import { getUserByEmail } from '@/actions/getUserByEmail';
import { getUserById } from '@/actions/getUserById';
import { connectToDatabase } from '@/util/connectToDatabase';
import { COMMENT, LIKE, SAVE, SHARE } from '@/util/constants';
import { ObjectId } from 'mongodb';

import { MongoId } from '@/types/types';

export type Action = typeof LIKE | typeof COMMENT | typeof SAVE | typeof SHARE;
export type ActionButtonRequestBody = {
  actionId: Action;
  postId: MongoId | undefined;
  userId: string | undefined;
  totalLikeCount?: number | undefined;
};
export type ActionButtonResponseBody = {};

export async function POST(request: Request) {
  const { actionId, postId, userId, totalLikeCount } = await request.json();

  console.log({ totalLikeCount });

  if (!postId) return NextResponse.json({ 'Bad request': 'No posts id found' }, { status: 400 });

  const { postCollection } = await connectToDatabase();
  const fetchedPost = await getPost(postId);

  //TODO: Allow users to like posts multiple times: limit 30 likes per user
  //TODO: Allow users to unlike posts: remove all likes of posts by user
  if (actionId === LIKE) {
    if (!totalLikeCount) return NextResponse.json({ 'Bad request': 'No like count' }, { status: 400 });

    // Get the current number of likes by this user on the post
    const existingLikesCount =
      (
        await postCollection
          .aggregate([
            { $match: { _id: new ObjectId(postId) } },
            {
              $project: {
                likesCount: {
                  $size: {
                    $filter: {
                      input: '$likes',
                      as: 'like',
                      cond: { $eq: ['$$like', new ObjectId(userId)] },
                    },
                  },
                },
              },
            },
          ])
          .next()
      )?.likesCount || 0;

    console.log({ existingLikesCount });

    // Calculate how many likes the user is allowed to add
    const allowedLikes = 30 - existingLikesCount;
    const finalLikeCount = Math.min(totalLikeCount, allowedLikes);

    if (finalLikeCount <= 0) {
      return NextResponse.json({ 'Limit exceeded': 'You can like up to 30 times per post' }, { status: 200 });
    }

    const likesToAdd = Array(totalLikeCount).fill(new ObjectId(userId));

    const likesToAddResponse = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: { $each: likesToAdd } } }
    );

    return NextResponse.json({ success: 'Liked post' }, { status: 200 });
  }

  if (!fetchedPost) return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });

  return NextResponse.json({ success: 'Liked post' }, { status: 200 });
}
