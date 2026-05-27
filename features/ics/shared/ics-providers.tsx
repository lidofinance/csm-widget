import { SiweAuthProvider } from 'modules/siwe';
import { surveysSignin } from 'modules/surveys-sdk';
import { FC, PropsWithChildren } from 'react';
import { IcsStateProvider } from './ics-state-provider';

export const IcsProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider signin={surveysSignin}>
    <IcsStateProvider>{children}</IcsStateProvider>
  </SiweAuthProvider>
);
