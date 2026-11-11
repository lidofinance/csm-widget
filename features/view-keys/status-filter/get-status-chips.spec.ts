import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { selectKeysBreakdown } from 'utils/keys-breakdown';
import { getStatusChips, resolveStatusFilter } from './get-status-chips';

const key = (statuses: KEY_STATUS[]): KeyWithStatus => ({
  pubkey: '0x00',
  index: 0,
  statuses,
  effectiveBalance: undefined,
});

const { counts } = selectKeysBreakdown([
  key([KEY_STATUS.ACTIVE]),
  key([KEY_STATUS.EXITING]),
  key([KEY_STATUS.DEPOSITABLE, KEY_STATUS.WITH_STRIKES]),
  key([KEY_STATUS.WITHDRAWAL_PENDING]),
]);

describe('getStatusChips', () => {
  it('returns 12 chips in design order for the CSM family', () => {
    const chips = getStatusChips(counts, { isCsmFamily: true });
    expect(chips.map(({ label, variant }) => [label, variant])).toEqual([
      ['Active', 'success'],
      ['Depositable', 'warning'],
      ['Pending activation', 'warning'],
      ['Duplicated', 'error'],
      ['With strikes', 'error'],
      ['Invalid signature', 'error'],
      ['Unbonded', 'error'],
      ['Exited', 'neutral'],
      ['Withdrawn', 'neutral'],
      ['Exit requested', 'warning'],
      ['Non queued', 'warning'],
      ['Unchecked', 'warning'],
    ]);
  });

  it('drops withStrikes and nonQueued outside the CSM family', () => {
    const ids = getStatusChips(counts, { isCsmFamily: false }).map(
      ({ id }) => id,
    );
    expect(ids).toHaveLength(10);
    expect(ids).not.toContain('withStrikes');
    expect(ids).not.toContain('nonQueued');
  });

  it('copies counts from the keys breakdown', () => {
    const byId = Object.fromEntries(
      getStatusChips(counts, { isCsmFamily: true }).map((c) => [c.id, c.count]),
    );
    expect(byId).toMatchObject({
      active: 2,
      depositable: 1,
      withStrikes: 1,
      exited: 1,
    });
  });
});

describe('resolveStatusFilter', () => {
  const csmChips = getStatusChips(counts, { isCsmFamily: true });
  const cmChips = getStatusChips(counts, { isCsmFamily: false });

  it('accepts a known chip id', () => {
    expect(resolveStatusFilter('active', csmChips)).toBe('active');
  });

  it('keeps a zero-count chip id', () => {
    expect(resolveStatusFilter('exitRequested', csmChips)).toBe(
      'exitRequested',
    );
  });

  it('rejects ids missing from the current chips', () => {
    expect(resolveStatusFilter('withStrikes', cmChips)).toBeUndefined();
  });

  it('rejects unknown values and arrays', () => {
    expect(resolveStatusFilter('bogus', csmChips)).toBeUndefined();
    expect(resolveStatusFilter(['active'], csmChips)).toBeUndefined();
    expect(resolveStatusFilter(undefined, csmChips)).toBeUndefined();
  });
});
