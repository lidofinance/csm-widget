import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';

type TxStageSignProps = {
  description: React.ReactNode;
  title: React.ReactNode;
};

export const TxStageSign = ({ title, description }: TxStageSignProps) => {
  return (
    <TransactionModalContent
      status="loading"
      title={title}
      description={description}
      footerHint="Confirm this transaction in your wallet"
    />
  );
};
