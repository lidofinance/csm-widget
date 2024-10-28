import { TOKENS } from 'consts/tokens';
import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useGetDefaultValues = ({
  rewards,
  loading,
}: ClaimBondFormNetworkData) => {
  return useDefaultValues<ClaimBondFormInputType>(
    useMemo(() => {
      if (Object.values(loading).some(Boolean)) {
        return undefined;
      }

      return {
        token: TOKENS.STETH,
        claimRewards: rewards?.available.gt(0) ?? false,
      };
    }, [loading, rewards?.available]),
  );
};
