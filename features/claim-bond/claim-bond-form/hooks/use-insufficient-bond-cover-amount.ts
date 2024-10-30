import { Zero } from '@ethersproject/constants';
import { useClaimBondFormData } from '../context';

export const useInsufficientBondCoverAmount = () => {
  const { bond, rewards } = useClaimBondFormData();

  return bond?.isInsufficient
    ? bond.delta.gt(rewards?.available ?? Zero)
      ? rewards?.available
      : bond.delta
    : undefined;
};
