import { FC } from 'react';
import { TxStageSign } from 'shared/transaction-modal';

export const TxStageMembersSignin: FC = () => (
  <TxStageSign
    title="Sign in"
    description="Sign the message to set up your cluster members after the transaction"
  />
);
