import { FC } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeparatorDot from '@/components/ui/separator-dot';

type MenuPostsProps = {};

const EditorPosts: FC<MenuPostsProps> = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Chosen by editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-[20px] md:grid md:grid-cols-2 lg:flex lg:flex-col'>
            <Link href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <span className='text-muted-foreground text-ellipsis text-lg font-semibold text-primary'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </span>
                <div className='flex flex-row items-center gap-1 text-muted'>
                  <span>John Doe</span>
                  <SeparatorDot />
                  <span>10.01.2023</span>
                </div>
              </div>
            </Link>

            <Link href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <span className='text-muted-foreground text-ellipsis text-lg font-semibold text-primary'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </span>
                <div className='flex flex-row items-center gap-1 text-muted'>
                  <span>John Doe</span>
                  <SeparatorDot />
                  <span>10.01.2023</span>
                </div>
              </div>
            </Link>

            <Link href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <span className='text-muted-foreground text-ellipsis text-lg font-semibold text-primary'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </span>
                <div className='flex flex-row items-center gap-1 text-muted'>
                  <span>John Doe</span>
                  <SeparatorDot />
                  <span>10.01.2023</span>
                </div>
              </div>
            </Link>

            <Link href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <span className='text-muted-foreground text-ellipsis text-lg font-semibold text-primary'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </span>
                <div className='flex flex-row items-center gap-1 text-muted'>
                  <span>John Doe</span>
                  <SeparatorDot />
                  <span>10.01.2023</span>
                </div>
              </div>
            </Link>

            <Link href='/' className='flex items-center gap-[20px]'>
              <div className='flex flex-[4] flex-col gap-[5px]'>
                <span className='text-muted-foreground text-ellipsis text-lg font-semibold text-primary'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </span>
                <div className='flex flex-row items-center gap-1 text-muted'>
                  <span>John Doe</span>
                  <SeparatorDot />
                  <span>10.01.2023</span>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>

        <CardFooter>
          <Link
            href='/'
            className='flex h-[40px] w-full items-center justify-center rounded-full border border-border
                bg-transparent text-muted underline-offset-4 hover:underline'
          >
            See more
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default EditorPosts;
