import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import type {
  MetadataFormInputType,
  MetadataFormNetworkData,
} from '../context/types';

export const useTxModalStagesMetadata = (): ((
  input: MetadataFormInputType,
  data: MetadataFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        _input: MetadataFormInputType,
        _data: MetadataFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="You are updating metadata"
                  description="Name and description will be updated"
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  title="Updating metadata"
                  description="Name and description will be updated"
                  txHash={txHash}
                />,
              ),
            success: (_result: undefined, txHash) =>
              transitStage(
                <TxStageSuccess
                  title="Metadata has been updated"
                  description="Name and description have been updated"
                  txHash={txHash}
                />,
                { isClosableOnLedger: true },
              ),
          },
          onRetry,
        ),
    [transitStage],
  );
};
