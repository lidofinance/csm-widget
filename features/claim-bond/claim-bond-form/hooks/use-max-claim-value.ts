import { useWatch } from 'react-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useClaimBondFormNetworkData } from '../context/use-claim-bond-form-network-data';
import { useAvailableToClaim } from 'shared/hooks';

export const useMaxClaimValue = () => {
  const claimRewards = useWatch<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
  });

  const { bond, rewards, lockedBond } = useClaimBondFormNetworkData();

  const availableToClaim = useAvailableToClaim({
    bond: bond,
    rewards: claimRewards ? rewards : undefined,
    lockedBond,
  });

  return availableToClaim;
};
