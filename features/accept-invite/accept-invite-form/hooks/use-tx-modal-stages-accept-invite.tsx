import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts/roles';
import { Address } from 'shared/components';
import { DescriptorId } from 'shared/node-operator';
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
            <DescriptorId id={id} /> &mdash; <b>{ROLES_METADATA[role].title}</b>{' '}
            address
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
            <DescriptorId id={id} /> &mdash; <b>{ROLES_METADATA[role].title}</b>{' '}
            address
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
            {ROLES_METADATA[role].capitalizedTitle} address of{' '}
            <DescriptorId id={id} /> is
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
