import { useCallback } from 'react';
import { useCSModuleWeb3 } from 'shared/hooks';
import { MultisigBreakError, useSendTx } from 'shared/hooks/use-send-tx';
import invariant from 'tiny-invariant';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import { RemoveKeysFormInputType, RemoveKeysFormNetworkData } from './types';

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
const useRemoveKeysTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();
  invariant(CSModuleWeb3, 'must have CSModuleWeb3');

  return useCallback(
    (params: MethodParams) => {
      return CSModuleWeb3.populateTransaction.removeKeys(
        params.nodeOperatorId,
        params.startIndex,
        params.keysCount,
      );
    },
    [CSModuleWeb3],
  );
};

export const useRemoveKeysSubmit = ({
  onConfirm,
  onRetry,
}: RemoveKeysOptions) => {
  const { txModalStages } = useTxModalStagesRemoveKeys();
  const getTx = useRemoveKeysTx();
  const sendTx = useSendTx();

  const removeKeys = useCallback(
    async (
      { selection: { start, count } }: RemoveKeysFormInputType,
      { nodeOperatorId, info }: RemoveKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(
        info?.totalDepositedKeys !== undefined,
        'Offset is not defined',
      );

      const startIndex = info.totalDepositedKeys + start;
      const keysCount = count;

      try {
        txModalStages.sign(keysCount, nodeOperatorId);

        const tx = await getTx({
          startIndex,
          keysCount,
          nodeOperatorId,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'RemoveKeys signing',
          () => sendTx({ tx }),
        );

        txModalStages.pending(keysCount, nodeOperatorId, txHash);

        await runWithTransactionLogger('RemoveKeys block confirmation', waitTx);

        await onConfirm?.();

        txModalStages.success(txHash);

        return true;
      } catch (error) {
        if (error instanceof MultisigBreakError) {
          txModalStages.successMultisig();
          return true;
        }

        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getTx, txModalStages, onConfirm, sendTx, onRetry],
  );

  return removeKeys;
};
