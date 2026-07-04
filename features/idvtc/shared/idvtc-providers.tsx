import { SurveysAuthProvider } from 'modules/surveys-sdk';
import { FC, PropsWithChildren } from 'react';
import { IdvtcStateProvider } from './idvtc-state-provider';

export const IdvtcProviders: FC<PropsWithChildren> = ({ children }) => (
  <SurveysAuthProvider>
    <IdvtcStateProvider>{children}</IdvtcStateProvider>
  </SurveysAuthProvider>
);
