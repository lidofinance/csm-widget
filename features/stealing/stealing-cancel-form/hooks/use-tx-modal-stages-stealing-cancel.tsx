import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from '../context/types';

export const useTxModalStagesStealingCancel = () =>
  useTxStages<StealingCancelFormInputType, StealingCancelFormNetworkData>(
    (transitStage, input) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title="You are canceling stealing"
            description={
              <>
                Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
                <br />
                Amount:{' '}
                <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
              </>
            }
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="You are canceling stealing"
            description={
              <>
                Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
                <br />
                Amount:{' '}
                <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
              </>
            }
          />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="Stealing is canceled"
            description={
              <>
                Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
                <br />
                Amount:{' '}
                <TxAmount amount={input.amount ?? 0n} token={TOKENS.eth} />
              </>
            }
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
