import { FC } from 'react';
import { SiweSignInPage } from 'shared/wallet';

export const DkgSignInPage: FC = () => (
  <SiweSignInPage connectDescription="Connect your wallet and sign a verification message to manage your DKG files">
    Sign in to verify your identity and manage your DKG files
  </SiweSignInPage>
);
