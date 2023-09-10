import MainSection from '@/components/main-section';
import SideMenu from '@/components/side-menu';

export default function Home() {
  return (
    <div className='container flex flex-col lg:flex-row'>
      <MainSection />
      <SideMenu />
    </div>
  );
}
