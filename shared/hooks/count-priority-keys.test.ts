import { DepositQueueBatch } from '@lidofinance/lido-csm-sdk';
import { countPriorityKeys } from './count-priority-keys';

const batch = (nodeOperatorId: bigint, keysCount: number): DepositQueueBatch => ({
  nodeOperatorId,
  keysCount,
});

describe('countPriorityKeys', () => {
  it('returns undefined when batches are missing', () => {
    expect(countPriorityKeys(undefined, 1n)).toBeUndefined();
  });

  it('returns undefined when the operator id is missing', () => {
    expect(countPriorityKeys([[batch(1n, 5)]], undefined)).toBeUndefined();
  });

  it('sums the operator batches across every priority queue below the general queue', () => {
    const allBatches = [
      [batch(1n, 3), batch(2n, 1)],
      [batch(1n, 2)],
      [batch(1n, 100), batch(2n, 1)], // general queue, excluded
    ];
    expect(countPriorityKeys(allBatches, 1n)).toBe(5);
  });

  it('returns 0 when the operator has no batches in any priority queue', () => {
    const allBatches = [[batch(2n, 3)], [batch(3n, 1)], [batch(2n, 10)]];
    expect(countPriorityKeys(allBatches, 1n)).toBe(0);
  });

  it('returns 0 when there is only a general queue', () => {
    expect(countPriorityKeys([[batch(1n, 10)]], 1n)).toBe(0);
  });

  it('returns 0 for an empty batches array', () => {
    expect(countPriorityKeys([], 1n)).toBe(0);
  });
});
