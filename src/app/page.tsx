import PostList from '@/components/post-list';
import { SideMenuPlaceholder } from '@/components/side-menu';

export default function Home() {
  return (
    <div className='container flex flex-col p-5 xl:flex-row xl:justify-center'>
      <PostList />
      <SideMenuPlaceholder />
    </div>
  );
}
