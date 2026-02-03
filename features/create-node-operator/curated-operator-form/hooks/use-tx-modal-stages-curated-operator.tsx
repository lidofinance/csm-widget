import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { getCurveMetadata } from 'consts';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
} from 'shared/transaction-modal/tx-stages-basic';
import { CuratedOperatorSuccessActions } from '../success-actions';

type SignPendingProps = {
  curveId: bigint;
};

type SuccessProps = {
  nodeOperatorId?: NodeOperatorId;
  curveId: bigint;
  availableGatesCount: number;
};

const getTxModalStagesCuratedOperator = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ curveId }: SignPendingProps) =>
    transitStage(
      <TxStageSign
        title="Creating Curated Node Operator"
        description={
          <>
            Creating operator for <b>{getCurveMetadata(curveId).name}</b>.
          </>
        }
      />,
    ),

  pending: ({ curveId }: SignPendingProps, txHash?: string) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="Creating Curated Node Operator"
        description={
          <>
            Creating operator for <b>{getCurveMetadata(curveId).name}</b>.
          </>
        }
      />,
    ),

  success: (
    { nodeOperatorId, availableGatesCount }: SuccessProps,
    txHash?: string,
  ) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Node Operator has been created"
        description={
          nodeOperatorId !== undefined ? (
            <>
              Your Node Operator ID is <b>{nodeOperatorId.toString()}</b>
            </>
          ) : undefined
        }
        footer={
          <CuratedOperatorSuccessActions
            availableGatesCount={availableGatesCount}
          />
        }
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalStagesCuratedOperator = () => {
  return useTransactionModalStage(getTxModalStagesCuratedOperator);
};
