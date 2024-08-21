import { Zero } from '@ethersproject/constants';
import { useMemo } from 'react';
import { BondBalance, RewardsBalance } from 'types';

type Props = {
  bond?: BondBalance;
  rewards?: RewardsBalance;
};

export const useAvailableToClaim = ({ bond, rewards }: Props) => {
  return useMemo(() => {
    const total = bond?.current
      .add(rewards?.available ?? Zero)
      .sub(bond.required)
      .sub(bond.locked);
    return total?.gt(0) ? total : Zero;
  }, [bond, rewards]);
};
