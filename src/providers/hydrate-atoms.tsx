'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { AuthorDetails, CommentWithUserInfo, Post } from '@/types/types';

type HydrateAtomsProps = {
  posts: Post[];
  authors: AuthorDetails[];
  children: ReactNode;
};

export const postsAtom = atom<Post[]>([]);
export const authorsAtom = atom<AuthorDetails[]>([]);

export const areAllPostsFetchedAtom = atom(false);

export const commentsAtom = atom<CommentWithUserInfo[]>([]);

const HydrateAtoms: FC<HydrateAtomsProps> = ({ posts, authors, children }) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [authorsAtom, authors],
    [areAllPostsFetchedAtom, false],
  ]);

  return children;
};

export default HydrateAtoms;
