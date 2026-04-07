import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from '../context/types';

const getTxModalStagesStealingCancel = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (
    input: StealingCancelFormInputType,
    _data: StealingCancelFormNetworkData,
  ) =>
    transitStage(
      <TxStageSign
        title="You are canceling stealing"
        description={
          <>
            Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
            <br />
            Amount: <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
          </>
        }
      />,
    ),

  pending: (
    input: StealingCancelFormInputType,
    _data: StealingCancelFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="You are canceling stealing"
        description={
          <>
            Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
            <br />
            Amount: <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
          </>
        }
      />,
    ),

  success: (
    input: StealingCancelFormInputType,
    _data: StealingCancelFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stealing is canceled"
        description={
          <>
            Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
            <br />
            Amount: <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesStealingCancel = () =>
  useTxCallbackStages<
    StealingCancelFormInputType,
    StealingCancelFormNetworkData
  >(getTxModalStagesStealingCancel);
