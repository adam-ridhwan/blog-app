import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';
import { Session } from 'next-auth';
import { undefined } from 'zod';

import { Post } from '@/types/types';
import { CreatePostRequestBody } from '@/app/api/posts/route';

export const createPost = async ({ title, subtitle, content, authorId }: CreatePostRequestBody) => {
  try {
    const { postCollection } = await connectToDatabase();

    const newPost: Post = {
      authorId,
      categoryId: new ObjectId('650ce47033901fc25b0af02f'),
      title,
      subtitle,
      content,
      categorySlug: '',
      comments: [],
      createdAt: new Date(),
      likes: 0,
      postSlug: '',
      views: 0,
    };

    revalidatePath('/');

    const response = await postCollection.insertOne(newPost);

    return {
      response,
      newPost,
    };
  } catch (err) {
    console.error('Error creating post:', err);
    throw new Error('Error occurred while creating post');
  }
};
