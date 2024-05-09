import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  ClaimRewardsFormInputType,
  ClaimRewardsFormNetworkData,
} from './types';

export const useUpdateProof = (
  { setValue }: UseFormReturn<ClaimRewardsFormInputType>,
  { proof, totalRewards: shares, loading }: ClaimRewardsFormNetworkData,
) => {
  useEffect(() => {
    setValue(
      'reward',
      loading.isRewardsLoading || !proof || !shares
        ? undefined
        : {
            proof,
            shares,
          },
    );
  }, [loading.isRewardsLoading, proof, setValue, shares]);
};
