import { Zero } from '@ethersproject/constants';
import { useClaimBondFormNetworkData } from '../context/use-claim-bond-form-network-data';

export const useShortageBondCoverAmount = () => {
  const { bond, rewards } = useClaimBondFormNetworkData();

  return bond?.isShortage
    ? bond.delta.gt(rewards?.available ?? Zero)
      ? rewards?.available
      : bond.delta
    : undefined;
};
