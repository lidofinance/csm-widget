import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { sumActiveKeysBalance } from './compute-stake-data';
import { hasStatus, StatusFilter } from './has-status';

const STATUS_GROUPS: Record<keyof KeysBreakdownCounts, StatusFilter> = {
  depositable: KEY_STATUS.DEPOSITABLE,
  activationPending: KEY_STATUS.ACTIVATION_PENDING,
  active: [KEY_STATUS.ACTIVE, KEY_STATUS.EXITING],
  exited: KEY_STATUS.WITHDRAWAL_PENDING,
  withdrawn: KEY_STATUS.WITHDRAWN,
  withStrikes: KEY_STATUS.WITH_STRIKES,
  unbonded: KEY_STATUS.UNBONDED,
  exitRequested: KEY_STATUS.EXIT_REQUESTED,
  nonQueued: KEY_STATUS.NON_QUEUED,
  duplicated: KEY_STATUS.DUPLICATED,
  invalid: KEY_STATUS.INVALID,
  unchecked: KEY_STATUS.UNCHECKED,
};

const ISSUE_GROUPS: (keyof KeysBreakdownCounts)[] = [
  'withStrikes',
  'unbonded',
  'duplicated',
  'invalid',
  'nonQueued',
  'unchecked',
  'exitRequested',
];

export type KeysBreakdownCounts = {
  depositable: number;
  activationPending: number;
  active: number;
  exited: number;
  withdrawn: number;
  withStrikes: number;
  unbonded: number;
  exitRequested: number;
  nonQueued: number;
  duplicated: number;
  invalid: number;
  unchecked: number;
};

export type KeysBreakdownData = {
  counts: KeysBreakdownCounts;
  issuesCount: number;
  activeBalance: bigint;
};

export const selectKeysBreakdown = (
  keys: KeyWithStatus[],
): KeysBreakdownData => {
  const counts = Object.fromEntries(
    Object.entries(STATUS_GROUPS).map(([key, filter]) => [
      key,
      keys.filter(hasStatus(filter)).length,
    ]),
  ) as KeysBreakdownCounts;

  const issuesCount = ISSUE_GROUPS.filter((group) => counts[group] > 0).length;

  const activeBalance = sumActiveKeysBalance(
    keys.filter(hasStatus(STATUS_GROUPS.active)),
  );

  return { counts, issuesCount, activeBalance };
};
