'use client';

import { FC, ReactNode, useEffect } from 'react';
import { atom, useAtom, useSetAtom } from 'jotai';
import { SessionProvider } from 'next-auth/react';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default AuthProvider;
