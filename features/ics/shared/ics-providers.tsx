import { FC, PropsWithChildren } from 'react';
import { SiweAuthProvider } from 'shared/siwe';
import { IcsStateProvider } from './ics-state-provider';

const ICS_SIWE_CONTEXT = 'ics';
const ICS_SIWE_STATEMENT = 'Sign in to use the ICS Apply form';

export const IcsProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider
    contextName={ICS_SIWE_CONTEXT}
    statement={ICS_SIWE_STATEMENT}
  >
    <IcsStateProvider>{children}</IcsStateProvider>
  </SiweAuthProvider>
);
