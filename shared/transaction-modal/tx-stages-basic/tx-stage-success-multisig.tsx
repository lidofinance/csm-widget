import { type FC } from 'react';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';

export const TxStageSuccessMultisig: FC & ClosableOnLedgerStage = () => {
  return (
    <TransactionModalContent
      status="success"
      title="Success"
      description="Your transaction has been successfully created in the multisig wallet and awaits approval from other participants"
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageSuccessMultisig.isClosableOnLedger = true;

export const TxStageSuccessMultisigApprove: FC & ClosableOnLedgerStage = () => (
  <TransactionModalContent
    status="success"
    title="Approval created"
    description="The token approval has been created in the multisig wallet and awaits approval from other participants. Once it is executed, submit this transaction again."
  />
);

TxStageSuccessMultisigApprove.isClosableOnLedger = true;
