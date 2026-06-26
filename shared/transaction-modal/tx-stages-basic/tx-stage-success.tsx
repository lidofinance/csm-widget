import { type FC } from 'react';
import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';
import { StageIconSuccess } from './icons';

type TxStageSuccessProps = {
  txHash?: string | null;
  description: React.ReactNode;
  title: React.ReactNode;
  footer?: React.ReactNode;
  showEtherscan?: boolean;
};

export const TxStageSuccess: FC<TxStageSuccessProps> &
  ClosableOnLedgerStage = ({
  txHash,
  description,
  title,
  footer,
  showEtherscan = true,
}) => {
  return (
    <TransactionModalContent
      icon={<StageIconSuccess />}
      title={title}
      description={description}
      footerHint={
        showEtherscan && txHash && <TxLinkEtherscan txHash={txHash} />
      }
      footer={footer}
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageSuccess.isClosableOnLedger = true;
