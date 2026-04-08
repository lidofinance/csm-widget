import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  AfterKeysUpload,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import { TxStageSignOperationKeys } from 'shared/transaction-modal/tx-stages-composed/tx-stage-keys-operation';
import { AddKeysFormInputType, AddKeysFormNetworkData } from '../context/types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Uploading',
};

export const useTxModalStagesAddKeys = (): ((
  input: AddKeysFormInputType,
  data: AddKeysFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: AddKeysFormInputType,
        data: AddKeysFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSignOperationKeys
                  {...STAGE_OPERATION_ARGS}
                  amount={input.bondAmount ?? 0n}
                  token={input.token}
                  keysCount={input.depositData.length}
                  nodeOperatorId={data.nodeOperatorId}
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStageSignOperationKeys
                  {...STAGE_OPERATION_ARGS}
                  amount={input.bondAmount ?? 0n}
                  token={input.token}
                  keysCount={input.depositData.length}
                  nodeOperatorId={data.nodeOperatorId}
                  isPending
                  txHash={txHash}
                />,
              ),
            success: (_result, txHash) =>
              transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title={<>Your keys has been uploaded</>}
                  description={
                    <>
                      Uploading operation was successful.
                      <br />
                      <br />
                      <AfterKeysUpload
                        keys={input.depositData.map((key) => key.pubkey)}
                      />
                    </>
                  }
                />,
                {
                  isClosableOnLedger: true,
                },
              ),
          },
          onRetry,
        ),
    [transitStage],
  );
};
