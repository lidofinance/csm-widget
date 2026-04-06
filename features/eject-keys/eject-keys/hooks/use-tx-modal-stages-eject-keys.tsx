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
  EjectKeysFormInputType,
  EjectKeysFormNetworkData,
} from '../context/types';

const getTxModalStagesEjectKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (input: EjectKeysFormInputType, _data: EjectKeysFormNetworkData) =>
    transitStage(
      <TxStageSign
        title={`Ejecting ${input.selection.length} key(s)`}
        description=""
      />,
    ),

  pending: (
    input: EjectKeysFormInputType,
    _data: EjectKeysFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStagePending
        title={`Ejecting ${input.selection.length} key(s)`}
        description=""
        txHash={txHash}
      />,
    ),

  success: (
    input: EjectKeysFormInputType,
    _data: EjectKeysFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            {input.selection.length}{' '}
            <Plural variants={['key', 'keys']} value={input.selection.length} />{' '}
            has been ejected
          </>
        }
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesEjectKeys = () =>
  useTxCallbackStages<EjectKeysFormInputType, EjectKeysFormNetworkData>(
    getTxModalStagesEjectKeys,
  );
