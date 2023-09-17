import { getCategories } from '@/actions/getCategories';
import { getPosts } from '@/actions/getPosts';
import { Category, Post } from '@/types';

import Hydrator from '@/hooks/hydrator';
import PostList from '@/components/post-list';
import { SideMenuPlaceholder } from '@/components/side-menu';

export default async function Home() {
  const [posts, categories]: [Post[], Category[]] = await Promise.all([getPosts(), getCategories()]);

  return (
    <div className='container flex flex-col p-5 xl:flex-row xl:justify-center'>
      <Hydrator {...{ posts, categories }} />
      <PostList />
      <SideMenuPlaceholder />
    </div>
  );
}
