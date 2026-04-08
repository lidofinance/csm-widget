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
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from '../context/types';

export const useTxModalStagesUnlockExpired = (): ((
  input: UnlockBondFormInputType,
  data: UnlockBondFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<void>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () => (_input, _data, onRetry: () => void) =>
      buildTxCallback<void>(
        {
          ...getGeneralTransactionModalStages(transitStage),
          sign: () =>
            transitStage(
              <TxStageSign
                title="Unlocking expired bond"
                description="Unlocking your expired bond lock"
              />,
            ),
          pending: (txHash) =>
            transitStage(
              <TxStagePending title="Unlocking expired bond" txHash={txHash} />,
            ),
          success: (_result, txHash) =>
            transitStage(
              <TxStageSuccess
                txHash={txHash}
                title="Expired bond lock has been unlocked"
                description={undefined}
              />,
              { isClosableOnLedger: true },
            ),
        },
        onRetry,
      ),
    [transitStage],
  );
};
