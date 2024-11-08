import { TOKENS } from 'consts/tokens';
import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

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
        token: isContract ? TOKENS.WSTETH : TOKENS.STETH,
        claimRewards: rewards?.available.gt(0) ?? false,
        unlockClaimTokens: !isSplitter,
      };
    }, [isContract, isSplitter, loading, rewards?.available]),
  );
};
