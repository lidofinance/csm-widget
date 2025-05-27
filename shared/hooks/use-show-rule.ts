import { ROLES } from '@lidofinance/lido-csm-sdk/common';
import { getExternalLinks } from 'consts/external-links';
import { useNodeOperator, useOperatorBalance } from 'modules/web3';
import { useCallback } from 'react';
import {
  useAccount,
  useCanCreateNodeOperator,
  useInvites,
  useIsReportStealingRole,
} from 'shared/hooks';

export type ShowRule =
  | 'IS_CONNECTED_WALLET'
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'HAS_INVITES'
  | 'HAS_MANAGER_ROLE'
  | 'HAS_REWARDS_ROLE'
  | 'HAS_LOCKED_BOND'
  | 'CAN_CREATE'
  | 'EL_STEALING_REPORTER'
  | 'IS_SURVEYS_ACTIVE';

const { surveyApi } = getExternalLinks();

export const useShowRule = () => {
  const { active: isConnectedWallet } = useAccount();
  const { nodeOperator } = useNodeOperator();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useIsReportStealingRole();
  const { data: balance } = useOperatorBalance(nodeOperator?.id);
  const canCreateNO = useCanCreateNodeOperator();

  return useCallback(
    (condition: ShowRule): boolean => {
      switch (condition) {
        case 'IS_CONNECTED_WALLET':
          return isConnectedWallet;
        case 'NOT_NODE_OPERATOR':
          return isConnectedWallet && !nodeOperator;
        case 'IS_NODE_OPERATOR':
          return !!nodeOperator && isConnectedWallet;
        case 'CAN_CREATE':
          return !!canCreateNO;
        case 'HAS_MANAGER_ROLE':
          return !!nodeOperator?.roles.includes(ROLES.MANAGER);
        case 'HAS_REWARDS_ROLE':
          return !!nodeOperator?.roles.includes(ROLES.REWARDS);
        case 'HAS_INVITES':
          return !!invites?.length;
        case 'HAS_LOCKED_BOND':
          return !!balance?.locked;
        case 'EL_STEALING_REPORTER':
          return !!isReportingRole;
        case 'IS_SURVEYS_ACTIVE':
          return !!nodeOperator && !!surveyApi;
        default:
          return false;
      }
    },
    [
      isConnectedWallet,
      nodeOperator,
      canCreateNO,
      invites?.length,
      balance?.locked,
      isReportingRole,
    ],
  );
};
