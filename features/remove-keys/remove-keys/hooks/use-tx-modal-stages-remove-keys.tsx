import { Plural } from 'shared/components';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import {
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData,
} from '../context/types';

const getTxModalStagesRemoveKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (input: RemoveKeysFormInputType, _data: RemoveKeysFormNetworkData) =>
    transitStage(
      <TxStageSign
        title={`Removing ${input.selection.count} key(s)`}
        description=""
      />,
    ),

  pending: (
    input: RemoveKeysFormInputType,
    _data: RemoveKeysFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStagePending
        title={`Removing ${input.selection.count} key(s)`}
        description=""
        txHash={txHash}
      />,
    ),

  success: (
    input: RemoveKeysFormInputType,
    _data: RemoveKeysFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            {input.selection.count}{' '}
            <Plural variants={['key', 'keys']} value={input.selection.count} />{' '}
            has been removed
          </>
        }
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesRemoveKeys = () =>
  useTxCallbackStages<RemoveKeysFormInputType, RemoveKeysFormNetworkData>(
    getTxModalStagesRemoveKeys,
  );
