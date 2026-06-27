import { CLAIM_OPTION } from 'features/claim-bond/claim-bond-form/context/types';
import { type RawBond } from './mock-data';

export type ClaimBondScenarioData = {
  nodeOperatorId?: number;
  bond: RawBond;
  rewards?: number;
  feeSplits?: number[];
  isPaused?: boolean;
  isContract?: boolean;
};

export type ClaimBondScenario = {
  group: string;
  title: string;
  description: string;
  data: ClaimBondScenarioData;
  expectEmpty?: boolean;
  expectOptions?: CLAIM_OPTION[];
};

const ALL = CLAIM_OPTION.ALL_TO_RA;
const BOND = CLAIM_OPTION.BOND_TO_RA;
const R2B = CLAIM_OPTION.REWARDS_TO_BOND;

export const testScenarios: ClaimBondScenario[] = [
  // [Basic]
  {
    group: 'Basic',
    title: 'Excess + rewards',
    description:
      'Classic state: claimable excess bond and pending rewards. All three options.',
    data: { bond: { current: 34, forKeys: 32 }, rewards: 0.4 },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Basic',
    title: 'Excess only',
    description: 'Excess bond, no rewards. Only Excess Bond → Rewards Address.',
    data: { bond: { current: 34, forKeys: 32 }, rewards: 0 },
    expectOptions: [BOND],
  },
  {
    group: 'Basic',
    title: 'Rewards only (bond exact)',
    description:
      'Bond exactly covers keys, rewards pending. Excess Bond option disabled.',
    data: { bond: { current: 32, forKeys: 32 }, rewards: 0.4 },
    expectOptions: [ALL, R2B],
  },
  {
    group: 'Basic',
    title: 'Nothing to claim',
    description: 'No excess, no rewards. Empty state.',
    data: { bond: { current: 32, forKeys: 32 }, rewards: 0 },
    expectEmpty: true,
  },
  // [Insufficient]
  {
    group: 'Insufficient',
    title: 'Insufficient, rewards > deficit',
    description:
      'Rewards cover the forKeys deficit with a remainder reaching the Rewards Address.',
    data: { bond: { current: 31, forKeys: 32 }, rewards: 1.5 },
    expectOptions: [ALL, R2B],
  },
  {
    group: 'Insufficient',
    title: 'Insufficient, rewards < deficit',
    description:
      'Rewards fully absorbed by the bond top-up. Nothing reaches the Rewards Address.',
    data: { bond: { current: 30, forKeys: 32 }, rewards: 0.5 },
    expectOptions: [R2B],
  },
  {
    group: 'Insufficient',
    title: 'Insufficient, no rewards',
    description: 'Deficit but no rewards. Empty state.',
    data: { bond: { current: 30, forKeys: 32 }, rewards: 0 },
    expectEmpty: true,
  },
  // [Locked]
  {
    group: 'Locked',
    title: 'Excess + locked + rewards',
    description:
      'Excess remains above required + locked. Locked row shows with its tooltip.',
    data: { bond: { current: 35, forKeys: 32, locked: 1 }, rewards: 0.4 },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Locked',
    title: 'Locked-induced real deficit',
    description:
      'forKeys covered (shows excess) but locked eats it. Rewards absorbed into bond.',
    data: { bond: { current: 32.5, forKeys: 32, locked: 1 }, rewards: 0.4 },
    expectOptions: [R2B],
  },
  // [Debt] — real-world invariant: debt settles against bond on every touch
  // (_coverBondDebt), so debt > 0 ⟹ current == 0. INV1 (debt ⟹ no excess) then
  // holds trivially. All fixtures here keep current: 0.
  {
    group: 'Debt',
    title: 'Debt + rewards > debt + deficit',
    description:
      'Rewards burn the debt and cover the deficit, remainder reaches the Rewards Address.',
    data: { bond: { current: 0, forKeys: 2, debt: 1 }, rewards: 4 },
    expectOptions: [ALL, R2B],
  },
  {
    group: 'Debt',
    title: 'Debt exceeds rewards',
    description: 'Rewards partially burn debt; bond debt remaining is shown.',
    data: { bond: { current: 0, forKeys: 4, debt: 2 }, rewards: 0.3 },
    expectOptions: [R2B],
  },
  {
    group: 'Debt',
    title: 'Debt only, no rewards',
    description: 'Debt alone produces nothing claimable. Empty state.',
    data: { bond: { current: 0, forKeys: 32, debt: 1 }, rewards: 0 },
    expectEmpty: true,
  },
  // [Splitters]
  {
    group: 'Splitters',
    title: 'Excess + rewards + 50% splitter',
    description: 'Single 50% splitter. SPLITTERS ON chip and split row appear.',
    data: { bond: { current: 34, forKeys: 32 }, rewards: 1, feeSplits: [50] },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Splitters',
    title: 'Excess + rewards + 100% (two recipients)',
    description: 'Two splitters summing to 100%. Multiple split rows.',
    data: {
      bond: { current: 34, forKeys: 32 },
      rewards: 1,
      feeSplits: [60, 40],
    },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Splitters',
    title: 'Rewards + split, no excess',
    description:
      'Bond exact, rewards split with recipients. ALL option becomes split-rewards-only.',
    data: { bond: { current: 32, forKeys: 32 }, rewards: 1, feeSplits: [50] },
    expectOptions: [ALL, R2B],
  },
  {
    group: 'Splitters',
    title: 'Pending splitter debt + excess',
    description:
      'pendingToSplit settles from bond on claim. Splitter debt row shows.',
    data: {
      bond: { current: 34, forKeys: 32, pendingToSplit: 0.3 },
      rewards: 0.5,
      feeSplits: [50],
    },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Splitters',
    title: 'Splitters + insufficient + remainder',
    description:
      'Split, compensate insufficient bond, send remainder to the Rewards Address.',
    data: { bond: { current: 31, forKeys: 32 }, rewards: 2, feeSplits: [50] },
    expectOptions: [ALL, R2B],
  },
  // [Misc]
  {
    group: 'Misc',
    title: 'Paused accounting',
    description: 'Accounting paused. Submit replaced by the paused button.',
    data: {
      bond: { current: 34, forKeys: 32 },
      rewards: 0.4,
      isPaused: true,
    },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Misc',
    title: 'Rewards address is a contract',
    description:
      'Rewards address is a contract. Default claim token is wstETH.',
    data: {
      bond: { current: 34, forKeys: 32 },
      rewards: 0.4,
      isContract: true,
    },
    expectOptions: [ALL, BOND, R2B],
  },
  {
    group: 'Misc',
    title: 'Whale (large excess + rewards)',
    description: 'Large amounts. ETH max is capped by MAX_ETH_AMOUNT.',
    data: { bond: { current: 1000, forKeys: 900 }, rewards: 50 },
    expectOptions: [ALL, BOND, R2B],
  },
  // [Repro] States reported from the live app — used to check option copy.
  {
    group: 'Repro',
    title: 'Insufficient + splitters, rewards < deficit',
    description:
      'forKeys-insufficient, splitters on, rewards do not cover the deficit (nothing splits, all compensates).',
    data: { bond: { current: 31, forKeys: 32 }, rewards: 0.5, feeSplits: [40] },
    expectOptions: [R2B],
  },
  {
    group: 'Repro',
    title: 'Locked hides excess + claimable rewards',
    description:
      'Excess shown but fully locked (no claimable excess); rewards exceed the tiny locked deficit, so most rewards are claimable.',
    data: {
      bond: { current: 42.0999, forKeys: 32, locked: 10.1 },
      rewards: 0.2663,
    },
    expectOptions: [ALL, R2B],
  },
];
