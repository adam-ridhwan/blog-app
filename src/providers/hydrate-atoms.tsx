'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffectOnce } from 'usehooks-ts';

import { AuthorDetails, CommentWithUserInfo, Post, User } from '@/types/types';

type HydrateAtomsProps = {
  posts: Post[];
  authors: AuthorDetails[];
  currentUser: User;
  children: ReactNode;
};

export const postsAtom = atom<Post[]>([]);
export const authorsAtom = atom<AuthorDetails[]>([]);
export const currentUserAtom = atom<User | null>(null);

export const areAllPostsFetchedAtom = atom(false);

const HydrateAtoms: FC<HydrateAtomsProps> = ({ posts, authors, currentUser, children }) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [authorsAtom, authors],
    [currentUserAtom, currentUser],
    [areAllPostsFetchedAtom, false],
  ]);

  useEffectOnce(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('comment|')) {
        localStorage.removeItem(key);
      }
    }
  });

  return children;
};

export default HydrateAtoms;
