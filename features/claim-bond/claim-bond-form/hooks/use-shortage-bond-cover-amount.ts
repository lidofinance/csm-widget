import { Zero } from '@ethersproject/constants';
import { useClaimBondFormData } from '../context';

export const useShortageBondCoverAmount = () => {
  const { bond, rewards } = useClaimBondFormData();

  return bond?.isShortage
    ? bond.delta.gt(rewards?.available ?? Zero)
      ? rewards?.available
      : bond.delta
    : undefined;
};
