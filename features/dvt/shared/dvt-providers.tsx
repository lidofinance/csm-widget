import { SiweAuthProvider } from 'modules/siwe';
import { surveysSignin } from 'modules/surveys-sdk';
import { FC, PropsWithChildren } from 'react';
import { DvtStateProvider } from './dvt-state-provider';

export const DvtProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider signin={surveysSignin}>
    <DvtStateProvider>{children}</DvtStateProvider>
  </SiweAuthProvider>
);
