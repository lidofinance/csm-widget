import { type FC } from 'react';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';
import { StageIconSuccess } from './icons';

export const TxStageSuccessMultisig: FC & ClosableOnLedgerStage = () => {
  return (
    <TransactionModalContent
      icon={<StageIconSuccess />}
      title="Success"
      description="Your transaction has been successfully created in the multisig wallet and awaits approval from other participants"
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageSuccessMultisig.isClosableOnLedger = true;
