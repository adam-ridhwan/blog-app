import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';
import { Session } from 'next-auth';
import { undefined } from 'zod';

import { Post } from '@/types/types';
import { CreatePostRequestBody } from '@/app/api/posts/route';

export const createPost = async ({ title, subtitle, content, authorId }: CreatePostRequestBody) => {
  try {
    const { postCollection, userCollection } = await connectToDatabase();

    const newPost: Post = {
      authorId,
      categoryId: new ObjectId('650ce47033901fc25b0af02f'),
      title,
      subtitle,
      content,
      categorySlug: '',
      comments: [],
      createdAt: new Date(),
      likes: [],
      postSlug: '',
      views: 0,
    };

    revalidatePath('/');

    const insertPostResponse = await postCollection.insertOne(newPost);

    await userCollection.updateOne(
      { _id: new ObjectId(authorId) },
      { $push: { posts: new ObjectId(insertPostResponse.insertedId) } }
    );

    return {
      response: insertPostResponse,
      newPost,
    };
  } catch (err) {
    console.error('Error creating main-section:', err);
    throw new Error('Error occurred while creating main-section');
  }
};
