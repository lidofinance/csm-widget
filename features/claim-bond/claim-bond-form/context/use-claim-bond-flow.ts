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
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
} from './types';
import { useWatch } from 'react-hook-form';

export type ClaimBondFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'nothing' }
  | ({
      action: 'claim';
      includeRewards: boolean;
      showAmount: boolean;
      maxValueIndex: 0 | 1;
    } & Executable);

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

      if (
        !data?.rewards?.available &&
        (!data?.bond?.delta || data?.bond?.isInsufficient)
      ) {
        return { action: 'nothing' };
      }

      const rewardsFullyCoverInsufficient =
        data.bond.isInsufficient && data.bond.delta >= data.rewards.available;
      const includeRewards = input.claimOption !== CLAIM_OPTION.BOND_TO_RA;
      const showAmount =
        input.claimOption !== CLAIM_OPTION.REWARDS_TO_BOND &&
        !(
          input.claimOption === CLAIM_OPTION.ALL_TO_RA &&
          rewardsFullyCoverInsufficient
        );
      const amount = showAmount ? (input.amount ?? 0n) : 0n;
      const maxValueIndex =
        input.claimOption === CLAIM_OPTION.BOND_TO_RA ? 0 : 1;

      return {
        action: 'claim',
        includeRewards,
        showAmount,
        maxValueIndex,
        submit: () =>
          bondSDK.claimBond({
            nodeOperatorId: data.nodeOperatorId,
            token: input.token,
            amount,
            proof: includeRewards ? data.rewards?.proof : undefined,
            shares: includeRewards ? data.rewards?.shares : undefined,
            callback: buildCallback(input, data),
          }),
      };
    },
    [bondSDK, canClaim, claimAccess, buildCallback],
  );
};

export const useClaimBondFlow = (): ClaimBondFlow => {
  const resolve = useClaimBondFlowResolver();
  const data = useClaimBondFormData(true);
  const [token, claimOption, amount, unlockedClaimTokens] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption', 'amount', 'unlockedClaimTokens']
  >({ name: ['token', 'claimOption', 'amount', 'unlockedClaimTokens'] });

  return resolve({ token, claimOption, amount, unlockedClaimTokens }, data);
};
