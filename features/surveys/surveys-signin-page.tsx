import { FC } from 'react';

import { useDappStatus } from 'modules/web3';
import { SiweConnect, SiweSignIn } from './siwe-sign-in';

export const SurveysSignInPage: FC = () => {
  const { isAccountActive } = useDappStatus();

  return <>{isAccountActive ? <SiweSignIn /> : <SiweConnect />}</>;
};
