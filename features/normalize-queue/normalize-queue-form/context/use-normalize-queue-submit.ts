import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useCSModuleWeb3, useSendTx } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { NormalizeQueueFormInputType, NormalizeQueueFormNetworkData } from '.';
import { useTxModalStagesNormalizeQueue } from '../hooks/use-tx-modal-stages-normalize-queue';

type UseNormalizeQueueOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type NormalizeQueueMethodParams = {
  nodeOperatorId: NodeOperatorId;
};

const useNormalizeQueueTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (params: NormalizeQueueMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      return {
        tx: await CSModuleWeb3.populateTransaction.normalizeQueue(
          params.nodeOperatorId,
        ),
        txName: 'normalizeQueue',
      };
    },
    [CSModuleWeb3],
  );
};

export const useNormalizeQueueSubmit = ({
  onConfirm,
  onRetry,
}: UseNormalizeQueueOptions) => {
  const { txModalStages } = useTxModalStagesNormalizeQueue();

  const getTx = useNormalizeQueueTx();
  const sendTx = useSendTx();

  const normalizeQueue = useCallback(
    async (
      _: NormalizeQueueFormInputType,
      { nodeOperatorId, info }: NormalizeQueueFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(info, 'Info is not defined');

      try {
        txModalStages.sign({
          keysCount: info.depositableValidatorsCount - info.enqueuedCount,
        });

        const tx = await getTx({
          nodeOperatorId,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'NormalizeQueue signing',
          () => sendTx(tx),
        );

        txModalStages.pending(
          {
            keysCount: info.depositableValidatorsCount - info.enqueuedCount,
          },
          txHash,
        );

        await runWithTransactionLogger(
          'NormalizeQueue block confirmation',
          waitTx,
        );

        await onConfirm?.();

        txModalStages.success(
          { keysCount: info.depositableValidatorsCount },
          txHash,
        );

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [getTx, txModalStages, onConfirm, sendTx, onRetry],
  );

  return {
    normalizeQueue,
  };
};
