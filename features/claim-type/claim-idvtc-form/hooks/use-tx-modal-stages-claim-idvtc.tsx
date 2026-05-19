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
    (transitStage) => ({
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
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="IDVTC type has been successfully claimed"
            description=""
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
