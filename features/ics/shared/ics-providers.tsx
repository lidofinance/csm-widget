import { FC, PropsWithChildren } from 'react';
import { IcsStateProvider } from './ics-state-provider';

export const IcsProviders: FC<PropsWithChildren> = ({ children }) => (
  <IcsStateProvider>{children}</IcsStateProvider>
);
