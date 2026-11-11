import {
  KEY_STATUS,
  MODULE_NAME,
  type KeyWithStatus,
  type NodeOperatorInfo,
  type OperatorGroupStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import type {
  ModuleNodeOperator,
  OperatorRef,
} from 'modules/web3/operator-provider/types';
import { parseEther } from 'viem';
import {
  MOCK_CLAIMER,
  MOCK_MANAGER,
  MOCK_REWARDS_ADDRESS,
  makeOperatorInfo,
  type RawBond,
} from '../claim-bond/mock-data';

export type MyOperatorsVariant =
  'csm-many' | 'csm-one' | 'cm-group+csm' | 'cm-ungrouped' | 'cm-two-groups';

export const MY_OPERATORS_VARIANTS: MyOperatorsVariant[] = [
  'csm-many',
  'csm-one',
  'cm-group+csm',
  'cm-ungrouped',
  'cm-two-groups',
];

// A raw `+` in the URL decodes to a space.
export const parseMyOperatorsVariant = (value: unknown): MyOperatorsVariant =>
  MY_OPERATORS_VARIANTS.find(
    (variant) => variant === String(value).replace(/ /g, '+'),
  ) ?? 'csm-many';

export type OperatorSeed = {
  operator: ModuleNodeOperator;
  keys: KeyWithStatus[];
  bond: RawBond;
  rewardsAvailable: number;
  info: Parameters<typeof makeOperatorInfo>[0] &
    Partial<
      Pick<
        NodeOperatorInfo,
        | 'totalAddedKeys'
        | 'totalDepositedKeys'
        | 'depositableValidatorsCount'
        | 'targetLimit'
        | 'targetLimitMode'
      >
    >;
};

export type CmSeed = OperatorSeed & {
  groupId: bigint | null;
  metadataName: string;
};

export type VariantRecord = {
  available: ModuleNodeOperator[];
  active: OperatorRef;
  csm: OperatorSeed[];
  cm: CmSeed[];
  groups: OperatorGroupStakeSummary[];
};

const ADDRESS = MOCK_MANAGER;
const OTHER = MOCK_REWARDS_ADDRESS;
const ETH_2048 = parseEther('2048');

const key = (
  index: number,
  statuses: KEY_STATUS[],
  effectiveBalance?: bigint,
): KeyWithStatus => ({
  pubkey: `0x${index.toString(16).padStart(96, '0')}`,
  index,
  statuses,
  effectiveBalance,
});

const keysFor = (
  groups: {
    count: number;
    statuses: KEY_STATUS[];
    effectiveBalance?: bigint;
  }[],
) => {
  let i = 0;
  return groups.flatMap(({ count, statuses, effectiveBalance }) =>
    Array.from({ length: count }, () => key(i++, statuses, effectiveBalance)),
  );
};

const KEYS_37 = keysFor([
  { count: 2, statuses: [KEY_STATUS.DEPOSITABLE] },
  {
    count: 10,
    statuses: [KEY_STATUS.ACTIVE],
    effectiveBalance: parseEther('32'),
  },
]);

const KEYS_38 = keysFor([
  { count: 1, statuses: [KEY_STATUS.ACTIVATION_PENDING] },
  { count: 10, statuses: [KEY_STATUS.ACTIVE] },
  { count: 1, statuses: [KEY_STATUS.WITH_STRIKES] },
  { count: 1, statuses: [KEY_STATUS.UNBONDED] },
]);

const KEYS_40 = keysFor([{ count: 3, statuses: [KEY_STATUS.ACTIVE] }]);

const KEYS_CM_ACTIVE = keysFor([
  {
    count: 2,
    statuses: [KEY_STATUS.ACTIVE],
    effectiveBalance: ETH_2048,
  },
]);

const OP_37: ModuleNodeOperator = {
  nodeOperatorId: 37n,
  module: MODULE_NAME.CSM_02,
  managerAddress: ADDRESS,
  rewardsAddress: ADDRESS,
  extendedManagerPermissions: false,
  curveId: 0n,
};
const OP_38: ModuleNodeOperator = {
  nodeOperatorId: 38n,
  module: MODULE_NAME.CSM,
  managerAddress: ADDRESS,
  rewardsAddress: OTHER,
  extendedManagerPermissions: false,
  curveId: 1n,
};
const OP_40: ModuleNodeOperator = {
  nodeOperatorId: 40n,
  module: MODULE_NAME.CSM,
  managerAddress: OTHER,
  rewardsAddress: ADDRESS,
  extendedManagerPermissions: false,
  curveId: 0n,
};

const SEED_37: OperatorSeed = {
  operator: OP_37,
  keys: KEYS_37,
  bond: { current: 40, forKeys: 32 },
  rewardsAvailable: 0.5,
  info: { managerAddress: ADDRESS, rewardsAddress: ADDRESS },
};
const SEED_38: OperatorSeed = {
  operator: OP_38,
  keys: KEYS_38,
  bond: { current: 9.8, forKeys: 10 },
  rewardsAvailable: 0.2,
  info: {
    managerAddress: ADDRESS,
    rewardsAddress: OTHER,
    proposedManagerAddress: MOCK_CLAIMER,
  },
};
const SEED_40: OperatorSeed = {
  operator: OP_40,
  keys: KEYS_40,
  bond: { current: 10, forKeys: 9 },
  rewardsAvailable: 0.1,
  info: { managerAddress: OTHER, rewardsAddress: ADDRESS },
};

const cmOperator = (
  nodeOperatorId: bigint,
  managerAddress: ModuleNodeOperator['managerAddress'],
  rewardsAddress: ModuleNodeOperator['rewardsAddress'],
  curveId = 0n,
): ModuleNodeOperator => ({
  nodeOperatorId,
  module: MODULE_NAME.CM,
  managerAddress,
  rewardsAddress,
  extendedManagerPermissions: false,
  curveId,
});

const cmSeed = (
  operator: ModuleNodeOperator,
  groupId: bigint | null,
  overrides: Partial<CmSeed> = {},
): CmSeed => ({
  operator,
  groupId,
  metadataName: `Consensys Curated Operator ${operator.nodeOperatorId}`,
  keys: KEYS_CM_ACTIVE,
  bond: { current: 4, forKeys: 4 },
  rewardsAvailable: 0.3,
  info: {
    managerAddress: operator.managerAddress,
    rewardsAddress: operator.rewardsAddress,
  },
  ...overrides,
});

const OP_12 = cmOperator(12n, ADDRESS, ADDRESS);
const OP_13 = cmOperator(13n, ADDRESS, OTHER, 1n);
const OP_14 = cmOperator(14n, OTHER, OTHER);
const OP_15 = cmOperator(15n, OTHER, OTHER);
const OP_20 = cmOperator(20n, ADDRESS, ADDRESS);
const OP_21 = cmOperator(21n, ADDRESS, ADDRESS, 1n);
const OP_30 = cmOperator(30n, ADDRESS, ADDRESS);
const OP_31 = cmOperator(31n, OTHER, OTHER);

const member = (
  nodeOperatorId: bigint,
  weight: bigint,
  currentStake: bigint,
  targetStake: bigint,
) => ({
  nodeOperatorId,
  weight,
  share: Number(weight),
  externalStake: 0n,
  currentStake,
  targetStake,
});

const group = (
  groupId: bigint,
  name: string,
  operators: ReturnType<typeof member>[],
): OperatorGroupStakeSummary => ({
  groupId,
  name,
  subNodeOperators: operators.map(({ nodeOperatorId, share }) => ({
    nodeOperatorId,
    share,
  })),
  externalOperators: [],
  operators,
});

const GROUP_4 = group(4n, 'Operator Group name', [
  member(12n, 5000n, 4n * ETH_2048, 4n * ETH_2048),
  member(13n, 3000n, 2n * ETH_2048, 4n * ETH_2048),
  member(14n, 2000n, 0n, 2n * ETH_2048),
  member(15n, 0n, 0n, 0n),
]);

const GROUP_4_PAIR = group(4n, 'Operator Group name', [
  member(12n, 6000n, 2n * ETH_2048, 3n * ETH_2048),
  member(14n, 4000n, 0n, 2n * ETH_2048),
]);

const GROUP_7 = group(7n, '', [
  member(30n, 7000n, 2n * ETH_2048, 3n * ETH_2048),
  member(31n, 3000n, 0n, ETH_2048),
]);

const CM_GROUP_4_SEEDS: CmSeed[] = [
  cmSeed(OP_12, 4n),
  cmSeed(OP_13, 4n, {
    info: {
      managerAddress: ADDRESS,
      rewardsAddress: OTHER,
      proposedManagerAddress: MOCK_CLAIMER,
      totalAddedKeys: 2,
      totalDepositedKeys: 2,
      depositableValidatorsCount: 0,
      targetLimit: 1000,
      targetLimitMode: 1,
    },
  }),
  cmSeed(OP_14, 4n, {
    metadataName: '',
    keys: [],
    info: {
      managerAddress: OTHER,
      rewardsAddress: OTHER,
      totalAddedKeys: 0,
      totalDepositedKeys: 0,
      depositableValidatorsCount: 0,
    },
  }),
  cmSeed(OP_15, 4n, {
    info: {
      managerAddress: OTHER,
      rewardsAddress: OTHER,
      totalAddedKeys: 0,
      totalDepositedKeys: 0,
      depositableValidatorsCount: 0,
    },
  }),
];

const ref = (operator: ModuleNodeOperator): OperatorRef => ({
  nodeOperatorId: operator.nodeOperatorId,
  module: operator.module,
});

export const VARIANTS: Record<MyOperatorsVariant, VariantRecord> = {
  'csm-many': {
    available: [OP_37, OP_38, OP_40],
    active: ref(OP_37),
    csm: [SEED_37, SEED_38, SEED_40],
    cm: [],
    groups: [],
  },
  'csm-one': {
    available: [OP_38],
    active: ref(OP_38),
    csm: [SEED_38],
    cm: [],
    groups: [],
  },
  'cm-group+csm': {
    available: [OP_12, OP_13, OP_15, OP_37, OP_38],
    active: ref(OP_12),
    csm: [SEED_37, SEED_38],
    cm: CM_GROUP_4_SEEDS,
    groups: [GROUP_4],
  },
  'cm-ungrouped': {
    available: [OP_20, OP_21],
    active: ref(OP_20),
    csm: [],
    cm: [cmSeed(OP_20, null), cmSeed(OP_21, null)],
    groups: [],
  },
  'cm-two-groups': {
    available: [OP_12, OP_30],
    active: ref(OP_30),
    csm: [],
    cm: [
      cmSeed(OP_12, 4n),
      cmSeed(OP_14, 4n, { metadataName: '' }),
      cmSeed(OP_30, 7n),
      cmSeed(OP_31, 7n, { metadataName: '' }),
    ],
    groups: [GROUP_4_PAIR, GROUP_7],
  },
};
