import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config, useConfig } from 'config';
import { useFeatureFlags } from 'config/feature-flags';
import {
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
} from 'config/feature-flags/types';
import { isSurveysApiConfigured } from 'modules/surveys-sdk';
import {
  useDappStatus,
  useHasReportDelayedPenaltyRole,
  useInvites,
  useNodeOperator,
  useOperatorBalance,
  useOperatorInfo,
} from 'modules/web3';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback, useMemo } from 'react';
import {
  useCanClaimICS,
  useCanClaimIDVTC,
  useCanCreateNodeOperator,
} from 'shared/hooks';
import { coerceShowFlags, evaluateShowRules } from 'utils';
import { Address, isAddressEqual } from 'viem';

export type ShowRule =
  | 'IS_MAINNET'
  | 'IS_CONNECTED_WALLET'
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'CAN_CREATE'
  | 'HAS_KEYS'
  | 'HAS_INVITES'
  | 'HAS_MANAGER_ROLE'
  | 'HAS_REWARDS_ROLE'
  | 'HAS_OWNER_ROLE'
  | 'HAS_LOCKED_BOND'
  | 'HAS_REFERRER'
  | 'EL_DELAYED_PENALTY_REPORTER'
  | 'CAN_CLAIM_ICS'
  | 'CAN_CLAIM_IDVTC'
  | 'ICS_APPLY_ENABLED'
  | 'IS_SURVEYS_ACTIVE'
  | 'IS_CSM'
  | 'IS_CM';

export type ShowFlags = Record<ShowRule, boolean>;

// `undefined` = the data backing the rule is still loading
export type ShowFlagsState = Record<ShowRule, boolean | undefined>;

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

const pendingGate = (pending: boolean, value: boolean): boolean | undefined =>
  pending ? undefined : value;

export const useShowFlagsState = (): ShowFlagsState => {
  const { isAccountActive, address, chainId } = useDappStatus();
  const { nodeOperator, isPending: isOperatorPending } = useNodeOperator();
  const { data: invites } = useInvites();
  const { data: isReportingRole, isPending: isReportingRolePending } =
    useHasReportDelayedPenaltyRole();
  const { data: balance } = useOperatorBalance(nodeOperator?.nodeOperatorId);
  const { data: info, isLoading: isInfoLoading } = useOperatorInfo(
    nodeOperator?.nodeOperatorId,
  );
  const { canClaim: icsCanClaim, isPending: icsIsPending } = useCanClaimICS();
  const { canClaim: idvtcCanClaim, isPending: idvtcIsPending } =
    useCanClaimIDVTC();
  const { canCreate: canCreateNO, isPending: isCanCreatePending } =
    useCanCreateNodeOperator();
  const { referrer } = useModifyContext();
  const featureFlags = useFeatureFlags();
  const {
    config: { module },
  } = useConfig();

  // operator identity (and roles derived from it) is unknown until loaded
  const isOperatorUnknown = isAccountActive && isOperatorPending;

  return useMemo(
    () => ({
      ['IS_MAINNET']: chainId === CHAINS.Mainnet,
      ['IS_CONNECTED_WALLET']: isAccountActive,
      ['NOT_NODE_OPERATOR']: pendingGate(isOperatorUnknown, !nodeOperator),
      ['IS_NODE_OPERATOR']: pendingGate(
        isOperatorUnknown,
        isAccountActive && !!nodeOperator,
      ),
      ['CAN_CREATE']: pendingGate(isCanCreatePending, canCreateNO),
      // isLoading (not isPending): a disabled query must read as definite false
      ['HAS_KEYS']: pendingGate(isInfoLoading, !!info?.totalAddedKeys),
      ['HAS_MANAGER_ROLE']: pendingGate(
        isOperatorUnknown,
        isAccountActive && isManagerRole(nodeOperator, address),
      ),
      ['HAS_REWARDS_ROLE']: pendingGate(
        isOperatorUnknown,
        isAccountActive && isRewardsRole(nodeOperator, address),
      ),
      ['HAS_OWNER_ROLE']: pendingGate(
        isOperatorUnknown,
        isAccountActive && isOwnerRole(nodeOperator, address),
      ),
      ['HAS_INVITES']: !!invites?.length,
      ['HAS_LOCKED_BOND']: !!balance?.locked,
      ['HAS_REFERRER']: !!referrer,
      ['EL_DELAYED_PENALTY_REPORTER']: pendingGate(
        isAccountActive && isReportingRolePending,
        !!isReportingRole,
      ),
      ['CAN_CLAIM_ICS']: pendingGate(
        isAccountActive && icsIsPending,
        !!icsCanClaim && isAccountActive,
      ),
      ['CAN_CLAIM_IDVTC']: pendingGate(
        isAccountActive && idvtcIsPending,
        !!idvtcCanClaim && isAccountActive,
      ),
      ['ICS_APPLY_ENABLED']:
        !!featureFlags?.[ICS_APPLY_FORM] && module === MODULE_NAME.CSM,
      ['IS_SURVEYS_ACTIVE']:
        isSurveysApiConfigured &&
        !!featureFlags?.[SURVEYS_SETUP_ENABLED] &&
        module === MODULE_NAME.CSM,
      ['IS_CSM']: module === MODULE_NAME.CSM,
      ['IS_CM']: module === MODULE_NAME.CM,
    }),
    [
      chainId,
      isAccountActive,
      isOperatorUnknown,
      nodeOperator,
      canCreateNO,
      isCanCreatePending,
      info?.totalAddedKeys,
      isInfoLoading,
      address,
      invites?.length,
      balance?.locked,
      referrer,
      isReportingRole,
      isReportingRolePending,
      icsCanClaim,
      icsIsPending,
      idvtcCanClaim,
      idvtcIsPending,
      featureFlags,
      module,
    ],
  );
};

export const useShowFlags = (): ShowFlags => {
  const state = useShowFlagsState();

  return useMemo(() => coerceShowFlags(state), [state]);
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

export type ShowRuleProps = {
  showRules?: (ShowRule | ShowRule[])[];
  module?: MODULE_NAME;
};

export const useFilterShowRules = <T extends ShowRuleProps>(items: T[]) => {
  const check = useShowRule();

  return useMemo(
    () =>
      items
        .filter(({ module }) => !module || module === config.module)
        .filter(({ showRules }) => evaluateShowRules(showRules, check)),
    [check, items],
  );
};
