import { ROLES } from 'consts/roles';
import {
  SuccessText,
  TransactionModalTransitStage,
  TxStagePermit,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { TxStageSignOperationRole } from 'shared/transaction-modal/tx-stages-composed/tx-stage-role-operation';

const STAGE_OPERATION_ARGS = {
  operationText: 'Proposing role change',
};

const getTxModalStagesResetRole = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signPermit: () => transitStage(<TxStagePermit />),

  sign: (address: string, role: ROLES) =>
    transitStage(
      <TxStageSignOperationRole
        {...STAGE_OPERATION_ARGS}
        role={role}
        address={address}
      />,
    ),

  pending: (address: string, role: ROLES, txHash?: string) =>
    transitStage(
      <TxStageSignOperationRole
        {...STAGE_OPERATION_ARGS}
        role={role}
        address={address}
        isPending
        txHash={txHash}
      />,
    ),

  success: (address: string, role: ROLES, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Your Node Operator {role} address change proposed</>}
        description={
          <SuccessText
            operationText={STAGE_OPERATION_ARGS.operationText}
            txHash={txHash}
          />
        }
        showEtherscan={false}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesResetRole = () => {
  return useTransactionModalStage(getTxModalStagesResetRole);
};
