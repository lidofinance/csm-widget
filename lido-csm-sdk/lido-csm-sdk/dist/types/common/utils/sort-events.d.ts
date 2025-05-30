import { Log } from 'viem';
export type NonPendingLog = Log<bigint, number, false>;
export declare const sortEventsByBlockNumber: (
  a: NonPendingLog,
  b: NonPendingLog,
) => number;
//# sourceMappingURL=sort-events.d.ts.map
