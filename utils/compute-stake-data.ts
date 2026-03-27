import {
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

export const computeStakeData = (
  summary: OperatorStakeSummary,
  info: NodeOperatorInfo,
): StakeAndKeysData => {
  const activeKeys = info.totalDepositedKeys - info.totalWithdrawnKeys;
  const activeStake = summary.currentStake;
  const targetStake = summary.targetStake;

  const depositableKeys = info.totalAddedKeys - info.totalDepositedKeys;
  const maxDepositableStake =
    BigInt(activeKeys + depositableKeys) * MAX_EFFECTIVE_BALANCE;
  const depositableStake = bigMax(
    0n,
    bigMin(targetStake - activeStake, maxDepositableStake),
  );

  const potentialAdditionalStake = bigMax(
    0n,
    targetStake - (activeStake + depositableStake),
  );
  const potentialAdditionalKeys = Math.max(
    Number(potentialAdditionalStake / MAX_EFFECTIVE_BALANCE),
    potentialAdditionalStake >= MIN_EFFECTIVE_BALANCE ? 1 : 0,
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
