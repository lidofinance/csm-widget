import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { Plural } from 'shared/components';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData,
} from '../context/types';

export const useTxModalStagesRemoveKeys = (): ((
  input: RemoveKeysFormInputType,
  data: RemoveKeysFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: RemoveKeysFormInputType,
        _data: RemoveKeysFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title={`Removing ${input.selection.count} key(s)`}
                  description=""
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  title={`Removing ${input.selection.count} key(s)`}
                  description=""
                  txHash={txHash}
                />,
              ),
            success: (_result: undefined, txHash) =>
              transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title={
                    <>
                      {input.selection.count}{' '}
                      <Plural
                        variants={['key', 'keys']}
                        value={input.selection.count}
                      />{' '}
                      has been removed
                    </>
                  }
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
