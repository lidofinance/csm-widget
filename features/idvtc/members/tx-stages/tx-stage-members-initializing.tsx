import { FC } from 'react';
import { TxStagePending } from 'shared/transaction-modal';

export const TxStageMembersInitializing: FC = () => (
  <TxStagePending
    title="Initializing cluster members"
    description="Initializing your cluster members from your approved application…"
  />
);
