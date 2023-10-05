import * as React from 'react';
import { FC } from 'react';
import { cn } from '@/util/cn';

type OverlayProps = {
  isOpen: boolean;
  className?: string;
};

const Overlay: FC<OverlayProps> = ({ isOpen, className }) => {
  return (
    <>
      <div
        className={cn(`fixed bottom-0 left-0 right-0 top-0 z-50 h-[100vh] w-[100vw] bg-transparent`, {
          hidden: !isOpen,
          className,
        })}
      >
        Overlay
      </div>
    </>
  );
};

export default Overlay;
