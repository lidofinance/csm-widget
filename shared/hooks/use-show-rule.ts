import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config, useConfig } from 'config';
import { useFeatureFlags } from 'config/feature-flags';
import {
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
} from 'config/feature-flags/types';
import { getExternalLinks } from 'consts/external-links';
import {
  useDappStatus,
  useHasReportStealingRole,
  useInvites,
  useNodeOperator,
  useOperatorBalance,
} from 'modules/web3';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback, useMemo } from 'react';
import {
  useCanClaimICS,
  useCanCreateNodeOperator,
  useCanEditSplits,
} from 'shared/hooks';
import { Address, isAddressEqual } from 'viem';

export type ShowRule =
  | 'IS_MAINNET'
  | 'IS_CONNECTED_WALLET'
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'HAS_INVITES'
  | 'HAS_MANAGER_ROLE'
  | 'HAS_REWARDS_ROLE'
  | 'HAS_OWNER_ROLE'
  | 'HAS_LOCKED_BOND'
  | 'HAS_REFERRER'
  | 'CAN_CREATE'
  | 'CAN_CLAIM_ICS'
  | 'CAN_EDIT_SPLITS'
  | 'ICS_APPLY_ENABLED'
  | 'EL_STEALING_REPORTER'
  | 'IS_SURVEYS_ACTIVE'
  | 'IS_CSM'
  | 'IS_CM';

export type ShowFlags = Record<ShowRule, boolean>;

const { surveyApi } = getExternalLinks();

const isManagerRole = (
  nodeOperator: NodeOperatorShortInfo | undefined,
  address: Address | undefined,
) => {
  return (
    (nodeOperator &&
      address &&
      isAddressEqual(nodeOperator.managerAddress, address)) ||
    false
  );
};

const isRewardsRole = (
  nodeOperator: NodeOperatorShortInfo | undefined,
  address: Address | undefined,
) => {
  return (
    (nodeOperator &&
      address &&
      isAddressEqual(nodeOperator.rewardsAddress, address)) ||
    false
  );
};

const isOwnerRole = (
  nodeOperator: NodeOperatorShortInfo | undefined,
  address: Address | undefined,
) => {
  return nodeOperator?.extendedManagerPermissions
    ? isManagerRole(nodeOperator, address)
    : isRewardsRole(nodeOperator, address);
};

export const useShowFlags = (): ShowFlags => {
  const { isAccountActive, address, chainId } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useHasReportStealingRole();
  const { data: balance } = useOperatorBalance(nodeOperator?.nodeOperatorId);
  const canClaimICS = useCanClaimICS();
  const canCreateNO = useCanCreateNodeOperator();
  const canEditSplits = useCanEditSplits();
  const { referrer } = useModifyContext();
  const featureFlags = useFeatureFlags();
  const {
    config: { module },
  } = useConfig();

  return useMemo(
    () => ({
      ['IS_MAINNET']: chainId === CHAINS.Mainnet,
      ['IS_CONNECTED_WALLET']: isAccountActive,
      ['NOT_NODE_OPERATOR']: !nodeOperator,
      ['IS_NODE_OPERATOR']: isAccountActive && !!nodeOperator,
      ['CAN_CREATE']: !!canCreateNO,
      ['HAS_MANAGER_ROLE']:
        isAccountActive && isManagerRole(nodeOperator, address),
      ['HAS_REWARDS_ROLE']:
        isAccountActive && isRewardsRole(nodeOperator, address),
      ['HAS_OWNER_ROLE']: isAccountActive && isOwnerRole(nodeOperator, address),
      ['HAS_INVITES']: !!invites?.length,
      ['HAS_LOCKED_BOND']: !!balance?.locked,
      ['HAS_REFERRER']: !!referrer,
      ['CAN_CLAIM_ICS']: !!canClaimICS && isAccountActive,
      ['CAN_EDIT_SPLITS']: !!canEditSplits && isAccountActive,
      ['ICS_APPLY_ENABLED']: !!featureFlags?.[ICS_APPLY_FORM],
      ['EL_STEALING_REPORTER']: !!isReportingRole,
      ['IS_SURVEYS_ACTIVE']:
        !!surveyApi && !!featureFlags?.[SURVEYS_SETUP_ENABLED],
      ['IS_CSM']: module === MODULE_NAME.CSM,
      ['IS_CM']: module === MODULE_NAME.CM,
    }),
    [
      chainId,
      isAccountActive,
      nodeOperator,
      canCreateNO,
      address,
      invites?.length,
      balance?.locked,
      referrer,
      canClaimICS,
      canEditSplits,
      featureFlags,
      isReportingRole,
      module,
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

// FIXME: type duplication with use-nav-items.tsx
export const useFilterShowRules = <
  T extends { showRules?: ShowRule[]; module?: MODULE_NAME },
>(
  items: T[],
) => {
  const check = useShowRule();

  return useMemo(
    () =>
      items
        .filter(({ module }) => !module || module === config.module)
        .filter(({ showRules }) => !showRules?.length || showRules.some(check)),
    [check, items],
  );
};
