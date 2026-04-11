import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from '../context/types';

export const useTxModalStagesUnlockExpired = () =>
  useTxStages<UnlockBondFormInputType, UnlockBondFormNetworkData, void>(
    (transitStage) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title="Unlocking expired bond"
            description="Unlocking your expired bond lock"
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending title="Unlocking expired bond" txHash={txHash} />,
        ),
      success: (_result, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="Expired bond lock has been unlocked"
            description={undefined}
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
