import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { useCSAccountingRPC, useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId, Proof } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import {
  ClaimBondFormDataContextValue,
  ClaimBondFormInputType,
} from '../context';
import { useTxModalStagesClaimBond } from '../hooks/use-tx-modal-stages-claim-bond';

type UseClaimBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ClaimBondMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
  cumulativeFeeShares: BigNumber;
  rewardsProof: Proof;
};

// encapsulates eth/steth/wsteth flows
const useClaimBondMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodETH = useCallback(
    async ({
      nodeOperatorId,
      amount,
      cumulativeFeeShares,
      rewardsProof,
    }: ClaimBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        nodeOperatorId,
        amount,
        cumulativeFeeShares,
        rewardsProof,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.claimRewardsUnstETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.claimRewardsUnstETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const methodSTETH = useCallback(
    async ({
      nodeOperatorId,
      amount,
      cumulativeFeeShares,
      rewardsProof,
    }: ClaimBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        nodeOperatorId,
        amount,
        cumulativeFeeShares,
        rewardsProof,
      ] as const;

      const originalGasLimit = await CSModuleWeb3.estimateGas.claimRewardsStETH(
        ...params,
        overrides,
      );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.claimRewardsStETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const methodWSTETH = useCallback(
    async ({
      nodeOperatorId,
      amount,
      cumulativeFeeShares,
      rewardsProof,
    }: ClaimBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        nodeOperatorId,
        amount,
        cumulativeFeeShares,
        rewardsProof,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.claimRewardsWstETH(...params, overrides);

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.claimRewardsWstETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(
    (token: TOKENS) => {
      switch (token) {
        case TOKENS.ETH:
          return { method: methodETH };
        case TOKENS.STETH:
          return { method: methodSTETH };
        case TOKENS.WSTETH:
          return { method: methodWSTETH };
      }
    },
    [methodETH, methodSTETH, methodWSTETH],
  );
};

export const useClaimBondSubmit = ({
  onConfirm,
  onRetry,
}: UseClaimBondOptions) => {
  const { txModalStages } = useTxModalStagesClaimBond();
  const CSAccounting = useCSAccountingRPC();

  const getMethod = useClaimBondMethods();

  const claimBond = useCallback(
    async (
      { amount, token }: ClaimBondFormInputType,
      { nodeOperatorId }: ClaimBondFormDataContextValue,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        const { method } = getMethod(token);

        txModalStages.sign(amount, token);
        const cumulativeFeeShares = Zero;
        const rewardsProof: Proof = [];

        const callback = await method({
          nodeOperatorId,
          amount,
          cumulativeFeeShares,
          rewardsProof,
        });

        const tx = await runWithTransactionLogger(
          'ClaimBond signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(amount, token, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('ClaimBond block confirmation', () =>
            tx.wait(),
          );
        }

        // TODO: revalidate in provider
        const { current } = await CSAccounting.getBondSummary(nodeOperatorId);

        await onConfirm?.();

        txModalStages.success(current, TOKENS.STETH, txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getMethod, txModalStages, CSAccounting, onConfirm, onRetry],
  );

  return {
    claimBond,
  };
};
