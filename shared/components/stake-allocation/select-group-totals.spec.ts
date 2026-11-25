import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { selectGroupTotals } from './select-group-totals';

const member = (n: number): StakeAndKeysData => ({
  activeStake: BigInt(n),
  activeKeys: n,
  depositableStake: BigInt(n * 2),
  depositableKeys: n * 2,
  potentialAdditionalStake: BigInt(n * 3),
  potentialAdditionalKeys: n * 3,
  targetStake: BigInt(n * 4),
  targetKeys: n * 4,
});

describe('selectGroupTotals', () => {
  it('returns zeros for no members', () => {
    expect(selectGroupTotals([])).toEqual({
      activeStake: 0n,
      activeKeys: 0,
      depositableStake: 0n,
      depositableKeys: 0,
      potentialAdditionalStake: 0n,
      potentialAdditionalKeys: 0,
      targetStake: 0n,
      targetKeys: 0,
    });
  });

  it('sums every field', () => {
    expect(selectGroupTotals([member(1), member(2)])).toEqual(member(3));
  });
});
