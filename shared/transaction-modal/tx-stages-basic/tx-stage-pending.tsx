import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';

type TxStagePendingProps = {
  description?: React.ReactNode;
  title: React.ReactNode;
  txHash?: string | null;
};

export const TxStagePending = ({
  title,
  description,
  txHash,
}: TxStagePendingProps) => {
  return (
    <TransactionModalContent
      status="loading"
      title={title}
      description={description || 'Awaiting block confirmation'}
      footerHint={txHash && <TxLinkEtherscan txHash={txHash} />}
    />
  );
};
