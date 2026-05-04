import {
  KeyWithStatus,
  MAX_EFFECTIVE_BALANCE,
  MIN_EFFECTIVE_BALANCE,
  NodeOperatorInfo,
  OperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { bigMax, bigMin } from 'utils';

export type StakeAndKeysData = {
  activeStake: bigint;
  activeKeys: number;
  depositableStake: bigint;
  depositableKeys: number;
  potentialAdditionalStake: bigint;
  potentialAdditionalKeys: number;
};

export const sumActiveKeysBalance = (keys: KeyWithStatus[]): bigint =>
  keys.reduce((acc, k) => acc + (k.effectiveBalance ?? 0n), 0n);

export const computeStakeData = (
  summary: OperatorStakeSummary,
  info: NodeOperatorInfo,
  keys?: KeyWithStatus[],
): StakeAndKeysData => {
  const activeKeys = info.totalDepositedKeys - info.totalWithdrawnKeys;
  // Contract skips operators without a group, returning currentStake = 0
  // even when the operator has active validators holding real CL balance.
  // Fall back to the sum of key effective balances in that case.
  const activeStake =
    summary.currentStake === 0n && keys
      ? sumActiveKeysBalance(keys)
      : summary.currentStake;
  const targetStake = summary.targetStake;

  const depositableKeys = info.totalVettedKeys - info.totalDepositedKeys;
  const maxDepositableStake =
    BigInt(activeKeys + depositableKeys) * MAX_EFFECTIVE_BALANCE - activeStake;
  const depositableStake = bigMax(
    0n,
    bigMin(targetStake - activeStake, maxDepositableStake),
  );

  const potentialAdditionalStake = bigMax(
    0n,
    targetStake - (activeStake + depositableStake),
  );
  const potentialAdditionalKeys =
    potentialAdditionalStake < MIN_EFFECTIVE_BALANCE
      ? 0
      : Number(
          (potentialAdditionalStake + MAX_EFFECTIVE_BALANCE - 1n) /
            MAX_EFFECTIVE_BALANCE,
        );

  return {
    activeStake,
    activeKeys,
    depositableStake,
    depositableKeys,
    potentialAdditionalStake,
    potentialAdditionalKeys,
  };
};
