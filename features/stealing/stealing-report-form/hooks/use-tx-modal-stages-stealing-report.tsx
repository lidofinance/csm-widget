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
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from '../context/types';

const getTxModalStagesStealingReport = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (
    input: StealingReportFormInputType,
    _data: StealingReportFormNetworkData,
  ) =>
    transitStage(
      <TxStageSign
        title="You are reporting stealing"
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
    input: StealingReportFormInputType,
    _data: StealingReportFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="You are reporting stealing"
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
    input: StealingReportFormInputType,
    _data: StealingReportFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stealing is reported"
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

export const useTxModalStagesStealingReport = () =>
  useTxCallbackStages<
    StealingReportFormInputType,
    StealingReportFormNetworkData
  >(getTxModalStagesStealingReport);
