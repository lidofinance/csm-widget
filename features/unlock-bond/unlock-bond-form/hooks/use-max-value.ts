import { Zero } from '@ethersproject/constants';
import { useUnlockBondFormData } from '../context';

export const useMaxValue = () => {
  const { lockedBond, etherBalance } = useUnlockBondFormData();
  return lockedBond && etherBalance
    ? lockedBond?.lt(etherBalance)
      ? lockedBond
      : etherBalance
    : Zero;
};
