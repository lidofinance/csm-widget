import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';

export const TxStagePermit = () => {
  return (
    <TransactionModalContent
      status="loading"
      title="Please sign the message"
      description="Processing your request"
      footerHint="Confirm request in your wallet"
    />
  );
};
