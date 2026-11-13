import {
  TxStagePending,
  TxStageSign,
  useTxStages,
} from 'shared/transaction-modal';
import {
  ClaimIcsFormInputType,
  ClaimIcsFormNetworkData,
} from '../context/types';

export const useTxModalStagesClaimIcs = () =>
  useTxStages<ClaimIcsFormInputType, ClaimIcsFormNetworkData>(
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
      // Fires before claimCurve resolves; the flow closes the modal once the success screen is set
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStagePending title="Claiming ICS type" txHash={txHash} />,
        ),
    }),
  );
