import { KEY_STATUS, type CurveParameters } from '@lidofinance/lido-csm-sdk';
import type { EnrichedPenalty } from 'features/unlock-bond/penalty-history/types';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { parseEther } from 'viem';

export const PARAMETERS_DEFAULT: CurveParameters = {
  keyRemovalFee: parseEther('0.02'),
  keysLimit: 100,
  allowedExitDelay: 432000,
  exitDelayPenalty: parseEther('0.1'),
  badPerformancePenalty: parseEther('0.258'),
  elStealingPenalty: parseEther('0.05'),
  maxWithdrawalRequestFee: parseEther('0.001'),
  performanceCoefficients: {
    attestationsWeight: 54n,
    blocksWeight: 8n,
    syncWeight: 2n,
  },
  performanceLeewayConfig: [{ minKeyNumber: 1, value: 500n }],
  rewardsConfig: [{ minKeyNumber: 1, value: 6900n }],
  bondConfig: [
    { minKeyNumber: 1, value: parseEther('2.4') },
    { minKeyNumber: 2, value: parseEther('1.3') },
  ],
  queueConfig: { lowestPriority: 5, priority: 5, maxDeposits: 0 },
  strikesConfig: { lifetime: 6, threshold: 3 },
};

export const PARAMETERS_ICS: CurveParameters = {
  ...PARAMETERS_DEFAULT,
  keysLimit: 250,
  rewardsConfig: [
    { minKeyNumber: 1, value: 7200n },
    { minKeyNumber: 11, value: 6900n },
  ],
  bondConfig: [
    { minKeyNumber: 1, value: parseEther('1.5') },
    { minKeyNumber: 2, value: parseEther('1.3') },
  ],
  queueConfig: { lowestPriority: 5, priority: 0, maxDeposits: 10 },
};

export const STRIKE_DOTS = [
  { count: 0, filled: 0, threshold: 3, lastStrikeIndex: undefined },
  { count: 1, filled: 1, threshold: 3, lastStrikeIndex: 0 },
  { count: 2, filled: 2, threshold: 3, lastStrikeIndex: 0 },
  { count: 3, filled: 3, threshold: 3, lastStrikeIndex: 0 },
] as const;

export const LAST_STRIKE_DATE = 1700000000;

const hash = (digit: string) => `0x${digit.repeat(64)}` as const;

export const PENALTIES: EnrichedPenalty[] = [
  {
    transactionHash: hash('a'),
    type: 'reported',
    typeLabel: 'EL Stealing Penalty',
    timestamp: 1700000000,
    additionalFine: parseEther('0.05'),
    amount: parseEther('0.5'),
    details: 'Block 12345678',
  },
  {
    transactionHash: hash('b'),
    type: 'compensated',
    typeLabel: 'Compensation',
    timestamp: 1700100000,
    amount: parseEther('0.5'),
  },
  {
    transactionHash: hash('c'),
    type: 'settled',
    typeLabel: 'Settled',
    timestamp: 1700200000,
    amount: parseEther('0.12'),
    details: 'Settled from bond',
  },
  {
    transactionHash: hash('d'),
    type: 'cancelled',
    typeLabel: 'Cancelled',
    timestamp: 1700300000,
    amount: parseEther('0.3'),
  },
];

export const STATUS_COMMENTS: { title: string; statuses: KEY_STATUS[] }[] = [
  { title: 'Invalid', statuses: [KEY_STATUS.INVALID] },
  { title: 'Exit requested', statuses: [KEY_STATUS.EXIT_REQUESTED] },
  { title: 'Triggered ejection', statuses: [KEY_STATUS.TRIGGERED_EJECTION] },
  {
    title: 'Unbonded, non-queued',
    statuses: [KEY_STATUS.UNBONDED, KEY_STATUS.NON_QUEUED],
  },
  {
    title: 'Unbonded, withdrawal pending',
    statuses: [KEY_STATUS.UNBONDED, KEY_STATUS.WITHDRAWAL_PENDING],
  },
  { title: 'Unbonded', statuses: [KEY_STATUS.UNBONDED] },
  { title: 'Unchecked', statuses: [KEY_STATUS.UNCHECKED] },
  { title: 'Non-queued', statuses: [KEY_STATUS.NON_QUEUED] },
  { title: 'Exiting', statuses: [KEY_STATUS.EXITING] },
];

export const SPLIT_ROWS = [
  {
    label: 'Recipient 1',
    value: '0x3333333333333333333333333333333333333333',
    share: 6000n,
  },
  {
    label: 'Recipient 2',
    value: '0x2222222222222222222222222222222222222222',
    share: 4000n,
  },
];

export const PUBKEY =
  '0x8a6b0a4d9c1e3f5b7d2a4c6e8f0a1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5';

export const ADDRESS = '0x3333333333333333333333333333333333333333';

export const CREATE_ROWS = {
  canCreateCm: true,
  cmTypes: ['0x01', 'IC'],
  csmTypes: ['0x02', 'ICS'],
  hasRows: true,
};

export const CREATE_EVENTS = {
  cm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCm,
  csm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCsm,
};

export const OPTION_ITEMS = [
  {
    value: 'first',
    title: 'First option',
    description: 'Selected by default to show the active state',
  },
  {
    value: 'second',
    title: 'Second option',
    description: 'Hover this one to see the hover state',
  },
  {
    value: 'third',
    title: 'Third option',
    description: 'Disabled option',
    disabled: true,
  },
];
