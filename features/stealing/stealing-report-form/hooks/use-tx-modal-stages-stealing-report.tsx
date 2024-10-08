import type { BigNumber } from 'ethers';

import { TOKENS } from 'consts/tokens';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';

type Props = {
  amount: BigNumber;
  nodeOperatorId: NodeOperatorId;
  blockhash: string;
};

const getTxModalStagesStealingReport = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount, nodeOperatorId }: Props) =>
    transitStage(
      <TxStageSign
        title="You are reporting stealing"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.ETH} />
          </>
        }
      />,
    ),

  pending: ({ amount, nodeOperatorId }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="You are reporting stealing"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.ETH} />
          </>
        }
      />,
    ),

  success: ({ amount, nodeOperatorId }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stealing is repotred"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.ETH} />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesStealingReport = () => {
  return useTransactionModalStage(getTxModalStagesStealingReport);
};
