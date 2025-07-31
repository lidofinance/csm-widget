import { useUnlockBondFormData } from '../context';

export const useMaxValue = () => {
  const { lockedBond, ethBalance } = useUnlockBondFormData();
  return lockedBond && ethBalance
    ? lockedBond < ethBalance
      ? lockedBond
      : ethBalance
    : 0n;
};
