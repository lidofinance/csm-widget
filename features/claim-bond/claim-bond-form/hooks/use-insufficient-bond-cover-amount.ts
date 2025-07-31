import { useClaimBondFormData } from '../context';

export const useInsufficientBondCoverAmount = () => {
  const { bond, rewards } = useClaimBondFormData();

  return bond?.isInsufficient
    ? bond.delta > (rewards?.available ?? 0n)
      ? rewards?.available
      : bond.delta
    : undefined;
};
