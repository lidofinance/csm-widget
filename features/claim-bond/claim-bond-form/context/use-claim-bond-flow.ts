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

      return {
        action: 'claim' as const,
        submit: (onRetry) =>
          bondSDK.claimBond({
            nodeOperatorId: data.nodeOperatorId,
            token: input.token,
            amount: input.amount ?? 0n,
            proof: data.rewards?.proof,
            shares: data.rewards?.shares,
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
