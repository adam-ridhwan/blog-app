'use server';

import { getPost } from '@/actions/getPost';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';

import { AuthorDetails, Post } from '@/types/types';

type ReturnObject = {
  author: AuthorDetails;
  post: { mainPost: Post; next4Posts: Post[] };
};

export async function getPostInformation(username: string, postId: string): Promise<ReturnObject> {
  if (!username) throw new Error('Either username must be provided');
  if (!postId) throw new Error('Either postId must be provided');

  try {
    const { userCollection, postCollection } = await connectToDatabase();

    const fetchedAuthor = await userCollection.findOne({ username });

    const mainPost = getPost(postId);
    const next4Posts = postCollection
      .find({
        _id: { $ne: new ObjectId(postId) },
        authorId: new ObjectId(fetchedAuthor?._id),
      })
      .sort({ _id: -1 })
      .limit(4)
      .toArray();

    const [fetchedMainPost, fetchedNext4Posts] = await Promise.all([mainPost, next4Posts]);

    if (!fetchedAuthor) throw new Error('User not found');
    if (!fetchedMainPost) throw new Error('Post not found');
    if (!fetchedNext4Posts) throw new Error('Next 3 posts not found');

    return {
      author: {
        name: fetchedAuthor?.name,
        username: fetchedAuthor?.username,
        image: fetchedAuthor?.image,
        followerCount: fetchedAuthor?.followers.length,
      },
      post: {
        mainPost: JSON.parse(JSON.stringify(fetchedMainPost)),
        next4Posts: JSON.parse(JSON.stringify(fetchedNext4Posts)),
      },
    };
  } catch (error) {
    console.error('Error getting author:', error);
    throw new Error('Error occurred while fetching author');
  }
}
