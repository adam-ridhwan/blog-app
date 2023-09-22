import Image from 'next/image';
import { Bookmark, Heart, MessageSquare, Share } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SeparatorDot from '@/components/ui/separator-dot';

const SinglePage = () => {
  return (
    <>
      <div className='container flex min-h-screen flex-col items-center pb-[100px] pt-[100px]'>
        <div className='relative mb-10 aspect-video w-full max-w-[750px]'>
          <Image src='/sand.jpg' alt='sand' fill className='rounded-lg object-cover' />
        </div>

        <div className='w-full md:max-w-[680px]'>
          <h1 className='text-balance mb-2 text-3xl font-semibold text-primary md:text-4xl'>
            7 Rules of Effective Branding
          </h1>
          <h2 className='text-balance text-l text-muted-foreground mb-5 font-semibold md:text-xl'>
            Why branding matters to your business
          </h2>

          <div className='mb-3 flex flex-row items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-row items-center gap-1'>
              <span className='font-medium text-primary underline-offset-4 hover:underline'>John Doe</span>
              <SeparatorDot />
              <span className='text-muted-foreground'>Mar 7th 2023</span>
            </div>
          </div>

          <div className='mb-10 flex flex-row'>
            <Button variant='ghost' className='flex w-max flex-row gap-1'>
              <Heart className='text-accent-foreground h-5 w-5' />
              Like
            </Button>
            <Button variant='ghost' className='flex w-max flex-row gap-1'>
              <MessageSquare className='text-accent-foreground h-5 w-5' />
              Comment
            </Button>
            <Button variant='ghost' className='flex w-max flex-row gap-1'>
              <Bookmark className='text-accent-foreground h-5 w-5' />
              Save
            </Button>
            <Button variant='ghost' className='flex w-max flex-row gap-1'>
              <Share className='text-accent-foreground h-5 w-5' />
              Share
            </Button>
          </div>

          <Separator />

          <div className='mt-10 flex flex-col gap-5 text-xl leading-8 text-paragraph'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Aenean et tortor at risus. Viverra orci sagittis eu volutpat odio
              facilisis mauris sit amet. Leo duis ut diam quam. Sed risus ultricies tristique nulla aliquet
              enim tortor at. Volutpat sed cras ornare arcu dui vivamus arcu felis. Accumsan in nisl nisi
              scelerisque eu ultrices vitae auctor eu. Sem viverra aliquet eget sit amet tellus cras. Cursus
              euismod quis viverra nibh. Mauris a diam maecenas sed enim.
            </p>

            <p>
              Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Maecenas accumsan lacus
              vel facilisis volutpat. Pulvinar neque laoreet suspendisse interdum. Nunc mi ipsum faucibus
              vitae aliquet nec. Eu augue ut lectus arcu. Sed odio morbi quis commodo odio aenean sed. Eget
              sit amet tellus cras adipiscing enim eu. Quisque non tellus orci ac auctor augue. Tincidunt dui
              ut ornare lectus sit amet. Non tellus orci ac auctor augue. Urna duis convallis convallis tellus
              id interdum. Leo vel orci porta non pulvinar.
            </p>

            <p>
              Bibendum est ultricies integer quis auctor. Id venenatis a condimentum vitae sapien. Augue neque
              gravida in fermentum et. Iaculis nunc sed augue lacus viverra vitae. Nascetur ridiculus mus
              mauris vitae. Et malesuada fames ac turpis egestas. Turpis egestas sed tempus urna et pharetra
              pharetra. Cursus turpis massa tincidunt dui ut ornare lectus sit. Molestie a iaculis at erat
              pellentesque adipiscing commodo elit at. Fames ac turpis egestas sed tempus. Tellus at urna
              condimentum mattis.
            </p>

            <p>
              Pellentesque id nibh tortor id aliquet lectus. Ornare lectus sit amet est placerat in egestas
              erat imperdiet. Vitae turpis massa sed elementum tempus egestas sed. Neque ornare aenean euismod
              elementum nisi. Lectus mauris ultrices eros in cursus turpis massa. Risus viverra adipiscing at
              in tellus integer feugiat scelerisque varius. Fermentum et sollicitudin ac orci phasellus
              egestas tellus. Lacus viverra vitae congue eu consequat ac. Feugiat in ante metus dictum at
              tempor commodo ullamcorper. Non blandit massa enim nec dui nunc mattis enim.
            </p>

            <p>
              Eget duis at tellus at. Lacus luctus accumsan tortor posuere ac ut consequat semper viverra.
              Risus nec feugiat in fermentum posuere urna nec. Facilisi cras fermentum odio eu feugiat pretium
              nibh. Nullam vehicula ipsum a arcu cursus vitae congue. Id nibh tortor id aliquet lectus. Purus
              viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Proin sagittis nisl rhoncus mattis
              rhoncus urna neque. Enim sit amet venenatis urna cursus eget. Et malesuada fames ac turpis.
              Facilisis volutpat est velit egestas. Nulla facilisi cras fermentum odio. Non curabitur gravida
              arcu ac tortor dignissim convallis aenean. Phasellus egestas tellus rutrum tellus pellentesque.
              In est ante in nibh. Tristique risus nec feugiat in fermentum posuere urna nec tincidunt. Arcu
              non sodales neque sodales. Senectus et netus et malesuada fames ac turpis egestas sed. Tortor id
              aliquet lectus proin nibh nisl condimentum.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePage;
