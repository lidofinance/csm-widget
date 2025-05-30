import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useGetDefaultValues = ({
  rewards,
  isSplitter,
  isContract,
  loading,
}: ClaimBondFormNetworkData) => {
  return useDefaultValues<ClaimBondFormInputType>(
    useMemo(() => {
      if (Object.values(loading).some(Boolean)) {
        return undefined;
      }

      return {
        token: isContract ? TOKENS.wsteth : TOKENS.steth,
        claimRewards: Boolean(rewards?.available && rewards.available > 0),
        unlockClaimTokens: !isSplitter,
      };
    }, [isContract, isSplitter, loading, rewards?.available]),
  );
};
