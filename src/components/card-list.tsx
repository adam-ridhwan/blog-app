import Image from 'next/image';

import Card from '@/components/card';
import Pagination from '@/components/pagination';

const CardList = () => {
  return (
    <>
      <div className='flex-[5]'>
        <h1 className='mb-6 mt-12'>Recent posts</h1>

        <div>
          <div>
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
        <Pagination />
      </div>
    </>
  );
};

export default CardList;
