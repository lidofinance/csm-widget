import { Text } from '@lidofinance/lido-ui';
import { Address as AddressComponent } from 'shared/components';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
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

export const useTxModalStagesClaimer = () =>
  useTxStages<ClaimerFormInputType, ClaimerFormNetworkData>(
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
