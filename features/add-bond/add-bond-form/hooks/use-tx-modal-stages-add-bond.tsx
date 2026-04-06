import { type AddBondResult, TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import { AddBondFormInputType, AddBondFormNetworkData } from '../context/types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Adding Bond',
};

const getTxModalStagesAddBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (input: AddBondFormInputType, _data: AddBondFormNetworkData) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        amount={input.bondAmount ?? 0n}
        token={input.token}
      />,
    ),

  pending: (
    input: AddBondFormInputType,
    _data: AddBondFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        amount={input.bondAmount ?? 0n}
        token={input.token}
        isPending
        txHash={txHash}
      />,
    ),

  success: (
    _input: AddBondFormInputType,
    _data: AddBondFormNetworkData,
    result: AddBondResult,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageOperationSucceedBalanceShown
        {...STAGE_OPERATION_ARGS}
        txHash={txHash}
        balance={result.current}
        balanceToken={TOKENS.steth}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAddBond = () =>
  useTxCallbackStages<
    AddBondFormInputType,
    AddBondFormNetworkData,
    AddBondResult
  >(getTxModalStagesAddBond);
