import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { BondBalance, RewardsBalance } from 'types';

type Props = {
  bond?: BondBalance;
  rewards?: RewardsBalance;
  lockedBond?: BigNumber;
};

export const useAvailableToClaim = ({ bond, rewards, lockedBond }: Props) => {
  return useMemo(() => {
    const total = bond?.current
      .add(rewards?.available ?? Zero)
      .sub(bond.required)
      .sub(lockedBond ?? Zero);
    return total?.gt(0) ? total : Zero;
  }, [bond, lockedBond, rewards]);
};
