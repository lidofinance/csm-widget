import { useECSanityCheck } from 'dappnode/hooks/use-ec-sanity-check';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  useAccount,
  useCanCreateNodeOperator,
  useInvites,
  useIsReportStealingRole,
  useNodeOperatorLockAmount,
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

  // DAPPNODE
  | 'IS_EXECUTION_LOADING'
  | 'IS_EXECUTION_INSTALLED'
  | 'IS_EXECUTION_SYNCED'
  | 'EXECUTION_HAS_LOGS';

export const useShowRule = () => {
  const { active: isConnectedWallet } = useAccount();
  const { active: nodeOperator } = useNodeOperatorContext();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useIsReportStealingRole();
  const { data: lockedBond } = useNodeOperatorLockAmount(nodeOperator?.id);
  const canCreateNO = useCanCreateNodeOperator();

  // DAPPNODE
  const { isInstalled, isSynced, hasLogs } = useECSanityCheck();

  return useCallback(
    (condition: ShowRule): boolean => {
      switch (condition) {
        case 'IS_CONNECTED_WALLET':
          return isConnectedWallet;
        case 'NOT_NODE_OPERATOR':
          return !nodeOperator;
        case 'IS_NODE_OPERATOR':
          return !!nodeOperator;
        case 'CAN_CREATE':
          return !!canCreateNO;
        case 'HAS_MANAGER_ROLE':
          return !!nodeOperator?.roles.includes('MANAGER');
        case 'HAS_REWARDS_ROLE':
          return !!nodeOperator?.roles.includes('REWARDS');
        case 'HAS_INVITES':
          return !!invites?.length;
        case 'HAS_LOCKED_BOND':
          return !!lockedBond?.gt(0);
        case 'EL_STEALING_REPORTER':
          return !!isReportingRole;

        // DAPPNODE
        case 'IS_EXECUTION_INSTALLED':
          return isInstalled;
        case 'IS_EXECUTION_SYNCED':
          return isSynced;
        case 'EXECUTION_HAS_LOGS':
          return hasLogs;
        default:
          return false;
      }
    },
    [
      isConnectedWallet,
      nodeOperator,
      canCreateNO,
      invites?.length,
      lockedBond,
      isReportingRole,
      isInstalled,
      isSynced,
      hasLogs,
    ],
  );
};
