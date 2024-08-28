import { Address } from '@lidofinance/lido-ui';
import { ROLES } from 'consts/roles';
import { DescriptorId, getRoleTitle } from 'shared/node-operator';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';

type Props = { id: NodeOperatorId; role: ROLES };

const getTxModalStagesAcceptInvite = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ id, role }: Props) =>
    transitStage(
      <TxStageSign
        title={`You are accepting address change`}
        description={
          <>
            <DescriptorId id={id} /> &mdash; <b>{getRoleTitle(role)}</b> address
          </>
        }
      />,
    ),

  pending: ({ id, role }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`You are accepting address change`}
        description={
          <>
            <DescriptorId id={id} /> &mdash; <b>{getRoleTitle(role)}</b> address
          </>
        }
        txHash={txHash}
      />,
    ),

  // TODO: "go to dashboard" button
  success: (
    { id, role, address }: Props & { address: string },
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Address change is accepted</>}
        description={
          <>
            {getRoleTitle(role, true)} address of <DescriptorId id={id} /> is
            <br />
            <Address address={address} symbols={90} />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAcceptInvite = () => {
  return useTransactionModalStage(getTxModalStagesAcceptInvite);
};
