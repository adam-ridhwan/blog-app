import { NextResponse } from 'next/server';
import { createPost } from '@/actions/createPost';
import { getPosts } from '@/actions/getPosts';
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
export const POST = async (request: Request) => {
  const session = await getServerSession();
  const { content }: { content: string } = await request.json();

  if (!session) {
    return NextResponse.json({ 'Bad request': 'Not authenticated' }, { status: 401 });
  }

  try {
    const { userCollection } = await connectToDatabase();
    const response = await createPost(content);

    let fetchedUserName;

    if (session.user && session.user.email) {
      const result = await userCollection.findOne(
        { email: session.user.email },
        { projection: { username: 1 } }
      );

      fetchedUserName = result?.username;
      if (!fetchedUserName) {
        return NextResponse.json({ error: 'Error fetching user' }, { status: 400 });
      }
    }

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
