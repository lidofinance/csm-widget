import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { SortCriteria, SortFunctions } from 'providers/table-provider';
import { getArraySum } from 'utils';

const DEFAULT_STATUS_ORDER: KEY_STATUS[] = [
  KEY_STATUS.INVALID,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.EXIT_REQUESTED,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,

  KEY_STATUS.DEPOSITABLE,
  KEY_STATUS.ACTIVATION_PENDING,
  KEY_STATUS.ACTIVE,
  KEY_STATUS.EXITING,
  KEY_STATUS.WITHDRAWAL_PENDING,
  KEY_STATUS.WITHDRAWN,

  KEY_STATUS.SLASHED,
];

const getStatusPriority = (statuses: KEY_STATUS[]): number =>
  DEFAULT_STATUS_ORDER.findIndex((st) => statuses.includes(st));

const sortByPubkey: SortCriteria<KeyWithStatus> = (item) => [
  item.pubkey,
  item.index,
];

const sortByStatus: SortCriteria<KeyWithStatus> = (item) => [
  getStatusPriority(item.statuses),
  item.index,
];

const sortByStrikes: SortCriteria<KeyWithStatus> = (item) => [
  getArraySum(item.strikes),
  item.index,
];

export const sortFunctions: SortFunctions<KeyWithStatus> = {
  pubkey: sortByPubkey,
  statuses: sortByStatus,
  strikes: sortByStrikes,
};
