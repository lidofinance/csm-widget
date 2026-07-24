import { FC } from 'react';
import { SiweSignInPage } from 'shared/wallet';

export const MembersSignInPage: FC = () => (
  <SiweSignInPage connectDescription="Connect your wallet and sign a verification message to manage your cluster members">
    Sign in to verify your identity and manage your cluster members
  </SiweSignInPage>
);
