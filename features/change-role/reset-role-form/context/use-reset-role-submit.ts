import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { ROLES } from 'consts/roles';
import { useNodeOperator } from 'providers/node-operator-provider';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { ResetRoleFormDataContextValue, ResetRoleFormInputType } from '.';
import { useTxModalStagesResetRole } from '../hooks/use-tx-modal-stages-reset-role';

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

export const useResetRoleSubmit = ({
  onConfirm,
  onRetry,
}: UseResetRoleOptions) => {
  const { txModalStages } = useTxModalStagesResetRole();
  const { append: appendNO } = useNodeOperator();

  const getMethod = useResetRoleMethods();

  const resetRole = useCallback(
    async (
      _: ResetRoleFormInputType,
      { nodeOperatorId }: ResetRoleFormDataContextValue,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        const method = getMethod();

        txModalStages.sign('', ROLES.MANAGER);

        const callback = await method({
          nodeOperatorId,
        });

        const tx = await runWithTransactionLogger(
          'ResetRole signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending('', ROLES.MANAGER, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('ResetRole block confirmation', () =>
            tx.wait(),
          );
        }

        await onConfirm?.();

        txModalStages.success('', ROLES.MANAGER, txHash);

        appendNO({ id: nodeOperatorId, manager: true });

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getMethod, txModalStages, onConfirm, appendNO, onRetry],
  );

  return {
    resetRole,
  };
};
