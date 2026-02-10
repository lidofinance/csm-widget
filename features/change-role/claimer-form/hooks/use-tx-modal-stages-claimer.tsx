import { Text } from '@lidofinance/lido-ui';
import { Address as AddressComponent } from 'shared/components';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { Address } from 'viem';

type Props = {
  claimerAddress: Address;
  isUnset: boolean;
};

const getTexts = ({ claimerAddress, isUnset }: Props) =>
  isUnset
    ? {
        sign: {
          title: 'You are unsetting Rewards claimer',
          description: 'Rewards claimer delegation will be removed',
        },
        success: {
          title: 'Rewards claimer has been unset',
          description: 'Rewards claimer delegation has been removed',
        },
      }
    : {
        sign: {
          title: 'You are setting Rewards claimer address',
          description: (
            <>
              New Rewards claimer address is{' '}
              <Text size="xxs">
                <AddressComponent address={claimerAddress} showIcon />
              </Text>
            </>
          ),
        },
        success: {
          title: 'Rewards claimer address has been set',
          description: (
            <>
              New Rewards claimer address is{' '}
              <Text size="xxs">
                <AddressComponent address={claimerAddress} showIcon />
              </Text>
            </>
          ),
        },
      };

const getTxModalStagesClaimer = (
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

export const useTxModalStagesClaimer = () =>
  useTransactionModalStage(getTxModalStagesClaimer);
