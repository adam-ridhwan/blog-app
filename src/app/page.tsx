import MainSection from '@/components/main-section';
import SideMenuPlaceholder from '@/components/side-menu-placeholder';

export default function Home() {
  return (
    <div className='container flex flex-col lg:flex-row'>
      <MainSection />
      <SideMenuPlaceholder />
    </div>
  );
}
