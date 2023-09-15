import './globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import AuthProvider from '@/provider/auth-provider';
import JotaiProvider from '@/provider/jotai-provider';
import ThemeProvider from '@/provider/theme-provider';

import NavBarDesktop from '@/components/nav-bar-desktop';

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} max-h-screen min-h-screen w-full max-w-[100vw]`}>
        <AuthProvider>
          <JotaiProvider>
            <ThemeProvider>
              <NavBarDesktop />
              {children}
            </ThemeProvider>
          </JotaiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
