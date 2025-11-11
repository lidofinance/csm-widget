import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useClaimBondDefaultValues = () => {
  return useFormDefaultValues<ClaimBondFormInputType, ClaimBondFormNetworkData>(
    (data) => ({
      token: data.isContract ? TOKENS.wsteth : TOKENS.steth,
      claimRewards: false,
      unlockedClaimTokens: false,
    }),
  );
};
