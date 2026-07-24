import { TxStageMembersInitializing } from 'features/idvtc/members/tx-stages/tx-stage-members-initializing';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  ClaimIdvtcFormInputType,
  ClaimIdvtcFormNetworkData,
} from '../context/types';

export const useTxModalStagesClaimIdvtc = () =>
  useTxStages<ClaimIdvtcFormInputType, ClaimIdvtcFormNetworkData>(
    (transitStage, _input, data) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title="Claiming IDVTC type"
            description="Please confirm this transaction in your wallet"
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending title="Claiming IDVTC type" txHash={txHash} />,
        ),
      // When a members init is planned, hand off to its holding stage — the
      // flow runs the init after claimCurve resolves and renders the final
      // success (or the failed+retry stage) once it settles.
      success: (_result: undefined, txHash) => {
        if (data.willInitMembers) {
          return transitStage(<TxStageMembersInitializing />);
        }
        return transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="IDVTC type has been successfully claimed"
            description=""
          />,
        );
      },
    }),
  );
