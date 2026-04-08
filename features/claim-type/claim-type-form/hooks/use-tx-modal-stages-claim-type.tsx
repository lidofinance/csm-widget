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
import {
  ClaimTypeFormInputType,
  ClaimTypeFormNetworkData,
} from '../context/types';

export const useTxModalStagesClaimType = (): ((
  input: ClaimTypeFormInputType,
  data: ClaimTypeFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        _input: ClaimTypeFormInputType,
        _data: ClaimTypeFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="Claiming ICS type"
                  description="Please confirm this transaction in your wallet"
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending title="Claiming ICS type" txHash={txHash} />,
              ),
            success: (_result: undefined, txHash) =>
              transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title="ICS type has been successfully claimed"
                  description=""
                />,
                { isClosableOnLedger: true },
              ),
          },
          onRetry,
        ),
    [transitStage],
  );
};
