import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
} from './types';

export const useClaimBondDefaultValues = () => {
  return useFormDefaultValues<ClaimBondFormInputType, ClaimBondFormNetworkData>(
    (data) => ({
      token: data.isContract ? TOKENS.wsteth : TOKENS.steth,
      claimOption: data.availableOptions[0] || CLAIM_OPTION.BOND_TO_RA,
      unlockedClaimTokens: false,
    }),
  );
};
