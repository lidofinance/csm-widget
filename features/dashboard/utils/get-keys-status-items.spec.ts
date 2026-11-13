import type { KeysBreakdownCounts } from 'utils/keys-breakdown';
import { getKeysStatusItems } from './get-keys-status-items';

const ZERO: KeysBreakdownCounts = {
  depositable: 0,
  activationPending: 0,
  active: 0,
  exited: 0,
  withdrawn: 0,
  withStrikes: 0,
  unbonded: 0,
  exitRequested: 0,
  nonQueued: 0,
  duplicated: 0,
  invalid: 0,
  unchecked: 0,
};

const ALL: KeysBreakdownCounts = {
  depositable: 1,
  activationPending: 1,
  active: 1,
  exited: 1,
  withdrawn: 1,
  withStrikes: 1,
  unbonded: 1,
  exitRequested: 1,
  nonQueued: 1,
  duplicated: 1,
  invalid: 1,
  unchecked: 1,
};

const opts = { isCsmFamily: true, includeDepositable: true };

describe('getKeysStatusItems', () => {
  it('returns nothing for all-zero counts', () => {
    expect(getKeysStatusItems(ZERO, opts)).toEqual([]);
  });

  it('ignores active, exited and withdrawn', () => {
    const counts = { ...ZERO, active: 5, exited: 2, withdrawn: 3 };
    expect(getKeysStatusItems(counts, opts)).toEqual([]);
  });

  it('returns every bucket in chip order with tones and testids', () => {
    const items = getKeysStatusItems(ALL, opts);
    expect(items.map(({ id, tone, testid }) => [id, tone, testid])).toEqual([
      ['depositable', 'tertiary', 'keysDepositableCount'],
      ['activationPending', 'tertiary', 'keysPendingActivationCount'],
      ['duplicated', 'warning', 'keysDuplicatedCount'],
      ['withStrikes', 'error', 'keysWithStrikesCount'],
      ['invalid', 'error', 'keysInvalidCount'],
      ['unbonded', 'error', 'keysUnbondedCount'],
      ['exitRequested', 'warning', 'keysExitRequestedCount'],
      ['nonQueued', 'warning', 'keysNonQueuedCount'],
      ['unchecked', 'warning', 'keysUncheckedCount'],
    ]);
    expect(items.every(({ count }) => count === 1)).toBe(true);
  });

  it('keeps chip labels and counts', () => {
    const items = getKeysStatusItems({ ...ZERO, withStrikes: 4 }, opts);
    expect(items).toEqual([
      {
        id: 'withStrikes',
        label: 'With strikes',
        count: 4,
        tone: 'error',
        testid: 'keysWithStrikesCount',
      },
    ]);
  });

  it('drops depositable when not included', () => {
    const items = getKeysStatusItems(ALL, {
      ...opts,
      includeDepositable: false,
    });
    expect(items.map(({ id }) => id)).not.toContain('depositable');
    expect(items).toHaveLength(8);
  });

  it('omits CSM-family-only items for CM', () => {
    const ids = getKeysStatusItems(ALL, {
      isCsmFamily: false,
      includeDepositable: true,
    }).map(({ id }) => id);
    expect(ids).not.toContain('withStrikes');
    expect(ids).not.toContain('nonQueued');
  });
});
