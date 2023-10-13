'use server';

import { connectToDatabase } from '@/util/connectToDatabase';
import { plainify } from '@/util/plainify';
import { ObjectId } from 'mongodb';

import { CommentWithUserInfo, CommentWithUserInfoDTO, MongoId, Reply } from '@/types/types';

export const getComments = async (commentIds: string[]): Promise<CommentWithUserInfoDTO[]> => {
  try {
    const { commentCollection, userCollection, replyCollection } = await connectToDatabase();

    const objectIdComments = commentIds.map(comment => new ObjectId(comment));

    const fetchedComments = await commentCollection
      .find({ _id: { $in: objectIdComments } })
      .sort({ _id: -1 })
      .toArray();

    const fetchedCommentsWithUserInfo: CommentWithUserInfoDTO[] = await Promise.all(
      fetchedComments.map(async comment => {
        const commenter = await userCollection.findOne({ _id: new ObjectId(comment.userId) });
        if (!commenter) throw new Error('Commenter not found');

        const replies = await Promise.all(
          comment.replies.map(async reply => {
            const fetchedReply = await replyCollection.findOne({ _id: new ObjectId(reply) });
            if (!fetchedReply) throw new Error('Reply not found');
            return fetchedReply;
          })
        );

        return {
          ...comment,
          name: commenter.name,
          username: commenter.username,
          image: commenter.image,
          posts: commenter.posts,
          followers: commenter.followers,
          replies: plainify(replies),
        };
      })
    );

    // console.log(
    //   fetchedCommentsWithUserInfo.map(comment => {
    //     comment.replies;
    //   })
    // );

    return plainify(fetchedCommentsWithUserInfo);
  } catch (err) {
    console.error('Error fetching comments:', err);
    throw new Error('Error occurred while fetching comments');
  }
};
