import type { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { getClaimTypeSummary } from './claim-type-summary';

const curve = (
  patch: Partial<
    Pick<CurveParameters, 'bondConfig' | 'rewardsConfig' | 'queueConfig'>
  >,
) => patch as CurveParameters;

const DEFAULT_CURVE = curve({
  bondConfig: [
    { minKeyNumber: 1, value: 2_400_000_000_000_000_000n },
    { minKeyNumber: 2, value: 1_300_000_000_000_000_000n },
  ],
  rewardsConfig: [{ minKeyNumber: 1, value: 350n }],
  queueConfig: { priority: 5, lowestPriority: 5, maxDeposits: 0 },
});

const ICS_CURVE = curve({
  bondConfig: [
    { minKeyNumber: 1, value: 1_500_000_000_000_000_000n },
    { minKeyNumber: 2, value: 1_300_000_000_000_000_000n },
  ],
  rewardsConfig: [
    { minKeyNumber: 1, value: 600n },
    { minKeyNumber: 17, value: 350n },
  ],
  queueConfig: { priority: 0, lowestPriority: 5, maxDeposits: 10 },
});

describe('getClaimTypeSummary', () => {
  it('is undefined without parameters', () => {
    expect(getClaimTypeSummary(undefined)).toBeUndefined();
  });

  it('takes the first bond and reward intervals', () => {
    expect(getClaimTypeSummary(ICS_CURVE)).toEqual({
      bondFirstKey: 1_500_000_000_000_000_000n,
      reward: 600n,
      rewardKeys: 16,
      priorityKeys: 10,
    });
  });

  it('has no reward key count for a single reward interval', () => {
    expect(getClaimTypeSummary(DEFAULT_CURVE)?.rewardKeys).toBeUndefined();
  });

  it('counts no priority keys for a general-queue-only curve', () => {
    expect(getClaimTypeSummary(DEFAULT_CURVE)?.priorityKeys).toBe(0);
  });

  it('leaves empty configs undefined', () => {
    expect(
      getClaimTypeSummary(curve({ bondConfig: [], rewardsConfig: [] })),
    ).toEqual({ priorityKeys: 0 });
  });
});
