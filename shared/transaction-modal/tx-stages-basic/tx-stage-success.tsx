import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconSuccess } from './icons';

type TxStageSuccessProps = {
  txHash?: string | null;
  description: React.ReactNode;
  title: React.ReactNode;
  footer?: React.ReactNode;
  showEtherscan?: boolean;
};

export const TxStageSuccess = ({
  txHash,
  description,
  title,
  footer,
  showEtherscan = true,
}: TxStageSuccessProps) => {
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
