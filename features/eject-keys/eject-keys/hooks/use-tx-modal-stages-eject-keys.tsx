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
  EjectKeysFormInputType,
  EjectKeysFormNetworkData,
} from '../context/types';

export const useTxModalStagesEjectKeys = (): ((
  input: EjectKeysFormInputType,
  data: EjectKeysFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: EjectKeysFormInputType,
        _data: EjectKeysFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title={`Ejecting ${input.selection.length} key(s)`}
                  description=""
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  title={`Ejecting ${input.selection.length} key(s)`}
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
                      {input.selection.length}{' '}
                      <Plural
                        variants={['key', 'keys']}
                        value={input.selection.length}
                      />{' '}
                      has been ejected
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
