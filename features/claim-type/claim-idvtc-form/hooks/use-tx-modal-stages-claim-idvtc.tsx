import { TxStageMembersInitializing } from 'features/idvtc/members/tx-stages/tx-stage-members-initializing';
import {
  TxStagePending,
  TxStageSign,
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
      // Fires before claimCurve resolves; the flow closes the modal once the success screen is set
      success: (_result: undefined, txHash) => {
        if (data.willInitMembers) {
          return transitStage(<TxStageMembersInitializing />);
        }
        return transitStage(
          <TxStagePending title="Claiming IDVTC type" txHash={txHash} />,
        );
      },
    }),
  );
