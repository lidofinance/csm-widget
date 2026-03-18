import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { ROLES_METADATA } from 'consts/roles';
import { capitalize } from 'lodash';
import { Address as AddressComponent } from 'shared/components';
import {
  AfterAddressProposed,
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { Address } from 'viem';
import { ChangeRoleMode } from '../context/types';

type Props = {
  address: Address;
  currentAddress: Address;
  role: ROLES;
  mode: ChangeRoleMode;
  isRevoke: boolean;
};

const getTexts = (props: Props) => {
  return props.mode === 'managerReset' || props.mode === 'rewardsChange'
    ? {
        sign: {
          title: `You are changing ${ROLES_METADATA[props.role].title} address`,
          description: (
            <>
              New {ROLES_METADATA[props.role].title} address is{' '}
              <Text size="xxs">
                <AddressComponent address={props.address} showIcon />
              </Text>
            </>
          ),
        },
        success: {
          title: `${capitalize(ROLES_METADATA[props.role].title)} address has been changed`,
          description: (
            <>
              New {ROLES_METADATA[props.role].title} address is{' '}
              <Text size="xxs">
                <AddressComponent address={props.address} showIcon />
              </Text>
            </>
          ),
        },
      }
    : props.isRevoke
      ? {
          sign: {
            title: `You are canceling request for ${ROLES_METADATA[props.role].title} address change`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <AddressComponent address={props.currentAddress} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `Proposed request for ${ROLES_METADATA[props.role].title} address has been canceled`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <AddressComponent address={props.currentAddress} showIcon />
                </Text>
              </>
            ),
          },
        }
      : {
          sign: {
            title: `You are proposing ${ROLES_METADATA[props.role].title} address change`,
            description: (
              <>
                Proposed address{' '}
                <Text size="xxs">
                  <AddressComponent address={props.address} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `New ${ROLES_METADATA[props.role].title} address has been proposed`,
            description: (
              <>
                <br />
                <br />
                <AfterAddressProposed address={props.address} />
              </>
            ),
          },
        };
};

const getTxModalStagesChangeRole = (
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

export const useTxModalStagesChangeRole = () =>
  useTransactionModalStage(getTxModalStagesChangeRole);
