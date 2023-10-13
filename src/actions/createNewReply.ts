'use server';

import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';
import { ObjectId } from 'mongodb';

import { Comment, CommentWithUserInfo, Reply } from '@/types/types';

export const createNewReply = async (commentId: string, userId: string, newReply: string) => {
  try {
    const { commentCollection, replyCollection, userCollection } = await connectToDatabase();

    const fetchedCurrentUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!fetchedCurrentUser) throw new Error('User not found');

    const reply: Reply = {
      createdAt: new Date(),
      reply: newReply,
      commentId: new ObjectId(commentId),
      userId: new ObjectId(userId),
      likes: [],
    };

    const insertReplyResponse = await replyCollection.insertOne(reply);
    const replyId = insertReplyResponse.insertedId;

    const pendingUpdateComment = commentCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $push: { replies: new ObjectId(replyId) } }
    );

    await Promise.all([pendingUpdateComment]);

    const replier = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!replier) throw new Error('Commenter not found');

    const newReplyWithUserInfo = {
      ...reply,
      name: replier.name,
      username: replier.username,
      image: replier.image,
      posts: replier.posts,
      followers: replier.followers,
    };

    return {
      response: plainify(insertReplyResponse.acknowledged),
      newReply: plainify(newReplyWithUserInfo),
    };
  } catch (err) {
    console.error('Error creating comment:', err);
    throw new Error('Error occurred while creating comment');
  }
};
