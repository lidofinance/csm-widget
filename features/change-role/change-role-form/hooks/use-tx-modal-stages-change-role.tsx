import { ROLES } from 'consts/roles';
import { capitalize } from 'lodash';
import { getRoleTitle } from 'shared/node-operator';
import {
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

// TODO: show address with <Address> component
const getTexts = (props: Props) => {
  return props.isManagerReset || props.isRewardsChange
    ? {
        sign: {
          title: `You are changing ${getRoleTitle(props.role)} address`,
          description: `New address ${props.address}`,
        },
        success: {
          title: `${capitalize(getRoleTitle(props.role))} address has been changed`,
          description: `New address ${props.address}`,
        },
      }
    : props.isRevoke
      ? {
          sign: {
            title: `You are revoking request for ${getRoleTitle(props.role)} address change`,
            description: `Address stays ${props.currentAddress}`,
          },
          success: {
            title: `Proposed request for ${getRoleTitle(props.role)} address has been revoked`,
            description: `Address stays ${props.currentAddress}`,
          },
        }
      : {
          sign: {
            title: `You are proposing ${getRoleTitle(props.role)} address change`,
            description: `Proposed address ${props.address}`,
          },
          success: {
            title: `New ${getRoleTitle(props.role)} address has been proposed`,
            description: `To complete the address change, the owner of the new address must confirm the change`,
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
