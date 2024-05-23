import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { useTxModalStagesResetRole } from '../hooks/use-tx-modal-stages-reset-role';
import { ROLES } from 'consts/roles';

type UseResetRoleOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ResetRoleMethodParams = {
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useResetRoleMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const method = useCallback(
    async ({ nodeOperatorId }: ResetRoleMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.resetNodeOperatorManagerAddress(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.resetNodeOperatorManagerAddress(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(() => {
    return method;
  }, [method]);
};

export const useResetRole = ({ onConfirm, onRetry }: UseResetRoleOptions) => {
  const nodeOperatorId = useNodeOperatorId(); // TODO: move to context
  const { txModalStages } = useTxModalStagesResetRole();

  const getMethod = useResetRoleMethods();

  const resetRole = useCallback(async (): Promise<boolean> => {
    invariant(nodeOperatorId, 'NodeOperatorId is not defined');

    try {
      const method = getMethod();

      txModalStages.sign('0x0', ROLES.MANAGER);

      const callback = await method({
        nodeOperatorId,
      });

      const tx = await runWithTransactionLogger('ResetRole signing', callback);
      const txHash = typeof tx === 'string' ? tx : tx.hash;

      txModalStages.pending('0x0', ROLES.MANAGER, txHash);

      if (typeof tx === 'object') {
        await runWithTransactionLogger('ResetRole block confirmation', () =>
          tx.wait(),
        );
      }

      await onConfirm?.();

      txModalStages.success('0x0', ROLES.MANAGER, txHash);

      return true;
    } catch (error) {
      console.warn(error);
      txModalStages.failed(error, onRetry);
      return false;
    }
  }, [nodeOperatorId, getMethod, txModalStages, onConfirm, onRetry]);

  return {
    resetRole,
  };
};
