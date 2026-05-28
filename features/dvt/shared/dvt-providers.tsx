import { FC, PropsWithChildren } from 'react';
import { SiweAuthProvider } from 'shared/siwe';
import { DvtStateProvider } from './dvt-state-provider';

export const DvtProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider>
    <DvtStateProvider>{children}</DvtStateProvider>
  </SiweAuthProvider>
);
