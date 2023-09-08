import Image from 'next/image';
import Link from 'next/link';

const CategoryList = () => {
  return (
    <>
      <div className=''>
        <h1 className='my-12 text-2xl font-medium'>Popular categories</h1>

        <div className='flex flex-wrap justify-between'>
          <Link
            href='/blog?category=style'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Style
          </Link>
          <Link
            href='/blog?category=fashion'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Fashion
          </Link>
          <Link
            href='/blog?categoryegory=food'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Food
          </Link>
          <Link
            href='/blog?category=travel'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Travel
          </Link>
          <Link
            href='/blog?category=culture'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Culture
          </Link>
          <Link
            href='/blog?category=coding'
            className='flex h-[80px] w-[15%] items-center justify-center gap-2 rounded-md'
          >
            <Image src='/style.png' alt='' width={32} height={32} className='rounded-full' />
            Coding
          </Link>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
