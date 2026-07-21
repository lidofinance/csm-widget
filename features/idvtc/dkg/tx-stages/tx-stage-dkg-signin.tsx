import { FC } from 'react';
import { TxStageSign } from 'shared/transaction-modal';

export const TxStageDkgSignin: FC = () => (
  <TxStageSign
    title="Sign in"
    description="Sign the message to upload your DKG files before the transaction"
  />
);
