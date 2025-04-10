import { KEY_STATUS } from 'consts/key-status';
import { useMemo } from 'react';
import { KeyWithStatus } from 'shared/hooks';

export const DEFAULT_STATUS_ORDER: KEY_STATUS[] = [
  KEY_STATUS.INVALID,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.STUCK,
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

export const ACTIVE_STATUS_ORDER: KEY_STATUS[] = [
  KEY_STATUS.ACTIVATION_PENDING,
  KEY_STATUS.ACTIVE,
  KEY_STATUS.EXITING,
  KEY_STATUS.WITHDRAWAL_PENDING,
  KEY_STATUS.WITHDRAWN,
  KEY_STATUS.DEPOSITABLE,

  KEY_STATUS.INVALID,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.STUCK,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.EXIT_REQUESTED,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.SLASHED,
];

type SortKeysFn = (a: KeyWithStatus, b: KeyWithStatus) => number;

const sortByStatusOrder = (statusOrder: KEY_STATUS[]): SortKeysFn => {
  const getStatusOrder = (statuses: KEY_STATUS[]): number =>
    statusOrder.findIndex((st) => statuses.includes(st));
  return (a, b) => getStatusOrder(a.statuses) - getStatusOrder(b.statuses);
};

export const sortByActiveStatus = sortByStatusOrder(ACTIVE_STATUS_ORDER);
export const sortByStatus = sortByStatusOrder(DEFAULT_STATUS_ORDER);
export const sortByStatusDesc = sortByStatusOrder(
  Array.from(DEFAULT_STATUS_ORDER).reverse(),
);

export const sortByPubkey: SortKeysFn = (a, b) => a.key.localeCompare(b.key);
export const sortByPubkeyDesc: SortKeysFn = (a, b) =>
  b.key.localeCompare(a.key);

export const useSortedKeys = (
  keys?: KeyWithStatus[],
  sortFn: SortKeysFn = sortByStatus,
) => useMemo(() => keys?.sort(sortFn), [keys, sortFn]);
