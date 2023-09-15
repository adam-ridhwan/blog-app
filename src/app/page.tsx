import BlogList from '@/components/blog-list';
import SideMenuPlaceholder from '@/components/side-menu-placeholder';

export default function Home() {
  return (
    <div className='container flex flex-col lg:flex-row'>
      <BlogList />
      <SideMenuPlaceholder />
    </div>
  );
}
