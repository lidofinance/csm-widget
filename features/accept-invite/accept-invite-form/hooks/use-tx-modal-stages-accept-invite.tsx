import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { Address } from 'shared/components';
import { DescriptorId, getRoleTitle } from 'shared/node-operator';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const getTxModalStagesAcceptInvite = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ id, role }: NodeOperatorInvite) =>
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

  pending: ({ id, role }: NodeOperatorInvite, txHash?: string) =>
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

  success: (
    { id, role, address }: NodeOperatorInvite & { address: string },
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Address change has been accepted</>}
        description={
          <>
            {getRoleTitle(role, true)} address of <DescriptorId id={id} /> is
            <br />
            <Address address={address} symbols={0} />
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
