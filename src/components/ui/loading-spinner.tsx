import * as React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <>
      <Loader2 className='h-5 w-5 animate-spin' />
    </>
  );
};

export default LoadingSpinner;
