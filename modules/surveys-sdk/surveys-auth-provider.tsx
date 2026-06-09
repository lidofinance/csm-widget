import { SiweAuthProvider } from 'modules/siwe';
import { FC, PropsWithChildren } from 'react';
import { surveysGetNonce, surveysSignin } from './api/surveys-api';

// SIWE auth bound to the surveys API. Shared by the surveys, ICS, and DVT flows,
// which all authenticate against the same backend with one interchangeable token.
export const SurveysAuthProvider: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthProvider signin={surveysSignin} getNonce={surveysGetNonce}>
    {children}
  </SiweAuthProvider>
);
