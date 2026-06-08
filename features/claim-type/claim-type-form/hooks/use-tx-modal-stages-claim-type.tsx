import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  ClaimTypeFormInputType,
  ClaimTypeFormNetworkData,
} from '../context/types';

export const useTxModalStagesClaimType = () =>
  useTxStages<ClaimTypeFormInputType, ClaimTypeFormNetworkData>(
    (transitStage) => ({
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
    }),
  );
