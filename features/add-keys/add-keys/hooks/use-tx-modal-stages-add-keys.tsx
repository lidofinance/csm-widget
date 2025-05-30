import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk/common';
import {
  AfterKeysUpload,
  TransactionModalTransitStage,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { TxStageSignOperationKeys } from 'shared/transaction-modal/tx-stages-composed/tx-stage-keys-operation';

const STAGE_OPERATION_ARGS = {
  operationText: 'Uploading',
};

type Props = {
  keysCount: number;
  amount: bigint;
  token: TOKENS;
  nodeOperatorId: NodeOperatorId;
};

type SuccessProps = {
  keys: string[];
};

const getTxModalStagesAddKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={props.amount}
        token={props.token}
        keysCount={props.keysCount}
        nodeOperatorId={props.nodeOperatorId}
      />,
    ),

  pending: (props: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={props.amount}
        token={props.token}
        keysCount={props.keysCount}
        nodeOperatorId={props.nodeOperatorId}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ keys }: SuccessProps, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Your keys has been uploaded</>}
        description={
          <>
            Uploading operation was successful.
            <br />
            <br />
            <AfterKeysUpload keys={keys} />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAddKeys = () => {
  return useTransactionModalStage(getTxModalStagesAddKeys);
};
