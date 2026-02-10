import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  feeSplits: FeeSplit[];
};

const getTexts = ({ feeSplits }: Props) =>
  feeSplits.length === 0
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
          description: `Setting ${feeSplits.length} additional recipient${feeSplits.length > 1 ? 's' : ''}`,
        },
        success: {
          title: 'Fee splitter configuration has been updated',
          description: `${feeSplits.length} additional recipient${feeSplits.length > 1 ? 's' : ''} configured`,
        },
      };

const getTxModalStagesSplits = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) =>
    transitStage(<TxStageSign {...getTexts(props).sign} />),

  pending: (props: Props, txHash?: string) =>
    transitStage(<TxStagePending {...getTexts(props).sign} txHash={txHash} />),

  success: (props: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess txHash={txHash} {...getTexts(props).success} />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesSplits = () =>
  useTransactionModalStage(getTxModalStagesSplits);
