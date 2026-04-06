import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import type {
  MetadataFormInputType,
  MetadataFormNetworkData,
} from '../context/types';

const getTxModalStagesMetadata = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (_input: MetadataFormInputType, _data: MetadataFormNetworkData) =>
    transitStage(
      <TxStageSign
        title="You are updating metadata"
        description="Name and description will be updated"
      />,
    ),

  pending: (
    _input: MetadataFormInputType,
    _data: MetadataFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStagePending
        title="Updating metadata"
        description="Name and description will be updated"
        txHash={txHash}
      />,
    ),

  success: (
    _input: MetadataFormInputType,
    _data: MetadataFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        title="Metadata has been updated"
        description="Name and description have been updated"
        txHash={txHash}
      />,
      { isClosableOnLedger: true },
    ),
});

export const useTxModalStagesMetadata = () =>
  useTxCallbackStages<MetadataFormInputType, MetadataFormNetworkData>(
    getTxModalStagesMetadata,
  );
