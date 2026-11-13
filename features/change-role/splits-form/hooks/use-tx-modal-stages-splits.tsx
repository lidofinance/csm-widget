import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import { SplitsFormInputType, SplitsFormNetworkData } from '../context/types';
import { getSplitsStageTexts } from '../splits-state';

export const useTxModalStagesSplits = () =>
  useTxStages<SplitsFormInputType, SplitsFormNetworkData>(
    (transitStage, input) => {
      const texts = getSplitsStageTexts(input.feeSplits.length);

      return {
        sign: () => transitStage(<TxStageSign {...texts.sign} />),
        pending: (txHash) =>
          transitStage(<TxStagePending {...texts.sign} txHash={txHash} />),
        success: (_result: undefined, txHash) =>
          transitStage(<TxStageSuccess txHash={txHash} {...texts.success} />),
      };
    },
  );
