import { FC } from 'react';
import { Dot } from 'lucide-react';

type SeparatorDotProps = {
  number?: number;
};

const SeparatorDot: FC<SeparatorDotProps> = ({ number }) => {
  return (
    <>
      <Dot size={number || 15} />
    </>
  );
};

export default SeparatorDot;
