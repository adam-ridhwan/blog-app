import { NextResponse } from 'next/server';
import { createPost } from '@/actions/createPost';
import { getPosts } from '@/actions/getPosts';
import { connectToDatabase } from '@/util/connectToDatabase';
import { getServerSession } from 'next-auth';
import { undefined } from 'zod';

import { AuthorDetails, Post, User } from '@/types/types';

/** ────────────────────────────────────────────────────────────────────────────────────────────────────
 * GET POSTS
 * ────────────────────────────────────────────────────────────────────────────────────────────────── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const id = searchParams.get('id');

  if (!limit || !id) {
    return NextResponse.error();
  }

  const fetchedPosts = await getPosts(Number(limit), id);

  if (!fetchedPosts) {
    return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });
  }

  return NextResponse.json({ fetchedPosts });
}

/** ────────────────────────────────────────────────────────────────────────────────────────────────────
 * CREATE NEW POST
 * ────────────────────────────────────────────────────────────────────────────────────────────────── */
export type CreatePostRequestBody = Pick<Post, 'title' | 'subtitle' | 'content' | 'authorId'>;

type CreatePostResponseBody = {
  success: string;
  newPost: Post;
  newAuthor: AuthorDetails;
};

export const POST = async (request: Request) => {
  const session = await getServerSession();
  const { title, subtitle, content }: CreatePostRequestBody = await request.json();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ 'Bad request': 'Not authenticated' }, { status: 401 });
  }

  try {
    const { userCollection } = await connectToDatabase();

    const fetchedUserWithEmail = await userCollection.findOne(
      { email: session.user.email },
      { projection: { username: 1, name: 1, _id: 1, image: 1 } }
    );

    if (!fetchedUserWithEmail) {
      return NextResponse.json({ error: 'Error fetching user' }, { status: 400 });
    }

    const { _id, name, username, image } = fetchedUserWithEmail;
    const newAuthor: AuthorDetails = { _id, name, username, image };

    const { response, newPost } = await createPost(<CreatePostRequestBody>{
      title,
      subtitle,
      content,
      authorId: newAuthor._id,
    });

    if (!response.acknowledged) {
      return NextResponse.json({ error: 'Error creating main-section' }, { status: 400 });
    }

    const createPostResponseBody: CreatePostResponseBody = {
      success: 'Post successfully created',
      newPost,
      newAuthor,
    };

    return NextResponse.json(createPostResponseBody, { status: 200 });
  } catch (err) {
    console.error('Error creating main-section:', err);
    throw new Error('Error occurred while creating main-section');
  }
};
