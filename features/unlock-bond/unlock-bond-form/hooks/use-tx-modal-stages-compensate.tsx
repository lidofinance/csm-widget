import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TxAmount,
  TxStageSignOperationAmount,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from '../context/types';

type TxResult = bigint | undefined;

export const useTxModalStagesCompensate = () =>
  useTxStages<UnlockBondFormInputType, UnlockBondFormNetworkData, TxResult>(
    (transitStage, _input, data) => ({
      sign: () =>
        transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={data.compensationAmount}
            token={TOKENS.steth}
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={data.compensationAmount}
            token={TOKENS.steth}
            isPending
            txHash={txHash}
          />,
        ),
      success: (result: TxResult, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title={
              result
                ? 'Locked bond has been partially compensated'
                : 'Locked bond has been fully compensated'
            }
            description={
              result ? (
                <>
                  Remaining locked bond{' '}
                  <TxAmount amount={result} token={TOKENS.steth} />
                </>
              ) : undefined
            }
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
