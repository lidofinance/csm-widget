import { Text } from '@lidofinance/lido-ui';
import { ROLES } from 'consts/roles';
import { capitalize } from 'lodash';
import { Address } from 'shared/components';
import { getRoleTitle } from 'shared/node-operator';
import {
  AfterAddressProposed,
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  address: string;
  currentAddress: string;
  role: ROLES;
  isManagerReset: boolean;
  isRewardsChange: boolean;
  isPropose: boolean;
  isRevoke: boolean;
};

const getTexts = (props: Props) => {
  return props.isManagerReset || props.isRewardsChange
    ? {
        sign: {
          title: `You are changing ${getRoleTitle(props.role)} address`,
          description: (
            <>
              New ${getRoleTitle(props.role)} address is{' '}
              <Text size="xxs">
                <Address address={props.address} showIcon />
              </Text>
            </>
          ),
        },
        success: {
          title: `${capitalize(getRoleTitle(props.role))} address has been changed`,
          description: (
            <>
              New ${getRoleTitle(props.role)} address is{' '}
              <Text size="xxs">
                <Address address={props.address} showIcon />
              </Text>
            </>
          ),
        },
      }
    : props.isRevoke
      ? {
          sign: {
            title: `You are revoking request for ${getRoleTitle(props.role)} address change`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <Address address={props.address} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `Proposed request for ${getRoleTitle(props.role)} address has been revoked`,
            description: (
              <>
                Address stays{' '}
                <Text size="xxs">
                  <Address address={props.address} showIcon />
                </Text>
              </>
            ),
          },
        }
      : {
          sign: {
            title: `You are proposing ${getRoleTitle(props.role)} address change`,
            description: (
              <>
                Proposed address{' '}
                <Text size="xxs">
                  <Address address={props.address} showIcon />
                </Text>
              </>
            ),
          },
          success: {
            title: `New ${getRoleTitle(props.role)} address has been proposed`,
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
