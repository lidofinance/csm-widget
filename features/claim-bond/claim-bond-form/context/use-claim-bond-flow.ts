import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useTxModalStagesClaimBond } from '../hooks/use-tx-modal-stages-claim-bond';
import { useClaimBondFormData } from './claim-bond-data-provider';
import { optionIncludesRewards, optionShowsTokenAmount } from './claim-options';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export type ClaimBondFlow =
  | { action: 'no-access'; access: MethodAccess }
  | ({ action: 'claim' } & Executable);

export const useClaimBondFlowResolver = (): FlowResolver<
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
  ClaimBondFlow
> => {
  const { bond: bondSDK } = useSmSDK();
  const [canClaim, claimAccess] = useCanPerform(bondSDK, 'claimBond');
  const buildCallback = useTxModalStagesClaimBond();

  return useCallback(
    (input, data) => {
      if (!canClaim) return { action: 'no-access', access: claimAccess };

      const includeRewards = optionIncludesRewards(input.claimOption);
      const amount = optionShowsTokenAmount(input.claimOption)
        ? (input.amount ?? 0n)
        : 0n;

      return {
        action: 'claim' as const,
        submit: (onRetry) =>
          bondSDK.claimBond({
            nodeOperatorId: data.nodeOperatorId,
            token: input.token,
            amount,
            proof: includeRewards ? data.rewards?.proof : undefined,
            shares: includeRewards ? data.rewards?.shares : undefined,
            callback: buildCallback(input, data, onRetry),
          }),
      };
    },
    [bondSDK, canClaim, claimAccess, buildCallback],
  );
};

export const useClaimBondFlow = (): ClaimBondFlow => {
  const resolve = useClaimBondFlowResolver();
  const data = useClaimBondFormData(true);
  return resolve({} as ClaimBondFormInputType, data);
};
