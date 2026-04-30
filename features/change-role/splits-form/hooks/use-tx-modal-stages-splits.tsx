import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import { SplitsFormInputType, SplitsFormNetworkData } from '../context/types';

const getTexts = (input: SplitsFormInputType) =>
  input.feeSplits.length === 0
    ? {
        sign: {
          title: 'You are removing fee splitter',
          description: 'All rewards will go to the Rewards Address',
        },
        success: {
          title: 'Fee splitter has been removed',
          description: 'All rewards will go to the Rewards Address',
        },
      }
    : {
        sign: {
          title: 'You are updating fee splitter configuration',
          description: `Setting ${input.feeSplits.length} additional recipient${input.feeSplits.length > 1 ? 's' : ''}`,
        },
        success: {
          title: 'Fee splitter configuration has been updated',
          description: `${input.feeSplits.length} additional recipient${input.feeSplits.length > 1 ? 's' : ''} configured`,
        },
      };

export const useTxModalStagesSplits = () =>
  useTxStages<SplitsFormInputType, SplitsFormNetworkData>(
    (transitStage, input) => ({
      sign: () => transitStage(<TxStageSign {...getTexts(input).sign} />),
      pending: (txHash) =>
        transitStage(
          <TxStagePending {...getTexts(input).sign} txHash={txHash} />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess txHash={txHash} {...getTexts(input).success} />,
          { isClosableOnLedger: true },
        ),
    }),
  );
