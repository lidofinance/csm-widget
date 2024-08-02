import { ROLES } from 'consts/roles';
import { DescriptorId, getRoleTitle } from 'shared/node-operator';
import {
  SuccessText,
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';

// TODO: not proposing
const STAGE_OPERATION_ARGS = {
  operationText: 'Accepting address change',
};

type Props = { id: NodeOperatorId; role: ROLES };

const getTxModalStagesAcceptInvite = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ id, role }: Props) =>
    transitStage(
      <TxStageSign
        title={`You are accepting ${getRoleTitle(role)} address change`}
        description={<DescriptorId id={id} />}
      />,
    ),

  pending: ({ id, role }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`You are accepting ${getRoleTitle(role)} address change`}
        description={<DescriptorId id={id} />} // TODO: remove description?
        txHash={txHash}
      />,
    ),

  success: ({ id, role }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            Accepted {role} address change of <DescriptorId id={id} />
          </>
        }
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

export const useTxModalStagesAcceptInvite = () => {
  return useTransactionModalStage(getTxModalStagesAcceptInvite);
};
