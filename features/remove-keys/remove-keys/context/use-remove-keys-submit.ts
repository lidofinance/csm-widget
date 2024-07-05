import { useCallback } from 'react';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import invariant from 'tiny-invariant';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import {
  RemoveKeysFormDataContextValue,
  RemoveKeysFormInputType,
} from './types';

type RemoveKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  nodeOperatorId: NodeOperatorId;
  startIndex: number;
  keysCount: number;
};

// this encapsulates eth/steth/wsteth flows
const useRemoveKeysMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const method = useCallback(
    async ({ nodeOperatorId, startIndex, keysCount }: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, startIndex, keysCount] as const;

      const originalGasLimit = await CSModuleWeb3.estimateGas.removeKeys(
        ...params,
        overrides,
      );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.removeKeys(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(
    (params: MethodParams) => {
      return () => method(params);
    },
    [method],
  );
};

export const useRemoveKeysSubmit = ({
  onConfirm,
  onRetry,
}: RemoveKeysOptions) => {
  const { txModalStages } = useTxModalStagesRemoveKeys();
  const getRemoveKeysMethod = useRemoveKeysMethods();

  const removeKeys = useCallback(
    async (
      { offset, selection: { start, count } }: RemoveKeysFormInputType,
      { nodeOperatorId }: RemoveKeysFormDataContextValue,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(offset !== undefined, 'Offset is not defined');

      const startIndex = offset + start;
      const keysCount = count;

      try {
        const method = getRemoveKeysMethod({
          startIndex,
          keysCount,
          nodeOperatorId,
        });

        txModalStages.sign(keysCount, nodeOperatorId);

        const callback = await method();

        const tx = await runWithTransactionLogger(
          'RemoveKeys signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(keysCount, nodeOperatorId, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('RemoveKeys block confirmation', () =>
            tx.wait(),
          );
        }

        await onConfirm?.();

        txModalStages.success(txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getRemoveKeysMethod, txModalStages, onConfirm, onRetry],
  );

  return removeKeys;
};
