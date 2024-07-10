import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import { useCSAccountingRPC, useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
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
};

// TODO: unlock bond method
// encapsulates eth/steth/wsteth flows
const useUnlockBondMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodETH = useCallback(
    async ({ nodeOperatorId, amount }: UnlockBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        value: amount,
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.compensateELRewardsStealingPenalty(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.compensateELRewardsStealingPenalty(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(() => {
    return { method: methodETH };
  }, [methodETH]);
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
      { amount }: UnlockBondFormInputType,
      { nodeOperatorId }: UnlockBondFormDataContextValue,
    ): Promise<boolean> => {
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        const { method } = getMethod();

        txModalStages.sign(amount, TOKENS.ETH);

        const callback = await method({
          nodeOperatorId,
          amount,
        });

        const tx = await runWithTransactionLogger(
          'UnlockBond signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(amount, TOKENS.ETH, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('UnlockBond block confirmation', () =>
            tx.wait(),
          );
        }

        await onConfirm?.();

        // TODO: revalidate in provider
        const current = await CSAccounting.getActualLockedBond(nodeOperatorId);

        txModalStages.success(current, TOKENS.ETH, txHash);

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
