import { ROLES } from 'consts/roles';
import { getRoleTitle } from 'shared/node-operator';
import {
  SuccessText,
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = { address: string; role: ROLES };

// TODO: not only proposing: change, revoke
// You are proposing {role} address change
// You are change {role} address
// You are revoking request for {role} address change
// >>> Your manager address stays [address]

const getTxModalStagesChangeRole = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ address, role }: Props) =>
    transitStage(
      <TxStageSign
        title={`You are proposing ${getRoleTitle(role)} address change`}
        description={`Proposed address: ${address}`}
      />,
    ),

  pending: ({ address, role }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`You are proposing ${getRoleTitle(role)} address change`}
        description={`Proposed address: ${address}`}
        txHash={txHash}
      />,
    ),

  success: ({ role }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>New ${getRoleTitle(role)} address has been proposed</>}
        // FIXME:
        // To complete the address change, the owner of the new address must confirm the change.
        description={
          <SuccessText
            operationText="Proposing address change"
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

export const useTxModalStagesChangeRole = () => {
  return useTransactionModalStage(getTxModalStagesChangeRole);
};
