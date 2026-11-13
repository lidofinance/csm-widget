import type { StakeAndKeysData } from 'utils/compute-stake-data';

const ZERO: StakeAndKeysData = {
  activeStake: 0n,
  activeKeys: 0,
  depositableStake: 0n,
  depositableKeys: 0,
  potentialAdditionalStake: 0n,
  potentialAdditionalKeys: 0,
  targetStake: 0n,
  targetKeys: 0,
};

export const selectGroupTotals = (
  members: StakeAndKeysData[],
): StakeAndKeysData =>
  members.reduce<StakeAndKeysData>(
    (acc, m) => ({
      activeStake: acc.activeStake + m.activeStake,
      activeKeys: acc.activeKeys + m.activeKeys,
      depositableStake: acc.depositableStake + m.depositableStake,
      depositableKeys: acc.depositableKeys + m.depositableKeys,
      potentialAdditionalStake:
        acc.potentialAdditionalStake + m.potentialAdditionalStake,
      potentialAdditionalKeys:
        acc.potentialAdditionalKeys + m.potentialAdditionalKeys,
      targetStake: acc.targetStake + m.targetStake,
      targetKeys: acc.targetKeys + m.targetKeys,
    }),
    ZERO,
  );
