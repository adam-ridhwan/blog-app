'use client';

import { FC, ReactNode, useState } from 'react';
import { AuthorDetails, Post } from '@/types';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

type HydrateAtomsProps = {
  posts: Post[];
  authors: AuthorDetails[];
  children: ReactNode;
};

export const postsAtom = atom<Post[]>([]);
export const authorsAtom = atom<AuthorDetails[]>([]);

export const areAllPostsFetchedAtom = atom(false);

const HydrateAtoms: FC<HydrateAtomsProps> = ({ posts, authors, children }) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [authorsAtom, authors],
    [areAllPostsFetchedAtom, false],
  ]);
  return children;
};

export default HydrateAtoms;
