import {
  BondBalance,
  FeeSplit,
  PERCENT_BASIS,
  Rewards,
} from '@lidofinance/lido-csm-sdk';
import { bigMax, bigMin } from './bigint-utils';

type Props = {
  bond?: BondBalance;
  rewards?: Rewards;
  feeSplits?: FeeSplit[];
};

export const calculateAvailableToClaim = ({
  bond,
  rewards,
  feeSplits,
}: Props) => {
  if (!bond) return 0n;
  const distributed = rewards?.available ?? 0n;

  const claimable = bigMax(
    0n,
    bond.current + distributed - bond.required - bond.locked - bond.debt,
  );

  const totalShare = feeSplits?.reduce((sum, s) => sum + s.share, 0n) ?? 0n;
  const splittableGross = bigMin(claimable, bond.pendingToSplit + distributed);
  const splitterCut = (splittableGross * totalShare) / PERCENT_BASIS;

  return claimable - splitterCut;
};
