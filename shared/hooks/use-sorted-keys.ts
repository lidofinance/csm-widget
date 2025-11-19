import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { sorting } from 'providers/table-provider/utils';
import { useMemo } from 'react';

export const ACTIVE_STATUS_ORDER: KEY_STATUS[] = [
  KEY_STATUS.ACTIVATION_PENDING,
  KEY_STATUS.ACTIVE,
  KEY_STATUS.EXITING,
  KEY_STATUS.WITHDRAWAL_PENDING,
  KEY_STATUS.WITHDRAWN,
  KEY_STATUS.DEPOSITABLE,

  KEY_STATUS.INVALID,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.EXIT_REQUESTED,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.SLASHED,
];

const sortByStatusOrder = (statusOrder: KEY_STATUS[]) => {
  return ({ statuses }: Pick<KeyWithStatus, 'statuses'>) => [
    statusOrder.findIndex((st) => statuses.includes(st)),
  ];
};

export const byActiveStatus = sorting<KeyWithStatus>(
  sortByStatusOrder(ACTIVE_STATUS_ORDER),
);

export const useSortedKeys = (keys: KeyWithStatus[] = []) =>
  useMemo(() => Array.from(keys).sort(byActiveStatus), [keys]);
