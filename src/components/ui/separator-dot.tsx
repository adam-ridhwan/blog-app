import { FC } from 'react';
import { cn } from '@/util/cn';
import { Dot } from 'lucide-react';

type SeparatorDotProps = {
  number?: number;
  className?: string;
};

const SeparatorDot: FC<SeparatorDotProps> = ({ number, className }) => {
  return (
    <>
      <Dot size={number || 15} className={cn(`w-3`, className)} />
    </>
  );
};

export default SeparatorDot;
