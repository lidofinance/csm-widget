import { useCallback, useMemo } from 'react';
import { KeyWithStatus } from 'shared/hooks';
import { KEY_STATUS } from 'types';

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

export const useSortedKeys = (
  keys?: KeyWithStatus[],
  statusOrder = DEFAULT_STATUS_ORDER,
) => {
  const getOrder = useCallback(
    (statuses: KEY_STATUS[]): number =>
      statusOrder.findIndex((st) => statuses.includes(st)),
    [statusOrder],
  );

  return useMemo(
    () => keys?.sort((a, b) => getOrder(a.statuses) - getOrder(b.statuses)),
    [getOrder, keys],
  );
};
