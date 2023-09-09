import Link from 'next/link';
import { capitalize } from '@/util';
import { cn } from '@/util/cn';

const CategoryList = () => {
  const categories = ['lifestyle', 'health', 'coding', 'business', 'fashion', 'education'];
  const colors = ['bg-blue', 'bg-pink', 'bg-green', 'bg-red', 'bg-orange', 'bg-purple'];

  return (
    <>
      <div className=''>
        <h1 className='mb-6 mt-12 text-2xl font-medium'>Popular categories</h1>

        <div className='mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {categories.map((category, index) => {
            return (
              <Link
                key={category}
                href={`/blog?category=${category}`}
                className={cn(`flex h-[80px] min-w-[150px] items-center justify-center rounded-md`, `${colors[index]}`)}
              >
                <span className='whitespace-nowrap text-lg text-primary'>{capitalize(category)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
