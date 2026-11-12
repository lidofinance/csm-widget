import {
  getStatusChips,
  type StatusChipId,
} from 'features/view-keys/status-filter/get-status-chips';
import type { KeysBreakdownCounts } from 'utils/keys-breakdown';

export type KeysStatusTone = 'tertiary' | 'warning' | 'error';

export type KeysStatusItem = {
  id: StatusChipId;
  label: string;
  count: number;
  tone: KeysStatusTone;
  testid: string;
};

const DASHBOARD_ITEMS: Partial<
  Record<StatusChipId, { tone: KeysStatusTone; testid: string }>
> = {
  depositable: { tone: 'tertiary', testid: 'keysDepositableCount' },
  activationPending: { tone: 'tertiary', testid: 'keysPendingActivationCount' },
  duplicated: { tone: 'warning', testid: 'keysDuplicatedCount' },
  withStrikes: { tone: 'error', testid: 'keysWithStrikesCount' },
  invalid: { tone: 'error', testid: 'keysInvalidCount' },
  unbonded: { tone: 'error', testid: 'keysUnbondedCount' },
  exitRequested: { tone: 'warning', testid: 'keysExitRequestedCount' },
  nonQueued: { tone: 'warning', testid: 'keysNonQueuedCount' },
  unchecked: { tone: 'warning', testid: 'keysUncheckedCount' },
};

/** Dashboard key items: the /keys chips minus active/exited/withdrawn, non-zero only */
export const getKeysStatusItems = (
  counts: KeysBreakdownCounts,
  {
    isCsmFamily,
    includeDepositable,
  }: { isCsmFamily: boolean; includeDepositable: boolean },
): KeysStatusItem[] =>
  getStatusChips(counts, { isCsmFamily }).flatMap(({ id, label, count }) => {
    const def = DASHBOARD_ITEMS[id];
    if (!def || count === 0) return [];
    if (id === 'depositable' && !includeDepositable) return [];
    return [{ id, label, count, ...def }];
  });
