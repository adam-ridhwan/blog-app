import Image from 'next/image';
import Link from 'next/link';

const Card = () => {
  return (
    <>
      <div className='mb-[50px] flex items-center gap-[50px]'>
        <div className='relative h-[350px] flex-1'>
          <Image src='/sand.jpg' alt='' fill className='object-cover' />
        </div>

        <div className='flex flex-1 flex-col gap-[30px]'>
          <div className=''>
            <span className='text-muted-foreground'>11.02.2023 - </span>
            <span className='font-semibold'>CULTURE</span>
          </div>
          <h1 className='text-2xl'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h1>
          <p className='text-muted-foreground'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consequuntur dolores, excepturi fugit
            mollitia quas quia quis rem similique sint tempora ut voluptas voluptatibus. Earum ex perspiciatis totam
            voluptatem voluptatum.
          </p>
          <Link href='' className='border-b border-b-accent-foreground'>
            Read more
          </Link>
        </div>
      </div>
    </>
  );
};

export default Card;
