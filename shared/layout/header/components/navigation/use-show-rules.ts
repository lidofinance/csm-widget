import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  useCanCreateNodeOperator,
  useInvites,
  useIsReportStealingRole,
} from 'shared/hooks';

export type ShowRules =
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'HAS_INVITES'
  | 'CAN_CREATE'
  | 'EL_STEALING_REPORTER';

export const useShowRules = () => {
  const { active } = useNodeOperatorContext();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useIsReportStealingRole();
  const canCreateNO = useCanCreateNodeOperator();

  return useCallback(
    (condition: ShowRules): boolean => {
      switch (condition) {
        case 'NOT_NODE_OPERATOR':
          return !active;
        case 'IS_NODE_OPERATOR':
          return !!active;
        case 'CAN_CREATE':
          return !canCreateNO;
        case 'HAS_INVITES':
          return !!invites?.length;
        case 'EL_STEALING_REPORTER':
          return !!isReportingRole;
        default:
          return false;
      }
    },
    [active, canCreateNO, invites?.length, isReportingRole],
  );
};
