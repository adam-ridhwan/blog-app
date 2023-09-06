import CardList from '@/components/card-list';
import CategoryList from '@/components/category-list';
import Featured from '@/components/featured';
import Menu from '@/components/menu';

export default function Home() {
  return (
    <div className=''>
      <Featured />
      <CategoryList />
      <div>
        <CardList />
        <Menu />
      </div>
    </div>
  );
}
