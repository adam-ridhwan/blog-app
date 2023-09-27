import PostList from '@/components/main-section/post-list';
import BuiltWith from '@/components/side-menu/built-with';
import Draft from '@/components/side-menu/draft';
import EditorPosts from '@/components/side-menu/editor-posts';
import SideMenu from '@/components/side-menu/side-menu';
import TrendingPosts from '@/components/side-menu/trending-posts';
import WhoToFollow from '@/components/side-menu/who-to-follow';

export default async function Home() {
  return (
    <div className='container flex flex-col px-5 xl:flex-row xl:justify-center'>
      <PostList>{/*<Categories />*/}</PostList>
      <SideMenu>
        <>
          <TrendingPosts />
          <Draft />
          <WhoToFollow />
          <EditorPosts />
          <BuiltWith />
        </>
      </SideMenu>
    </div>
  );
}
