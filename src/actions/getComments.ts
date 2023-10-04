'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';
import { ObjectId } from 'mongodb';

import { CommentWithUserInfo, MongoId } from '@/types/types';

export const getComments = async (mainPostComments: MongoId[]) => {
  try {
    const { commentCollection, userCollection } = await connectToDatabase();

    const objectIdComments = mainPostComments.map(comment => new ObjectId(comment));

    const fetchedComments = await commentCollection.find({ _id: { $in: objectIdComments } }).toArray();

    const fetchedCommentsWithUserInfo: CommentWithUserInfo[] = await Promise.all(
      fetchedComments.map(async comment => {
        const commenter = await userCollection.findOne({ _id: new ObjectId(comment.userId) });
        if (!commenter) throw new Error('Commenter not found');
        return {
          ...comment,
          name: commenter.name,
          username: commenter.username,
          image: commenter.image,
          posts: commenter.posts,
          followers: commenter.followers,
        };
      })
    );

    return {
      fetchedCommentsWithUserInfo: plainify(fetchedCommentsWithUserInfo),
    };
  } catch (err) {
    console.error('Error fetching comments:', err);
    throw new Error('Error occurred while fetching comments');
  }
};
