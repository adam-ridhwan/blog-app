'use client';

import { FC, ReactNode } from 'react';
import { Provider } from 'jotai';

type JotaiProviderProps = {
  children: ReactNode;
};

const JotaiProvider: FC<JotaiProviderProps> = ({ children }) => {
  return (
    <>
      <Provider>{children}</Provider>
    </>
  );
};

export default JotaiProvider;
