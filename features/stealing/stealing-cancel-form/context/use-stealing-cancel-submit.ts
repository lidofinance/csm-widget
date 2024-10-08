import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useCSModuleWeb3, useSendTx } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { StealingCancelFormInputType } from '.';
import { useTxModalStagesStealingCancel } from '../hooks/use-tx-modal-stages-stealing-cancel';

type UseStealingCancelOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type StealingCancelMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
};

const useStealingCancelTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (params: StealingCancelMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      return {
        tx: await CSModuleWeb3.populateTransaction.cancelELRewardsStealingPenalty(
          params.nodeOperatorId,
          params.amount,
        ),
        txName: 'cancelELRewardsStealingPenalty',
      };
    },
    [CSModuleWeb3],
  );
};

export const useStealingCancelSubmit = ({
  onConfirm,
  onRetry,
}: UseStealingCancelOptions) => {
  const { txModalStages } = useTxModalStagesStealingCancel();

  const getTx = useStealingCancelTx();
  const sendTx = useSendTx();

  const stealingCancel = useCallback(
    async ({
      amount,
      nodeOperatorId,
    }: StealingCancelFormInputType): Promise<boolean> => {
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        txModalStages.sign({ amount, nodeOperatorId });

        const tx = await getTx({
          nodeOperatorId,
          amount,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'StealingCancel signing',
          () => sendTx(tx),
        );

        txModalStages.pending({ amount, nodeOperatorId }, txHash);

        await runWithTransactionLogger(
          'StealingCancel block confirmation',
          waitTx,
        );

        await onConfirm?.();

        txModalStages.success({ amount, nodeOperatorId }, txHash);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [getTx, txModalStages, onConfirm, sendTx, onRetry],
  );

  return {
    stealingCancel,
  };
};
