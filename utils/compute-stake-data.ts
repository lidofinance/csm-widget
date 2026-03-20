import {
  NodeOperatorInfo,
  OperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { bigMax } from 'utils';
import { parseEther } from 'viem';

// TODO: read from sdk
const MAX_EFFECTIVE_BALANCE = parseEther('2048');
const MIN_EFFECTIVE_BALANCE = parseEther('32');

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

  const depositableKeys = info.totalAddedKeys - info.totalDepositedKeys;
  const depositableStake = bigMax(
    0n,
    BigInt(activeKeys + depositableKeys) * MAX_EFFECTIVE_BALANCE - activeStake,
  );

  const targetStake = summary.targetStake;
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
