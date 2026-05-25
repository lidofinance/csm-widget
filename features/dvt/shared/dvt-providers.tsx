import { FC, PropsWithChildren } from 'react';
import { SiweAuthProvider } from 'shared/siwe';
import { DvtStateProvider } from './dvt-state-provider';

const DVT_SIWE_CONTEXT = 'dvt';
const DVT_SIWE_STATEMENT = 'Sign in to use the IDVTC Apply form';

export const DvtProviders: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider
    contextName={DVT_SIWE_CONTEXT}
    statement={DVT_SIWE_STATEMENT}
  >
    <DvtStateProvider>{children}</DvtStateProvider>
  </SiweAuthProvider>
);
