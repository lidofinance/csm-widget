import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { ShowSiwtchRules } from './types';
import { useNodeOperatorLockAmount } from 'shared/hooks';

export const useShowSwitchRules = () => {
  const nodeOperator = useActiveNodeOperator();

  const { data: lockedBond } = useNodeOperatorLockAmount(nodeOperator?.id);

  return useCallback(
    (condition: ShowSiwtchRules): boolean => {
      switch (condition) {
        case 'HAS_MANAGER':
          return !!nodeOperator?.roles.includes('MANAGER');
        case 'HAS_REWARDS':
          return !!nodeOperator?.roles.includes('REWARDS');
        case 'HAS_LOCKED_BOND':
          return !!lockedBond?.gt(0);
        default:
          return false;
      }
    },
    [lockedBond, nodeOperator?.roles],
  );
};
