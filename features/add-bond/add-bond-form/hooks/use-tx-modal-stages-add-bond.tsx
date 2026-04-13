import { type AddBondResult, TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  useTxStages,
} from 'shared/transaction-modal';
import { AddBondFormInputType, AddBondFormNetworkData } from '../context/types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Adding Bond',
};

export const useTxModalStagesAddBond = () =>
  useTxStages<AddBondFormInputType, AddBondFormNetworkData, AddBondResult>(
    (transitStage, input) => ({
      sign: () =>
        transitStage(
          <TxStageSignOperationAmount
            {...STAGE_OPERATION_ARGS}
            amount={input.bondAmount ?? 0n}
            token={input.token}
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStageSignOperationAmount
            {...STAGE_OPERATION_ARGS}
            amount={input.bondAmount ?? 0n}
            token={input.token}
            isPending
            txHash={txHash}
          />,
        ),
      success: (result: AddBondResult, txHash) =>
        transitStage(
          <TxStageOperationSucceedBalanceShown
            {...STAGE_OPERATION_ARGS}
            txHash={txHash}
            balance={result.current}
            balanceToken={TOKENS.steth}
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
