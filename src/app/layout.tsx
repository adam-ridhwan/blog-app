import '../styles/globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import AuthProvider from '@/providers/auth-provider';
import HydrateAtoms from '@/providers/hydrate-atoms';
import JotaiProvider from '@/providers/jotai-provider';
import ThemeProvider from '@/providers/theme-provider';
import { connectToDatabase } from '@/util/connectToDatabase';
import generateMockUsersAndPosts from '@/util/generateMockUserAndPosts';

import Navbar from '@/components/navbar/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pondero',
  description: 'Blog site for Pondero',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI', 'Blog'],
  authors: [
    {
      name: 'Adam Ridhwan',
      url: 'https://github.com/adam-ridhwan',
    },
  ],
  creator: 'Adam Ridhwan',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { userCollection, postCollection, commentCollection } = await connectToDatabase();

  // await userCollection.deleteMany({});
  // await postCollection.deleteMany({});
  // await commentCollection.deleteMany({});
  // await generateMockUsersAndPosts();
  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCH INITIAL POSTS AND AUTHORS
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  // Fetch initial posts
  const initialPosts = await getPosts(5, undefined);
  if (!initialPosts) throw new Error('Failed to fetch initial posts');

  // Fetch initial authors
  const authorIds = initialPosts.map(post => post.authorId);
  const initialAuthors = await getUsersById(authorIds);

  if (!initialAuthors) throw new Error('Failed to fetch initial authors');
  if (!initialPosts && !initialAuthors) throw new Error('Failed to fetch initial posts and authors');

  // Remove duplicate authors
  const seenAuthors = new Set();
  const uniqueAuthors = initialAuthors.filter(author => {
    if (!seenAuthors.has(author._id)) {
      seenAuthors.add(author._id);
      return true;
    }
    return false;
  });

  return (
    <html lang='en'>
      <body className={`${inter.className} max-h-screen min-h-screen w-full max-w-[100vw]`}>
        <AuthProvider>
          <JotaiProvider>
            <ThemeProvider>
              <HydrateAtoms posts={initialPosts} authors={uniqueAuthors}>
                <Navbar />
                {children}
              </HydrateAtoms>
            </ThemeProvider>
          </JotaiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
