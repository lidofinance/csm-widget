import {
  BondBalance,
  KEY_STATUS,
  KeyWithStatus,
} from '@lidofinance/lido-csm-sdk';
import { aggregateOperatorsOverview } from './aggregate-operators-overview';

const key = (status: KEY_STATUS, effectiveBalance?: bigint): KeyWithStatus => ({
  pubkey: '0x00',
  index: 0,
  statuses: [status],
  effectiveBalance,
});

const bond = (current: bigint, required: bigint): BondBalance => ({
  current,
  required,
  locked: 0n,
  debt: 0n,
  pendingToSplit: 0n,
  delta: current > required ? current - required : required - current,
  isInsufficient: current < required,
});

describe('aggregateOperatorsOverview', () => {
  it('sums validators, live keys, balances, and claimable across operators', () => {
    const summary = aggregateOperatorsOverview([
      {
        keys: [
          key(KEY_STATUS.ACTIVE, 32n),
          key(KEY_STATUS.DEPOSITABLE),
          key(KEY_STATUS.WITHDRAWN),
        ],
        bond: bond(10n, 8n),
        rewards: { available: 1n, shares: 0n, proof: [] },
        feeSplits: [],
      },
      {
        keys: [
          key(KEY_STATUS.EXITING, 32n),
          key(KEY_STATUS.ACTIVATION_PENDING),
        ],
        bond: bond(5n, 5n),
        rewards: { available: 0n, shares: 0n, proof: [] },
        feeSplits: [],
      },
    ]);
    expect(summary.activeValidators).toBe(2);
    expect(summary.liveKeys).toBe(4);
    expect(summary.activeBalance).toBe(64n);
    expect(summary.bondBalance).toBe(15n);
    expect(summary.availableToClaim).toBe(3n);
    expect(summary.totalIssues).toBe(0);
  });

  it('collects issue counts across operators', () => {
    const summary = aggregateOperatorsOverview([
      {
        keys: [key(KEY_STATUS.WITH_STRIKES), key(KEY_STATUS.INVALID)],
      },
      { keys: [key(KEY_STATUS.ACTIVE)] },
      { keys: [key(KEY_STATUS.UNBONDED)] },
    ]);
    expect(summary.totalIssues).toBe(3);
  });

  it('skips operators whose data is missing', () => {
    const summary = aggregateOperatorsOverview([{}]);
    expect(summary.activeValidators).toBe(0);
    expect(summary.bondBalance).toBe(0n);
    expect(summary.availableToClaim).toBe(0n);
  });
});
