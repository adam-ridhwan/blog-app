'use server';

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { addSavePost } from '@/actions/addSavePost';
import { createComment } from '@/actions/createComment';
import { deleteLikes } from '@/actions/deleteLikes';
import { deleteSavedPost } from '@/actions/deleteSavedPost';
import { getComments } from '@/actions/getComments';
import { getPost } from '@/actions/getPost';
import { connectToDatabase } from '@/util/connectToDatabase';
import { COMMENT, DELETE_LIKES, DELETE_SAVED_POST, GET, LIKE, SAVE, SHARE } from '@/util/constants';
import { plainify } from '@/util/plainify';
import { ObjectId } from 'mongodb';

export type Action =
  | typeof GET
  | typeof LIKE
  | typeof COMMENT
  | typeof SAVE
  | typeof SHARE
  | typeof DELETE_LIKES
  | typeof DELETE_SAVED_POST;

export type ActionButtonRequestBody = {
  actionId: Action;
  postId: string;
  userId: string;
  totalLikeCount?: number | undefined;
  comment?: string | undefined;
};
export type ActionButtonResponseBody = {};

export async function POST(request: NextRequest) {
  const { actionId, postId, userId, totalLikeCount, comment } = await request.json();

  if (!postId) return NextResponse.json({ 'Bad request': 'No posts id found' }, { status: 400 });

  const { postCollection } = await connectToDatabase();
  const fetchedPost = await getPost(postId);
  if (!fetchedPost) return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * LIKE
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
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

    // Calculate how many likes the user is allowed to add
    const allowedLikes = 30 - existingLikesCount;
    const finalLikeCount = Math.min(totalLikeCount, allowedLikes);

    if (finalLikeCount <= 0) {
      return NextResponse.json({ 'Limit exceeded': 'You can like up to 30 times per post' }, { status: 200 });
    }

    const likes = Array(totalLikeCount).fill(new ObjectId(userId));

    const response = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: { $each: likes } } }
    );

    return NextResponse.json(
      {
        response: response.acknowledged,
        likes: plainify(likes),
      },
      { status: 200 }
    );
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * COMMENT
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === COMMENT) {
    const { response, newComment } = await createComment(postId, userId, comment);

    return NextResponse.json({ response, newComment }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * DELETE
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === DELETE_LIKES) {
    const { response } = await deleteLikes(postId, userId);

    return NextResponse.json({ response }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SAVE
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === SAVE) {
    const { response } = await addSavePost(postId, userId);

    return NextResponse.json({ response }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * REMOVE SAVED POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === DELETE_SAVED_POST) {
    const { response } = await deleteSavedPost(postId, userId);

    return NextResponse.json({ response }, { status: 200 });
  }

  return NextResponse.json({ success: 'Route api/post' }, { status: 200 });
}
