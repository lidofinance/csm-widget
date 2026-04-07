import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
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

const getTxModalStagesSplits = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (input: SplitsFormInputType, _data: SplitsFormNetworkData) =>
    transitStage(<TxStageSign {...getTexts(input).sign} />),

  pending: (
    input: SplitsFormInputType,
    _data: SplitsFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(<TxStagePending {...getTexts(input).sign} txHash={txHash} />),

  success: (
    input: SplitsFormInputType,
    _data: SplitsFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess txHash={txHash} {...getTexts(input).success} />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesSplits = () =>
  useTxCallbackStages<SplitsFormInputType, SplitsFormNetworkData>(
    getTxModalStagesSplits,
  );
