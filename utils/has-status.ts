import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';

export type StatusFilter = KEY_STATUS | KEY_STATUS[];

export const hasStatus =
  (filter: StatusFilter) =>
  ({ statuses }: KeyWithStatus) =>
    (Array.isArray(filter) ? filter : [filter]).some((st) =>
      statuses.includes(st),
    );
