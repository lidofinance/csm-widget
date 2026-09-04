import {
  MODULE_NAME,
  NodeOperatorShortInfo,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import { SURVEYS_SETUP_ENABLED } from 'config/feature-flags/types';
import { isSurveysApiConfigured } from 'modules/surveys-sdk';
import {
  useDappStatus,
  useHasReportDelayedPenaltyRole,
  useInvites,
  useModule,
  useNodeOperator,
  useOperatorBalance,
  useOperatorInfo,
} from 'modules/web3';
import { useOperatorType } from 'modules/web3/hooks/use-operator-type';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback, useMemo } from 'react';
import {
  useCanClaimICS,
  useCanClaimIDVTC,
  useCanCreateNodeOperator,
  useIcsApplyEnabled,
} from 'shared/hooks';
import { Address, isAddressEqual } from 'viem';

export type ShowRule =
  | 'IS_MAINNET'
  | 'IS_CONNECTED_WALLET'
  | 'NOT_NODE_OPERATOR'
  | 'IS_NODE_OPERATOR'
  | 'CAN_CREATE'
  | 'CAN_CREATE_0X01'
  | 'CAN_CREATE_ICS'
  | 'CAN_CREATE_IDVTC'
  | 'CAN_CREATE_0X02'
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
  | 'HAS_APPLY_OPTIONS'
  | 'IS_SURVEYS_ACTIVE'
  | 'IS_CSM'
  | 'IS_CSM_02'
  | 'IS_CSM_FAMILY'
  | 'IS_CM'
  | 'IS_IDVTC';

export type ShowFlags = Record<ShowRule, boolean>;

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
  const { data: isReportingRole } = useHasReportDelayedPenaltyRole();
  const { data: balance } = useOperatorBalance(nodeOperator?.nodeOperatorId);
  const { data: info } = useOperatorInfo(nodeOperator?.nodeOperatorId);
  const canClaimICS = useCanClaimICS();
  const canClaimIDVTC = useCanClaimIDVTC();
  const { data: operatorType } = useOperatorType(nodeOperator);
  const {
    canCreate: canCreateNO,
    creatableTypes,
    createOptions,
  } = useCanCreateNodeOperator();
  const { referrer } = useModifyContext();
  const featureFlags = useFeatureFlags();
  const { module, isCsmFamily } = useModule();
  const icsApplyEnabled = useIcsApplyEnabled();

  return useMemo(
    () => ({
      ['IS_MAINNET']: chainId === CHAINS.Mainnet,
      ['IS_CONNECTED_WALLET']: isAccountActive,
      ['NOT_NODE_OPERATOR']: !nodeOperator,
      ['IS_NODE_OPERATOR']: isAccountActive && !!nodeOperator,
      ['CAN_CREATE']: !!canCreateNO,
      ['CAN_CREATE_0X01']: creatableTypes.includes(OPERATOR_TYPE.CSM_DEF),
      ['CAN_CREATE_ICS']: creatableTypes.includes(OPERATOR_TYPE.CSM_ICS),
      ['CAN_CREATE_IDVTC']: creatableTypes.includes(OPERATOR_TYPE.CSM_IDVTC),
      ['CAN_CREATE_0X02']: creatableTypes.includes(OPERATOR_TYPE.CSM2_DEF),
      ['HAS_KEYS']: !!info?.totalAddedKeys,
      ['HAS_MANAGER_ROLE']:
        isAccountActive && isManagerRole(nodeOperator, address),
      ['HAS_REWARDS_ROLE']:
        isAccountActive && isRewardsRole(nodeOperator, address),
      ['HAS_OWNER_ROLE']: isAccountActive && isOwnerRole(nodeOperator, address),
      ['HAS_INVITES']: !!invites?.length,
      ['HAS_LOCKED_BOND']: !!balance?.locked,
      ['HAS_REFERRER']: !!referrer,
      ['EL_DELAYED_PENALTY_REPORTER']: !!isReportingRole,
      ['CAN_CLAIM_ICS']: !!canClaimICS && isAccountActive,
      ['CAN_CLAIM_IDVTC']: !!canClaimIDVTC && isAccountActive,
      ['ICS_APPLY_ENABLED']: icsApplyEnabled,
      ['HAS_APPLY_OPTIONS']: createOptions.some(({ kind }) => kind === 'apply'),
      ['IS_SURVEYS_ACTIVE']:
        isSurveysApiConfigured &&
        !!featureFlags?.[SURVEYS_SETUP_ENABLED] &&
        module === MODULE_NAME.CSM,
      ['IS_CSM']: module === MODULE_NAME.CSM,
      ['IS_CSM_02']: module === MODULE_NAME.CSM_02,
      ['IS_CSM_FAMILY']: isCsmFamily,
      ['IS_CM']: module === MODULE_NAME.CM,
      ['IS_IDVTC']:
        isAccountActive &&
        !!nodeOperator &&
        operatorType === OPERATOR_TYPE.CSM_IDVTC,
    }),
    [
      chainId,
      isAccountActive,
      nodeOperator,
      canCreateNO,
      creatableTypes,
      info?.totalAddedKeys,
      address,
      invites?.length,
      balance?.locked,
      referrer,
      isReportingRole,
      canClaimICS,
      canClaimIDVTC,
      featureFlags,
      module,
      operatorType,
      isCsmFamily,
      icsApplyEnabled,
      createOptions,
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

export type ShowRuleProps = {
  showRules?: (ShowRule | ShowRule[])[];
  modules?: MODULE_NAME[];
};

export const useFilterShowRules = <T extends ShowRuleProps>(items: T[]) => {
  const check = useShowRule();
  const { module } = useModule();

  return useMemo(
    () =>
      items
        .filter(({ modules }) => !modules || modules.includes(module))
        .filter(
          ({ showRules }) =>
            !showRules?.length ||
            showRules.some((rule) =>
              Array.isArray(rule) ? rule.every(check) : check(rule),
            ),
        ),
    [check, items, module],
  );
};
