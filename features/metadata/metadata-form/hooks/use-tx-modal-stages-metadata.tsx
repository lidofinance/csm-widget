import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import type {
  MetadataFormInputType,
  MetadataFormNetworkData,
} from '../context/types';

export const useTxModalStagesMetadata = () =>
  useTxStages<MetadataFormInputType, MetadataFormNetworkData>(
    (transitStage) => ({
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
    }),
  );
