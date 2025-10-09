import { Plural } from 'shared/components';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  keysCount: number;
};

const getTxModalStagesTransferKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) =>
    transitStage(
      <TxStageSign
        title={`Transfering ${props.keysCount} key(s) to priority queue`}
        description=""
      />,
    ),

  pending: (props: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`Transfering ${props.keysCount} key(s) to priority queue`}
        description=""
        txHash={txHash}
      />,
    ),

  success: (props: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            {props.keysCount}{' '}
            <Plural variants={['key', 'keys']} value={props.keysCount} /> has
            been transfered to priority queue
          </>
        }
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),

  signCleanup: () =>
    transitStage(
      <TxStageSign
        title={`Cleaning up batches in legacy queue`}
        description=""
      />,
    ),

  pendingCleanup: (txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`Cleaning up batches in legacy queue`}
        description=""
        txHash={txHash}
      />,
    ),

  successCleanup: (props: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            {props.keysCount}{' '}
            <Plural variants={['key', 'keys']} value={props.keysCount} /> has
            been transfered to priority queue
          </>
        }
        description="And legacy queue has been cleaned up"
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesTransferKeys = () => {
  return useTransactionModalStage(getTxModalStagesTransferKeys);
};
