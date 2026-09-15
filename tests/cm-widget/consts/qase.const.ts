import { createQaseTree } from 'tests/shared/helpers/qaseTree';

/**
 * The CM Qase suite tree, declared in one place.
 *
 * Values are the literal folder titles in the CM project, so they must match
 * it letter for letter — a mismatch creates a twin folder instead of reusing
 * the existing one. Extend a map to open a new section: the folder is created
 * on the first run of a test that points at it.
 */

/** Product area */
export const EPIC = {
  bondRewards: 'Bond & Rewards',
  keys: 'Keys',
  roles: 'Roles',
  dashboard: 'Dashboard',
  settings: 'Settings',
} as const;

/** Capability inside an epic */
export const FEATURE = {
  claim: 'Claim',
  addBond: 'Add bond',
} as const;

/** Scenario inside a feature — the state the behaviour is checked in */
export const STORY = {
  // Bond & Rewards / Claim
  excessBondAndRewards: 'Excess bond & rewards',
  onlyExcessBond: 'Only excess bond',
  onlyRewards: 'Only rewards',
  insufficientBond: 'Insufficient bond',
  nothingToClaim: 'Nothing to claim',
  penalty: 'Penalty',
  splitters: 'Splitters',
  tokenAndAmount: 'Token & amount',
  transaction: 'Transaction',
} as const;

type Epic = (typeof EPIC)[keyof typeof EPIC];
type Feature = (typeof FEATURE)[keyof typeof FEATURE];
type Story = (typeof STORY)[keyof typeof STORY];

export const qaseTree = createQaseTree<Epic, Feature, Story>();
