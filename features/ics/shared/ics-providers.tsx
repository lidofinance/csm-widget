import { SurveysAuthProvider } from 'modules/surveys-sdk';
import { FC, PropsWithChildren } from 'react';
import { IcsStateProvider } from './ics-state-provider';

export const IcsProviders: FC<PropsWithChildren> = ({ children }) => (
  <SurveysAuthProvider>
    <IcsStateProvider>{children}</IcsStateProvider>
  </SurveysAuthProvider>
);
