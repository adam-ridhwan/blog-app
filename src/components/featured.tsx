import Image from 'next/image';

import { Button } from '@/components/ui/button';

const Featured = () => {
  return (
    <>
      <div className='mt-7'>
        <h1 className='text-4xl'>
          <b> Hey, loremblog here!</b> Discover the latest stories and creative ideas.
        </h1>

        <div className='mt-14 flex items-center gap-8'>
          <div className='relative h-[500px] flex-1'>
            <Image src='/sand.jpg' alt='' fill className='object-cover' />
          </div>

          <div className='flex flex-1 flex-col gap-5'>
            <h2 className='text-3xl font-semibold'>Lorem ipsum dolor sit amet</h2>
            <p className='text-l text-muted-foreground'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi assumenda doloremque eos hic neque
              pariatur, praesentium quibusdam. Ab assumenda dolore dolorum explicabo, ipsa iste iure nemo odit omnis
              repellat, veritatis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque aut delectus in
              labore, laborum minima non possimus qui! Adipisci aliquam dolor fugit id iure nobis pariatur ut. Beatae,
              iste, rem!
            </p>
            <Button className='w-max'>Read more</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Featured;
