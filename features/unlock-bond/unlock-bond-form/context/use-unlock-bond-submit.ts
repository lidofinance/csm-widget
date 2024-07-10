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
  UnlockBondFormDataContextValue,
  UnlockBondFormInputType,
} from '../context';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';

type UseUnlockBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type UnlockBondMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
  cumulativeFeeShares: BigNumber;
  rewardsProof: Proof;
};

// TODO: unlock bond method
// encapsulates eth/steth/wsteth flows
const useUnlockBondMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodETH = useCallback(
    async ({
      nodeOperatorId,
      amount,
      cumulativeFeeShares,
      rewardsProof,
    }: UnlockBondMethodParams) => {
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
        await CSModuleWeb3.estimateGas.unlockRewardsUnstETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.unlockRewardsUnstETH(...params, {
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
    }: UnlockBondMethodParams) => {
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
        await CSModuleWeb3.estimateGas.unlockRewardsStETH(...params, overrides);

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.unlockRewardsStETH(...params, {
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
    }: UnlockBondMethodParams) => {
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
        await CSModuleWeb3.estimateGas.unlockRewardsWstETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.unlockRewardsWstETH(...params, {
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

export const useUnlockBondSubmit = ({
  onConfirm,
  onRetry,
}: UseUnlockBondOptions) => {
  const { txModalStages } = useTxModalStagesUnlockBond();
  const CSAccounting = useCSAccountingRPC();

  const getMethod = useUnlockBondMethods();

  const unlockBond = useCallback(
    async (
      { amount, token }: UnlockBondFormInputType,
      { nodeOperatorId }: UnlockBondFormDataContextValue,
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
          'UnlockBond signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(amount, token, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('UnlockBond block confirmation', () =>
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
    unlockBond,
  };
};
