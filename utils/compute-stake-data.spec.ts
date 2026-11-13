import {
  MAX_EFFECTIVE_BALANCE,
  type NodeOperatorInfo,
  type OperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import { computeStakeData } from './compute-stake-data';

const eth = (n: number) => parseEther(String(n));
const summary = (current: bigint, target: bigint, external = 0n) =>
  ({
    currentStake: current,
    targetStake: target,
    externalStake: external,
  }) as OperatorStakeSummary;
const info = (deposited: number, depositable: number, withdrawn = 0) =>
  ({
    totalDepositedKeys: deposited,
    totalWithdrawnKeys: withdrawn,
    depositableValidatorsCount: depositable,
  }) as NodeOperatorInfo;

describe('computeStakeData targetKeys', () => {
  it('counts 32 ETH keys plus 2048 ETH keys for the gap', () => {
    const data = computeStakeData(summary(eth(320), eth(4096)), info(10, 0));
    expect(data.targetStake).toBe(eth(4096));
    expect(data.targetKeys).toBe(12);
  });

  it('does not over-count spare depositable keys', () => {
    const data = computeStakeData(
      summary(10n * MAX_EFFECTIVE_BALANCE, 11n * MAX_EFFECTIVE_BALANCE),
      info(10, 10),
    );
    expect(data.targetKeys).toBe(11);
    expect(data.potentialAdditionalKeys).toBe(0);
  });

  it('equals active keys when over-allocated', () => {
    expect(
      computeStakeData(summary(eth(3000), eth(2048)), info(2, 0)).targetKeys,
    ).toBe(2);
  });

  it('equals active keys plus the depositable span when exactly filled', () => {
    const data = computeStakeData(summary(eth(2048), eth(4096)), info(1, 1));
    expect(data.potentialAdditionalKeys).toBe(0);
    expect(data.targetKeys).toBe(2);
  });

  it('is active keys for a zero target', () => {
    const data = computeStakeData(summary(eth(64), 0n), info(2, 0));
    expect(data.targetStake).toBe(0n);
    expect(data.targetKeys).toBe(2);
  });

  it('ignores a gap below MIN_EFFECTIVE_BALANCE', () => {
    expect(
      computeStakeData(summary(eth(2048), eth(2064)), info(1, 0)).targetKeys,
    ).toBe(1);
  });

  it('subtracts external stake from both active and target', () => {
    const data = computeStakeData(
      summary(eth(2048), eth(4096), eth(2048)),
      info(1, 0),
    );
    expect(data.targetStake).toBe(eth(2048));
    expect(data.targetKeys).toBe(2);
  });
});
