import { SurveysAuthProvider } from 'modules/surveys-sdk';
import { FC, PropsWithChildren } from 'react';
import { DvtStateProvider } from './dvt-state-provider';

export const DvtProviders: FC<PropsWithChildren> = ({ children }) => (
  <SurveysAuthProvider>
    <DvtStateProvider>{children}</DvtStateProvider>
  </SurveysAuthProvider>
);
