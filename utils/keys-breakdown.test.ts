import {
  KEY_STATUS,
  KeyWithStatus,
  MIN_EFFECTIVE_BALANCE,
} from '@lidofinance/lido-csm-sdk';
import { selectKeysBreakdown } from './keys-breakdown';

const key = (
  statuses: KEY_STATUS[],
  effectiveBalance?: bigint,
): KeyWithStatus => ({
  pubkey: '0x00',
  index: 0,
  statuses,
  effectiveBalance,
});

describe('selectKeysBreakdown', () => {
  it('counts each status group', () => {
    const { counts } = selectKeysBreakdown([
      key([KEY_STATUS.DEPOSITABLE]),
      key([KEY_STATUS.ACTIVATION_PENDING]),
      key([KEY_STATUS.ACTIVE]),
      key([KEY_STATUS.EXITING]),
      key([KEY_STATUS.WITHDRAWAL_PENDING]),
      key([KEY_STATUS.WITHDRAWN]),
    ]);
    expect(counts.depositable).toBe(1);
    expect(counts.activationPending).toBe(1);
    expect(counts.active).toBe(2);
    expect(counts.exited).toBe(1);
    expect(counts.withdrawn).toBe(1);
  });

  it('counts distinct issue statuses, not keys', () => {
    const { issuesCount } = selectKeysBreakdown([
      key([KEY_STATUS.ACTIVE, KEY_STATUS.WITH_STRIKES]),
      key([KEY_STATUS.ACTIVE, KEY_STATUS.WITH_STRIKES]),
      key([KEY_STATUS.DEPOSITABLE, KEY_STATUS.INVALID]),
    ]);
    expect(issuesCount).toBe(2);
  });

  it('reports zero issues for healthy keys', () => {
    expect(selectKeysBreakdown([key([KEY_STATUS.ACTIVE])]).issuesCount).toBe(0);
  });

  it('sums balances for each bucket', () => {
    const { balances } = selectKeysBreakdown([
      key([KEY_STATUS.DEPOSITABLE]),
      key([KEY_STATUS.DEPOSITABLE]),
      key([KEY_STATUS.ACTIVATION_PENDING], 32n),
      key([KEY_STATUS.ACTIVE], 32n),
      key([KEY_STATUS.EXITING], 16n),
      key([KEY_STATUS.WITHDRAWAL_PENDING], 8n),
      key([KEY_STATUS.WITHDRAWN]),
    ]);
    expect(balances.depositable).toBe(2n * MIN_EFFECTIVE_BALANCE);
    expect(balances.activationPending).toBe(32n);
    expect(balances.active).toBe(48n);
    expect(balances.withdrawn).toBe(8n);
  });
});
