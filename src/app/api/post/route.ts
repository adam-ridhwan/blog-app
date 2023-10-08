'use server';

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { addSavePost } from '@/actions/addSavePost';
import { createComment } from '@/actions/createComment';
import { deleteLikes } from '@/actions/deleteLikes';
import { deleteSavedPost } from '@/actions/deleteSavedPost';
import { getPost } from '@/actions/getPost';
import { connectToDatabase } from '@/util/connectToDatabase';
import { COMMENT, DELETE_LIKES, DELETE_SAVED_POST, LIKE, SAVE, SHARE } from '@/util/constants';
import { ObjectId } from 'mongodb';

export type Action =
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

    const likesToAdd = Array(totalLikeCount).fill(new ObjectId(userId));

    const likesToAddResponse = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: { $each: likesToAdd } } }
    );

    return NextResponse.json({ success: 'Liked post' }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * COMMENT
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === COMMENT) {
    const { insertCommentResponse, newCommentWithUserInfo } = await createComment(postId, userId, comment);

    return NextResponse.json({ insertCommentResponse, newCommentWithUserInfo }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * DELETE
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === DELETE_LIKES) {
    const { deletedPostLikes } = await deleteLikes(postId, userId);

    return NextResponse.json({ deletedPostLikes }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SAVE
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === SAVE) {
    const { savedPostResponse } = await addSavePost(postId, userId);

    return NextResponse.json({ savedPostResponse }, { status: 200 });
  }

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * REMOVE SAVED POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  if (actionId === DELETE_SAVED_POST) {
    const { deletedSavedPostResponse } = await deleteSavedPost(postId, userId);

    return NextResponse.json({ deletedSavedPostResponse }, { status: 200 });
  }

  return NextResponse.json({ success: 'Route api/post' }, { status: 200 });
}
