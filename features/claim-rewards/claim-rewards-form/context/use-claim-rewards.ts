import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCSAccountingRPC, useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId, Proof } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { ClaimRewardsFormInputType } from '.';
import { useTxModalStagesClaimRewards } from '../hooks/use-tx-modal-stages-claim-rewards';
import { Zero } from '@ethersproject/constants';

type UseClaimRewardsOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ClaimRewardsMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
  cumulativeFeeShares: BigNumber;
  rewardsProof: Proof;
};

// encapsulates eth/steth/wsteth flows
const useClaimRewardsMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodETH = useCallback(
    async ({
      nodeOperatorId,
      amount,
      cumulativeFeeShares,
      rewardsProof,
    }: ClaimRewardsMethodParams) => {
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
    }: ClaimRewardsMethodParams) => {
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
    }: ClaimRewardsMethodParams) => {
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

export const useClaimRewards = ({
  onConfirm,
  onRetry,
}: UseClaimRewardsOptions) => {
  const nodeOperatorId = useNodeOperatorId(); // TODO: move to context
  const { txModalStages } = useTxModalStagesClaimRewards();
  const CSAccounting = useCSAccountingRPC();

  const getMethod = useClaimRewardsMethods();

  const claimRewards = useCallback(
    async ({
      amount,
      token,
      reward,
    }: ClaimRewardsFormInputType): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        const { method } = getMethod(token);

        txModalStages.sign(amount, token);

        const callback = await method({
          nodeOperatorId,
          amount,
          cumulativeFeeShares: reward?.shares || Zero,
          rewardsProof: reward?.proof || [],
        });

        const tx = await runWithTransactionLogger(
          'ClaimRewards signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(amount, token, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger(
            'ClaimRewards block confirmation',
            () => tx.wait(),
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
    [
      nodeOperatorId,
      getMethod,
      txModalStages,
      CSAccounting,
      onConfirm,
      onRetry,
    ],
  );

  return {
    claimRewards,
  };
};
