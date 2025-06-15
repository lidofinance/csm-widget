import { BondBalance, Rewards } from '@lidofinance/lido-csm-sdk';

type Props = {
  bond?: BondBalance;
  rewards?: Rewards;
};

export const useAvailableToClaim = ({ bond, rewards }: Props) => {
  if (!bond) return 0n;

  const total =
    bond.current + (rewards?.available ?? 0n) - bond.required - bond.locked;
  return total > 0n ? total : 0n;
};
