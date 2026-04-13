import { type NodeOperatorShortInfo, ROLES } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { ROLES_METADATA } from 'consts/roles';
import { Address as AddressComponent } from 'shared/components';
import { type ChangeRoleMode, useChangeRoleMode } from 'shared/hooks';
import {
  AfterAddressProposed,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import { zeroAddress } from 'viem';
import {
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
} from '../context/types';

const getTexts = (
  input: ChangeRoleFormInputType,
  data: ChangeRoleFormNetworkData,
  mode: ChangeRoleMode,
) => {
  const address = input.isRevoke ? zeroAddress : (input.address ?? zeroAddress);

  return mode === 'managerReset' || mode === 'rewardsChange'
    ? {
        sign: {
          title: `You are changing ${ROLES_METADATA[data.role].capitalizedTitle} Address`,
          description: (
            <>
              New {ROLES_METADATA[data.role].capitalizedTitle} Address is{' '}
              <Text size="xxs">
                <AddressComponent address={address} showIcon />
              </Text>
            </>
          ),
        },
        success: {
          title: `${ROLES_METADATA[data.role].capitalizedTitle} Address has been changed`,
          description: (
            <>
              New {ROLES_METADATA[data.role].capitalizedTitle} Address is{' '}
              <Text size="xxs">
                <AddressComponent address={address} showIcon />
              </Text>
            </>
          ),
        },
      }
    : input.isRevoke
      ? {
          sign: {
            title: `You are canceling request for ${ROLES_METADATA[data.role].capitalizedTitle} Address change`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <AddressComponent address={data.currentAddress} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `Proposed request for ${ROLES_METADATA[data.role].capitalizedTitle} Address has been canceled`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <AddressComponent address={data.currentAddress} showIcon />
                </Text>
              </>
            ),
          },
        }
      : {
          sign: {
            title: `You are proposing ${ROLES_METADATA[data.role].capitalizedTitle} Address change`,
            description: (
              <>
                Proposed address{' '}
                <Text size="xxs">
                  <AddressComponent address={address} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `New ${ROLES_METADATA[data.role].capitalizedTitle} Address has been proposed`,
            description: (
              <>
                <br />
                <br />
                <AfterAddressProposed address={address} />
              </>
            ),
          },
        };
};

export const useTxModalStagesChangeRole = (role: ROLES) => {
  const mode = useChangeRoleMode(role);

  return useTxStages<
    ChangeRoleFormInputType,
    ChangeRoleFormNetworkData,
    NodeOperatorShortInfo
  >(
    (transitStage, input, data) => ({
      sign: () =>
        transitStage(<TxStageSign {...getTexts(input, data, mode).sign} />),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            {...getTexts(input, data, mode).sign}
            txHash={txHash}
          />,
        ),
      success: (_result: NodeOperatorShortInfo, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            {...getTexts(input, data, mode).success}
          />,
          { isClosableOnLedger: true },
        ),
    }),
    [mode],
  );
};
