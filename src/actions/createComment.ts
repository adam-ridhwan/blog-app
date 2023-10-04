'use server';

import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';
import { ObjectId } from 'mongodb';

import { Comment, MongoId } from '@/types/types';

export const createComment = async (postId: MongoId, currentUserId: MongoId, newComment: string) => {
  try {
    const { commentCollection, postCollection, userCollection } = await connectToDatabase();

    const fetchedCurrentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
    if (!fetchedCurrentUser) throw new Error('User not found');

    const comment: Comment = {
      createdAt: new Date(),
      response: newComment,
      postId,
      userId: currentUserId,
      likes: [],
    };

    const insertCommentResponse = await commentCollection.insertOne(comment);
    const commentId = insertCommentResponse.insertedId;

    const pendingUpdatePost = postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: commentId } }
    );
    const pendingUpdateUser = userCollection.updateOne(
      { _id: new ObjectId(currentUserId) },
      { $push: { comments: commentId } }
    );

    await Promise.all([pendingUpdatePost, pendingUpdateUser]);

    console.log(insertCommentResponse.acknowledged);
    return {
      insertCommentResponse: plainify(insertCommentResponse.acknowledged),
    };
  } catch (err) {
    console.error('Error creating comment:', err);
    throw new Error('Error occurred while creating comment');
  }
};
