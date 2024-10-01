import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useCSModuleWeb3, useSendTx } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { StealingReportFormInputType } from '.';
import { useTxModalStagesStealingReport } from '../hooks/use-tx-modal-stages-stealing-report';

type UseStealingReportOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type StealingReportMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
  blockhash: string;
};

const useStealingReportTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (params: StealingReportMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      return {
        tx: await CSModuleWeb3.populateTransaction.reportELRewardsStealingPenalty(
          params.nodeOperatorId,
          params.blockhash,
          params.amount,
        ),
        txName: 'reportELRewardsStealingPenalty',
      };
    },
    [CSModuleWeb3],
  );
};

export const useStealingReportSubmit = ({
  onConfirm,
  onRetry,
}: UseStealingReportOptions) => {
  const { txModalStages } = useTxModalStagesStealingReport();

  const getTx = useStealingReportTx();
  const sendTx = useSendTx();

  const stealingReport = useCallback(
    async ({
      amount,
      nodeOperatorId,
      blockhash,
    }: StealingReportFormInputType): Promise<boolean> => {
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(blockhash, 'BlockHash is not defined');

      try {
        txModalStages.sign({ amount, nodeOperatorId, blockhash });

        const tx = await getTx({
          nodeOperatorId,
          amount,
          blockhash,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'StealingReport signing',
          () => sendTx(tx),
        );

        txModalStages.pending({ amount, nodeOperatorId, blockhash }, txHash);

        await runWithTransactionLogger(
          'StealingReport block confirmation',
          waitTx,
        );

        await onConfirm?.();

        txModalStages.success({ amount, nodeOperatorId, blockhash }, txHash);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [getTx, txModalStages, onConfirm, sendTx, onRetry],
  );

  return {
    stealingReport,
  };
};
