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

const getTxModalStagesRemoveKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) =>
    transitStage(
      <TxStageSign
        title={`Removing ${props.keysCount} key(s)`}
        description=""
      />,
    ),

  pending: (props: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`Removing ${props.keysCount} key(s)`}
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
            <Plural variants={['key', 'keys']} value={props.keysCount} /> are
            removed
          </>
        }
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesRemoveKeys = () => {
  return useTransactionModalStage(getTxModalStagesRemoveKeys);
};
