import {
  type NodeOperatorShortInfo,
  ROLES,
  type TransactionCallback,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { getCurveMetadata } from 'consts';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from '../context/types';
import { CuratedOperatorCustomAddressActions } from '../custom-address-actions';
import { CuratedOperatorSuccessActions } from '../success-actions';

export const useTxModalStagesCuratedOperator = (): ((
  input: CuratedOperatorFormInputType,
  data: CuratedOperatorFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<NodeOperatorShortInfo>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: CuratedOperatorFormInputType,
        data: CuratedOperatorFormNetworkData,
        onRetry: () => void,
      ) => {
        const selectedGate = data.availableGates.find(
          (gate) => gate.gateIndex === input.gateIndex,
        );
        const curveId = selectedGate?.curveId ?? 0n;

        return buildTxCallback<NodeOperatorShortInfo>(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="Creating Curated Node Operator"
                  description={
                    <>
                      Creating operator for{' '}
                      <b>{getCurveMetadata(curveId).name}</b>
                    </>
                  }
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  txHash={txHash}
                  title="Creating Curated Node Operator"
                  description={
                    <>
                      Creating operator for{' '}
                      <b>{getCurveMetadata(curveId).name}</b>
                    </>
                  }
                />,
              ),
            success: (result, txHash) => {
              const roles = result
                ? getNodeOperatorRoles(result, data.address)
                : [];
              const hasAnyRole = roles.length > 0;
              const hasManagerRole = roles.includes(ROLES.MANAGER);

              return transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title="Node Operator has been created"
                  description={
                    result?.nodeOperatorId !== undefined ? (
                      <>
                        Your Node Operator ID is{' '}
                        <b>{result.nodeOperatorId.toString()}</b>
                      </>
                    ) : undefined
                  }
                  footer={
                    hasAnyRole ? (
                      <CuratedOperatorSuccessActions
                        availableGatesCount={data.availableGates.length}
                        hasManagerRole={hasManagerRole}
                      />
                    ) : (
                      <CuratedOperatorCustomAddressActions
                        availableGatesCount={data.availableGates.length}
                      />
                    )
                  }
                />,
                {
                  isClosableOnLedger: true,
                },
              );
            },
          },
          onRetry,
        );
      },
    [transitStage],
  );
};
