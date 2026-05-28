import { FC, PropsWithChildren } from 'react';
import { SiweAuthProvider } from 'shared/siwe';
import { IcsStateProvider } from './ics-state-provider';

export const IcsProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider>
    <IcsStateProvider>{children}</IcsStateProvider>
  </SiweAuthProvider>
);
