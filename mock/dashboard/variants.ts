import {
  KEY_STATUS,
  MODULE_NAME,
  type FrameInfo,
  type KeyWithStatus,
  type OperatorGroupStakeSummary,
  type OperatorRewards,
  type OperatorStakeSummary,
  type ReportTimestamps,
} from '@lidofinance/lido-csm-sdk';
import type { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import type { Performance } from 'types';
import { Address, Hash, parseEther } from 'viem';
import {
  MOCK_CLAIMER,
  MOCK_MANAGER,
  MOCK_REWARDS_ADDRESS,
  type RawBond,
} from '../claim-bond/mock-data';
import type { OperatorSeed } from '../my-operators/variants';

export type DashboardVariant =
  | 'csm-happy'
  | 'csm-problem'
  | 'csm-02'
  | 'cm-group'
  | 'cm-paused'
  | 'cm-topup-off'
  | 'claimer';

export const DASHBOARD_VARIANTS: DashboardVariant[] = [
  'csm-happy',
  'csm-problem',
  'csm-02',
  'cm-group',
  'cm-paused',
  'cm-topup-off',
  'claimer',
];

export const parseDashboardVariant = (value: unknown): DashboardVariant =>
  DASHBOARD_VARIANTS.find((variant) => variant === value) ?? 'csm-happy';

export type CmSeed = {
  groupId: bigint | null;
  group: OperatorGroupStakeSummary | null;
  metadataName: string;
  description: string;
  stake: OperatorStakeSummary;
  topUpEnabled: boolean;
};

export type DashboardRecord = {
  operator: ModuleNodeOperator;
  wallet: Address;
  info: OperatorSeed['info'];
  keys: KeyWithStatus[];
  bond: RawBond;
  rewardsAvailable: number;
  feeSplits: number[];
  claimer: Address | undefined;
  lastRewards: OperatorRewards;
  timestamps: ReportTimestamps;
  frame: FrameInfo;
  txHash: Hash;
  cm?: CmSeed;
};

const DAY = 24 * 60 * 60;
const FRAME_DURATION = 28 * DAY;
const NOW = Math.floor(Date.now() / 1000);
const ETH_2048 = parseEther('2048');
const TX_HASH: Hash = `0x${'ab'.repeat(32)}`;

export const MOCK_UPR: Record<'above' | 'below', Performance> = {
  above: {
    startTimestamp: NOW - 7 * DAY,
    endTimestamp: NOW,
    numberEpochs: 1575,
    operatorAttestationRate: 0.985,
    overallAttestationRate: 0.97,
    threshold: 0.965,
    status: 'good',
  },
  below: {
    startTimestamp: NOW - 7 * DAY,
    endTimestamp: NOW,
    numberEpochs: 1575,
    operatorAttestationRate: 0.93,
    overallAttestationRate: 0.97,
    threshold: 0.965,
    status: 'bad',
  },
};

const keysFor = (
  groups: {
    count: number;
    statuses: KEY_STATUS[];
    effectiveBalance?: bigint;
  }[],
): KeyWithStatus[] => {
  let i = 0;
  return groups.flatMap(({ count, statuses, effectiveBalance }) =>
    Array.from({ length: count }, () => {
      const index = i++;
      return {
        pubkey: `0x${index.toString(16).padStart(96, '0')}` as const,
        index,
        statuses,
        effectiveBalance,
      };
    }),
  );
};

const frameInfo = (nextReportInDays: number): FrameInfo => ({
  lastReport: NOW + nextReportInDays * DAY - FRAME_DURATION,
  nextReport: NOW + nextReportInDays * DAY,
  frameDuration: FRAME_DURATION,
});

const timestampsFor = ({ lastReport }: FrameInfo): ReportTimestamps => ({
  start: lastReport - FRAME_DURATION,
  end: lastReport,
});

const csmOperator = (
  nodeOperatorId: bigint,
  module: MODULE_NAME,
  overrides: Partial<ModuleNodeOperator> = {},
): ModuleNodeOperator => ({
  nodeOperatorId,
  module,
  managerAddress: MOCK_MANAGER,
  rewardsAddress: MOCK_MANAGER,
  extendedManagerPermissions: false,
  curveId: 0n,
  ...overrides,
});

const REWARDS_OK: OperatorRewards = {
  shares: parseEther('0.12'),
  distributed: parseEther('0.12'),
  validatorsCount: 13,
  validatorsOverThresholdCount: 12,
  threshold: 0.9,
};

const FRAME_OK = frameInfo(6);

const CSM_HAPPY: DashboardRecord = {
  operator: csmOperator(37n, MODULE_NAME.CSM),
  wallet: MOCK_MANAGER,
  info: {
    managerAddress: MOCK_MANAGER,
    rewardsAddress: MOCK_MANAGER,
    totalAddedKeys: 15,
    totalDepositedKeys: 13,
    depositableValidatorsCount: 2,
  },
  keys: keysFor([
    {
      count: 13,
      statuses: [KEY_STATUS.ACTIVE],
      effectiveBalance: parseEther('32'),
    },
    { count: 2, statuses: [KEY_STATUS.DEPOSITABLE] },
  ]),
  bond: { current: 36, forKeys: 30 },
  rewardsAvailable: 0.5,
  feeSplits: [10],
  claimer: MOCK_CLAIMER,
  lastRewards: REWARDS_OK,
  timestamps: timestampsFor(FRAME_OK),
  frame: FRAME_OK,
  txHash: TX_HASH,
};

const FRAME_DELAYED = frameInfo(-3);

const CSM_PROBLEM: DashboardRecord = {
  operator: csmOperator(38n, MODULE_NAME.CSM),
  wallet: MOCK_MANAGER,
  info: {
    managerAddress: MOCK_MANAGER,
    rewardsAddress: MOCK_MANAGER,
    proposedRewardsAddress: MOCK_REWARDS_ADDRESS,
    totalAddedKeys: 17,
    totalDepositedKeys: 14,
    depositableValidatorsCount: 1,
  },
  keys: keysFor([
    {
      count: 8,
      statuses: [KEY_STATUS.ACTIVE],
      effectiveBalance: parseEther('32'),
    },
    { count: 1, statuses: [KEY_STATUS.DEPOSITABLE] },
    { count: 1, statuses: [KEY_STATUS.ACTIVATION_PENDING] },
    { count: 1, statuses: [KEY_STATUS.DUPLICATED] },
    { count: 1, statuses: [KEY_STATUS.ACTIVE, KEY_STATUS.WITH_STRIKES] },
    { count: 1, statuses: [KEY_STATUS.INVALID] },
    { count: 1, statuses: [KEY_STATUS.ACTIVE, KEY_STATUS.UNBONDED] },
    { count: 1, statuses: [KEY_STATUS.ACTIVE, KEY_STATUS.EXIT_REQUESTED] },
    { count: 1, statuses: [KEY_STATUS.NON_QUEUED] },
    { count: 1, statuses: [KEY_STATUS.UNCHECKED] },
  ]),
  bond: {
    current: 0,
    forKeys: 12,
    locked: 0.5,
    debt: 0.2,
    pendingToSplit: 0.1,
  },
  rewardsAvailable: 0.4,
  feeSplits: [25],
  claimer: undefined,
  lastRewards: {
    shares: 0n,
    distributed: 0n,
    validatorsCount: 12,
    validatorsOverThresholdCount: 9,
    threshold: 0.9,
  },
  timestamps: timestampsFor(FRAME_DELAYED),
  frame: FRAME_DELAYED,
  txHash: TX_HASH,
};

const CSM_02: DashboardRecord = {
  ...CSM_HAPPY,
  operator: csmOperator(39n, MODULE_NAME.CSM_02, { curveId: 0n }),
  claimer: undefined,
  feeSplits: [],
  bond: { current: 34, forKeys: 32 },
};

const GROUP_4: OperatorGroupStakeSummary = {
  groupId: 4n,
  name: 'Operator Group name',
  subNodeOperators: [{ nodeOperatorId: 12n, share: 5000 }],
  externalOperators: [],
  operators: [
    {
      nodeOperatorId: 12n,
      weight: 5000n,
      share: 5000,
      externalStake: 0n,
      currentStake: 2n * ETH_2048,
      targetStake: 4n * ETH_2048,
    },
  ],
};

const CM_BASE: Omit<DashboardRecord, 'operator' | 'info' | 'keys' | 'cm'> = {
  wallet: MOCK_MANAGER,
  bond: { current: 4, forKeys: 4 },
  rewardsAvailable: 0.3,
  feeSplits: [],
  claimer: undefined,
  lastRewards: REWARDS_OK,
  timestamps: timestampsFor(FRAME_OK),
  frame: FRAME_OK,
  txHash: TX_HASH,
};

const CM_GROUP_SEED: CmSeed = {
  groupId: 4n,
  group: GROUP_4,
  metadataName: 'Consensys Curated Operator 12',
  description: 'Curated operator running on bare-metal infrastructure',
  stake: {
    weight: 5000n,
    externalStake: 0n,
    currentStake: 2n * ETH_2048,
    targetStake: 4n * ETH_2048,
  },
  topUpEnabled: true,
};

const CM_GROUP: DashboardRecord = {
  ...CM_BASE,
  operator: csmOperator(12n, MODULE_NAME.CM),
  info: {
    managerAddress: MOCK_MANAGER,
    rewardsAddress: MOCK_MANAGER,
    totalAddedKeys: 4,
    totalDepositedKeys: 2,
    depositableValidatorsCount: 2,
    targetLimit: 1000,
    targetLimitMode: 1,
  },
  keys: keysFor([
    { count: 2, statuses: [KEY_STATUS.ACTIVE], effectiveBalance: ETH_2048 },
    { count: 2, statuses: [KEY_STATUS.DEPOSITABLE] },
  ]),
  cm: CM_GROUP_SEED,
};

const CM_PAUSED: DashboardRecord = {
  ...CM_BASE,
  operator: csmOperator(14n, MODULE_NAME.CM),
  info: {
    managerAddress: MOCK_MANAGER,
    rewardsAddress: MOCK_MANAGER,
    totalAddedKeys: 1,
    totalDepositedKeys: 1,
    depositableValidatorsCount: 0,
    targetLimit: 1,
    targetLimitMode: 1,
  },
  keys: keysFor([
    { count: 1, statuses: [KEY_STATUS.ACTIVE], effectiveBalance: ETH_2048 },
  ]),
  cm: {
    groupId: null,
    group: null,
    metadataName: '',
    description: '',
    stake: {
      weight: 5000n,
      externalStake: 0n,
      currentStake: ETH_2048,
      targetStake: 3n * ETH_2048,
    },
    topUpEnabled: true,
  },
};

const CM_TOPUP_OFF: DashboardRecord = {
  ...CM_GROUP,
  operator: csmOperator(13n, MODULE_NAME.CM),
  info: { ...CM_GROUP.info, targetLimit: 0, targetLimitMode: 0 },
  cm: {
    ...CM_GROUP_SEED,
    metadataName: 'Consensys Curated Operator 13',
    description: '',
    topUpEnabled: false,
  },
};

const CLAIMER: DashboardRecord = {
  ...CSM_HAPPY,
  operator: csmOperator(40n, MODULE_NAME.CSM, {
    rewardsAddress: MOCK_REWARDS_ADDRESS,
    claimerAddress: MOCK_CLAIMER,
  }),
  wallet: MOCK_CLAIMER,
  info: {
    managerAddress: MOCK_MANAGER,
    rewardsAddress: MOCK_REWARDS_ADDRESS,
    totalAddedKeys: 15,
    totalDepositedKeys: 13,
    depositableValidatorsCount: 2,
  },
  feeSplits: [],
};

export const VARIANTS: Record<DashboardVariant, DashboardRecord> = {
  'csm-happy': CSM_HAPPY,
  'csm-problem': CSM_PROBLEM,
  'csm-02': CSM_02,
  'cm-group': CM_GROUP,
  'cm-paused': CM_PAUSED,
  'cm-topup-off': CM_TOPUP_OFF,
  claimer: CLAIMER,
};
