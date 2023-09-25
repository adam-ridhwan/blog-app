import { NextResponse } from 'next/server';
import { createPost } from '@/actions/createPost';
import { getPosts } from '@/actions/getPosts';
import { Post, User } from '@/types';
import { connectToDatabase } from '@/util/connectToDatabase';
import { getServerSession } from 'next-auth';

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

  const [fetchedPosts] = await getPosts(Number(limit), id);

  if (!fetchedPosts) {
    return NextResponse.json({ 'Bad request': 'No posts found' }, { status: 400 });
  }

  return NextResponse.json({ fetchedPosts });
}

/** ────────────────────────────────────────────────────────────────────────────────────────────────────
 * CREATE POST
 * ────────────────────────────────────────────────────────────────────────────────────────────────── */
export type CreatePostRequestBody = Pick<Post, 'title' | 'subtitle' | 'content' | 'authorId'>;

export const POST = async (request: Request) => {
  const session = await getServerSession();
  const { title, subtitle, content }: CreatePostRequestBody = await request.json();

  if (!session) {
    return NextResponse.json({ 'Bad request': 'Not authenticated' }, { status: 401 });
  }

  try {
    const { userCollection } = await connectToDatabase();

    let fetchedUserName: User['username'] | undefined;
    let fetchedAuthorId: Post['authorId'] | undefined;

    if (session.user && session.user.email) {
      const result = await userCollection.findOne(
        { email: session.user.email },
        { projection: { username: 1 } }
      );

      fetchedUserName = result?.username;
      fetchedAuthorId = result?._id;
      if (!fetchedUserName) {
        return NextResponse.json({ error: 'Error fetching user' }, { status: 400 });
      }
    }

    const response = await createPost(<CreatePostRequestBody>{
      title,
      subtitle,
      content,
      authorId: fetchedAuthorId,
    });

    if (!response.acknowledged) {
      NextResponse.json({ error: 'Error creating post' }, { status: 400 });
    }

    return NextResponse.json(
      { success: 'Post successfully created', postId: response.insertedId, username: fetchedUserName },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error creating post:', err);
    throw new Error('Error occurred while creating post');
  }
};
