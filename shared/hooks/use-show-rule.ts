import { ROLES } from '@lidofinance/lido-csm-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import { ICS_APPLY_FORM } from 'config/feature-flags/types';
import { getExternalLinks } from 'consts/external-links';
import {
  useDappStatus,
  useHasReportStealingRole,
  useInvites,
  useNodeOperator,
  useOperatorBalance,
  useOperatorIsOwner,
  useOperatorKeysToMigrate,
} from 'modules/web3';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback, useMemo } from 'react';
import { useCanClaimICS, useCanCreateNodeOperator } from 'shared/hooks';

export type ShowRule =
  | 'IS_CONNECTED_WALLET'
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'HAS_INVITES'
  | 'HAS_KEYS_TO_TRANSFER'
  | 'HAS_MANAGER_ROLE'
  | 'HAS_REWARDS_ROLE'
  | 'HAS_OWNER_ROLE'
  | 'HAS_LOCKED_BOND'
  | 'HAS_REFERRER'
  | 'CAN_CREATE'
  | 'CAN_CLAIM_ICS'
  | 'ICS_APPLY_FORM'
  | 'CAN_APPLY_ICS'
  | 'EL_STEALING_REPORTER'
  | 'IS_SURVEYS_ACTIVE';

const { surveyApi } = getExternalLinks();

export const useShowRule = () => {
  const { isAccountActive, address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useHasReportStealingRole();
  const { data: balance } = useOperatorBalance(nodeOperator?.id);
  const { data: keysToTransfer } = useOperatorKeysToMigrate(nodeOperator?.id);
  const canClaimICS = useCanClaimICS();
  const canCreateNO = useCanCreateNodeOperator();
  const { referrer } = useModifyContext();
  const { data: isOwner } = useOperatorIsOwner({
    address,
    nodeOperatorId: nodeOperator?.id,
  });
  const featureFlags = useFeatureFlags();

  return useCallback(
    (condition: ShowRule): boolean => {
      switch (condition) {
        case 'IS_CONNECTED_WALLET':
          return isAccountActive;
        case 'NOT_NODE_OPERATOR':
          return isAccountActive && !nodeOperator;
        case 'IS_NODE_OPERATOR':
          return isAccountActive && !!nodeOperator;
        case 'CAN_CREATE':
          return !!canCreateNO;
        case 'HAS_MANAGER_ROLE':
          return !!nodeOperator?.roles.includes(ROLES.MANAGER);
        case 'HAS_REWARDS_ROLE':
          return !!nodeOperator?.roles.includes(ROLES.REWARDS);
        case 'HAS_OWNER_ROLE':
          return isAccountActive && !!isOwner;
        case 'HAS_INVITES':
          return !!invites?.length;
        case 'HAS_KEYS_TO_TRANSFER':
          return !!keysToTransfer;
        case 'HAS_LOCKED_BOND':
          return !!balance?.locked;
        case 'HAS_REFERRER':
          return !!referrer;
        case 'CAN_CLAIM_ICS':
          return !!canClaimICS && isAccountActive;
        case 'ICS_APPLY_FORM':
          return !!featureFlags?.[ICS_APPLY_FORM];
        case 'CAN_APPLY_ICS':
          return !!featureFlags?.[ICS_APPLY_FORM] && isAccountActive;
        case 'EL_STEALING_REPORTER':
          return !!isReportingRole;
        case 'IS_SURVEYS_ACTIVE':
          return !!nodeOperator && !!surveyApi && isAccountActive;
        default:
          return false;
      }
    },
    [
      isAccountActive,
      nodeOperator,
      canCreateNO,
      isOwner,
      invites?.length,
      keysToTransfer,
      balance?.locked,
      referrer,
      canClaimICS,
      featureFlags,
      isReportingRole,
    ],
  );
};

export const useFilterShowRules = <T extends { showRules?: ShowRule[] }>(
  items: T[],
) => {
  const check = useShowRule();

  return useMemo(
    () =>
      items.filter(
        ({ showRules }) => !showRules?.length || showRules.some(check),
      ),
    [check, items],
  );
};
