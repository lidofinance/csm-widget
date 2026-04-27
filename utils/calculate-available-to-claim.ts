import { BondBalance, Rewards } from '@lidofinance/lido-csm-sdk';
import { bigMax, bigMin } from './bigint-utils';

type Props = {
  bond?: BondBalance;
  rewards?: Rewards;
  hasSplits?: boolean;
};

export const calculateAvailableToClaim = ({
  bond,
  rewards,
  hasSplits,
}: Props) => {
  if (!bond) return 0n;
  const distributed = rewards?.available ?? 0n;

  const claimable = bigMax(
    0n,
    bond.current + distributed - bond.required - bond.locked - bond.debt,
  );

  const pendingTotal = bond.pendingToSplit + distributed;
  const splittable = hasSplits ? bigMin(claimable, pendingTotal) : 0n;

  return claimable - splittable;
};
