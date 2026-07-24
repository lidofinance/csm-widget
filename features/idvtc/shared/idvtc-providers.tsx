import { FC, PropsWithChildren } from 'react';
import { IdvtcStateProvider } from './idvtc-state-provider';

export const IdvtcProviders: FC<PropsWithChildren> = ({ children }) => (
  <IdvtcStateProvider>{children}</IdvtcStateProvider>
);
