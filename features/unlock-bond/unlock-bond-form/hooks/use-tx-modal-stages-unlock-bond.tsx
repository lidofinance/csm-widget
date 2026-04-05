import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from '../context/types';

type TxResult = bigint | undefined;

const getTxModalStagesUnlockBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (
    _input: UnlockBondFormInputType,
    { compensationAmount }: UnlockBondFormNetworkData,
  ) =>
    compensationAmount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={compensationAmount}
            token={TOKENS.steth}
          />,
        )
      : transitStage(
          <TxStageSign
            title="Unlocking expired bond"
            description="Unlocking your expired bond lock"
          />,
        ),

  pending: (
    _input: UnlockBondFormInputType,
    { compensationAmount }: UnlockBondFormNetworkData,
    txHash?: string,
  ) =>
    compensationAmount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={compensationAmount}
            token={TOKENS.steth}
            isPending
            txHash={txHash}
          />,
        )
      : transitStage(
          <TxStagePending title="Unlocking expired bond" txHash={txHash} />,
        ),

  success: (
    _input: UnlockBondFormInputType,
    { compensationAmount }: UnlockBondFormNetworkData,
    result: TxResult,
    txHash?: string,
  ) => {
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          compensationAmount !== undefined
            ? result
              ? 'Locked bond has been partially compensated'
              : 'Locked bond has been fully compensated'
            : 'Expired bond lock has been unlocked'
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
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalStagesUnlockBond = () =>
  useTxCallbackStages<
    UnlockBondFormInputType,
    UnlockBondFormNetworkData,
    TxResult
  >(getTxModalStagesUnlockBond);
