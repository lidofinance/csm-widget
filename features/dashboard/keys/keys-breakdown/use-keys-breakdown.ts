import {
  KEY_STATUS,
  KeyWithStatus,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { useOperatorKeysWithStatus } from 'modules/web3';
import { hasStatus, StatusFilter } from 'utils/has-status';

const ISSUE_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.WITH_STRIKES,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.EXIT_REQUESTED,
];

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

type KeysBreakdownCounts = {
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

type KeysBreakdownData = {
  counts: KeysBreakdownCounts;
  issuesCount: number;
};

const selectKeysBreakdown = (keys: KeyWithStatus[]): KeysBreakdownData => {
  const counts = Object.fromEntries(
    Object.entries(STATUS_GROUPS).map(([key, filter]) => [
      key,
      keys.filter(hasStatus(filter)).length,
    ]),
  ) as KeysBreakdownCounts;

  const issuesCount = ISSUE_STATUSES.filter(
    (status) => keys.filter(hasStatus(status)).length > 0,
  ).length;

  return { counts, issuesCount };
};

export const useKeysBreakdown = (id: NodeOperatorId | undefined) => {
  return useOperatorKeysWithStatus(id, selectKeysBreakdown);
};
