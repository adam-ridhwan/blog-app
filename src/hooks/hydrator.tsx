'use client';

import { FC } from 'react';
import { Category, Post } from '@/types';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

type HydratorProps = {
  posts: Post[];
  categories: Category[];
};

export const postsAtom = atom<Post[]>([]);
export const categoriesAtom = atom<Category[]>([]);

const Hydrator: FC<HydratorProps> = ({ posts, categories }) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return null;
};

export default Hydrator;
