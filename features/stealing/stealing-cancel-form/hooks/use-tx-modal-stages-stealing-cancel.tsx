import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type Props = {
  amount: bigint;
  nodeOperatorId: NodeOperatorId;
};

const getTxModalStagesStealingCancel = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount, nodeOperatorId }: Props) =>
    transitStage(
      <TxStageSign
        title="You are canceling stealing"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId.toString()}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.eth} />
          </>
        }
      />,
    ),

  pending: ({ amount, nodeOperatorId }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="You are canceling stealing"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId.toString()}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.eth} />
          </>
        }
      />,
    ),

  success: ({ amount, nodeOperatorId }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stealing is canceled"
        description={
          <>
            Node Operator ID: <b>{nodeOperatorId.toString()}</b>
            <br />
            Amount: <TxAmount amount={amount} token={TOKENS.eth} />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesStealingCancel = () => {
  return useTransactionModalStage(getTxModalStagesStealingCancel);
};
