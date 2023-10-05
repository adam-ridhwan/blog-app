import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <>
      <div className='flex h-[100dvh] flex-row items-center justify-center gap-4 text-3xl text-muted'>
        <Loader2 className='h-10 w-10 animate-spin' />
        <span>Loading...</span>
      </div>
    </>
  );
};

export default Loading;
