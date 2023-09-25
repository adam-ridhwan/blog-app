import { Post } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { ObjectId } from 'mongodb';
import { Session } from 'next-auth';
import { undefined } from 'zod';

export const createPost = async (content: string) => {
  try {
    const { postCollection } = await connectToDatabase();

    const newPost: Post = {
      authorId: new ObjectId('650e126945e26c7bd150540c'),
      categoryId: new ObjectId('650ce47033901fc25b0af02f'),
      categorySlug: '',
      comments: [],
      content: content,
      createdAt: new Date(),
      likes: 0,
      postSlug: '',
      title: '',
      subtitle: '',
      views: 0,
    };

    return await postCollection.insertOne(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    throw new Error('Error occurred while creating post');
  }
};
