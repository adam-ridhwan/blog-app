'use client';

import { FC } from 'react';
import { Category, CategoryWithStrings, Post, PostWithStrings } from '@/types';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

type HydratorProps = {
  convertedPosts: PostWithStrings[];
  convertedCategories: CategoryWithStrings[];
};

export const postsAtom = atom<PostWithStrings[]>([]);
export const categoriesAtom = atom<CategoryWithStrings[]>([]);

const Hydrator: FC<HydratorProps> = ({ convertedPosts, convertedCategories }) => {
  useHydrateAtoms([
    [postsAtom, convertedPosts],
    [categoriesAtom, convertedCategories],
  ]);

  return null;
};

export default Hydrator;
