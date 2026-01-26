import { ROLES } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import {
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
} from 'config/feature-flags/types';
import { getExternalLinks } from 'consts/external-links';
import { useWrappedApi } from 'features/wrapped/data';
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
  | 'IS_MAINNET'
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
  | 'ICS_APPLY_ENABLED'
  | 'EL_STEALING_REPORTER'
  | 'IS_SURVEYS_ACTIVE'
  | 'HAS_WRAPPED_DATA';

export type ShowFlags = Record<ShowRule, boolean>;

const { surveyApi } = getExternalLinks();

export const useShowFlags = (): ShowFlags => {
  const { isAccountActive, address, chainId } = useDappStatus();
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
  const { data: wrappedData } = useWrappedApi(nodeOperator?.id);

  return useMemo(
    () => ({
      ['IS_MAINNET']: chainId === CHAINS.Mainnet,
      ['IS_CONNECTED_WALLET']: isAccountActive,
      ['NOT_NODE_OPERATOR']: !nodeOperator,
      ['IS_NODE_OPERATOR']: isAccountActive && !!nodeOperator,
      ['CAN_CREATE']: !!canCreateNO,
      ['HAS_MANAGER_ROLE']: !!nodeOperator?.roles?.includes(ROLES.MANAGER),
      ['HAS_REWARDS_ROLE']: !!nodeOperator?.roles?.includes(ROLES.REWARDS),
      ['HAS_OWNER_ROLE']: isAccountActive && !!isOwner,
      ['HAS_INVITES']: !!invites?.length,
      ['HAS_KEYS_TO_TRANSFER']: !!keysToTransfer,
      ['HAS_LOCKED_BOND']: !!balance?.locked,
      ['HAS_REFERRER']: !!referrer,
      ['CAN_CLAIM_ICS']: !!canClaimICS && isAccountActive,
      ['ICS_APPLY_ENABLED']: !!featureFlags?.[ICS_APPLY_FORM],
      ['EL_STEALING_REPORTER']: !!isReportingRole,
      ['IS_SURVEYS_ACTIVE']:
        !!surveyApi && !!featureFlags?.[SURVEYS_SETUP_ENABLED],
      ['HAS_WRAPPED_DATA']: !!wrappedData,
    }),
    [
      chainId,
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
      wrappedData,
    ],
  );
};

export const useShowRule = () => {
  const flags = useShowFlags();

  return useCallback(
    (condition: ShowRule): boolean => {
      return flags[condition];
    },
    [flags],
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
