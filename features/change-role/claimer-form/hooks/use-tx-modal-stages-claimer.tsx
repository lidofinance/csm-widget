import { Text } from '@lidofinance/lido-ui';
import { Address as AddressComponent } from 'shared/components';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import { zeroAddress } from 'viem';
import { ClaimerFormInputType, ClaimerFormNetworkData } from '../context/types';

const getTexts = (input: ClaimerFormInputType) => {
  const claimerAddress = input.isUnset
    ? zeroAddress
    : (input.address ?? zeroAddress);

  return input.isUnset
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
};

const getTxModalStagesClaimer = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (input: ClaimerFormInputType, _data: ClaimerFormNetworkData) =>
    transitStage(<TxStageSign {...getTexts(input).sign} />),

  pending: (
    input: ClaimerFormInputType,
    _data: ClaimerFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(<TxStagePending {...getTexts(input).sign} txHash={txHash} />),

  success: (
    input: ClaimerFormInputType,
    _data: ClaimerFormNetworkData,
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

export const useTxModalStagesClaimer = () =>
  useTxCallbackStages<ClaimerFormInputType, ClaimerFormNetworkData>(
    getTxModalStagesClaimer,
  );
