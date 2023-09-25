import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';

/** ────────────────────────────────────────────────────────────────────────────────────────────────────
 * GET AUTHORS BY ID
 * ────────────────────────────────────────────────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  const { authorIds } = await request.json();

  if (!authorIds) {
    return NextResponse.json({ 'Bad request': 'No authorIds provided' }, { status: 400 });
  }

  const fetchedAuthors = await getUsersById(authorIds);

  if (!fetchedAuthors) {
    return NextResponse.json({ 'Bad request': 'No authors found' }, { status: 400 });
  }

  return NextResponse.json({ fetchedAuthors });
}
