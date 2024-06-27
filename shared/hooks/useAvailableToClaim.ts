import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { BondBalance } from 'types';

type Props = {
  balance?: BondBalance;
  rewards?: BigNumber;
  locked?: BigNumber;
};

export const useAvailableToClaim = ({ balance, rewards, locked }: Props) => {
  return useMemo(() => {
    const total = balance?.current
      .add(rewards ?? Zero)
      .sub(balance.required)
      .sub(locked ?? Zero);
    return total?.gt(0) ? total : Zero;
  }, [balance, locked, rewards]);
};
