'use client';

import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type QueryProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default QueryProvider;
