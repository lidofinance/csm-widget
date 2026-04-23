import {
  type NodeOperatorInviteInfo,
  type NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts/roles';
import { Address } from 'shared/components';
import { DescriptorId } from 'shared/node-operator';
import {
  type TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { type Address as TAddress } from 'viem';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from '../context/types';

type AcceptInviteStageParams = {
  invite: Pick<NodeOperatorInviteInfo, 'nodeOperatorId' | 'role'>;
  address: TAddress;
};

export const buildAcceptInviteStages = (
  transitStage: TransactionModalTransitStage,
  { invite, address }: AcceptInviteStageParams,
) => ({
  sign: () =>
    transitStage(
      <TxStageSign
        title="You are accepting address change"
        description={
          <>
            <DescriptorId id={invite.nodeOperatorId} /> &mdash;{' '}
            <b>{ROLES_METADATA[invite.role].capitalizedTitle}</b> Address
          </>
        }
      />,
    ),
  pending: (txHash?: string) =>
    transitStage(
      <TxStagePending
        title="You are accepting address change"
        description={
          <>
            <DescriptorId id={invite.nodeOperatorId} /> &mdash;{' '}
            <b>{ROLES_METADATA[invite.role].capitalizedTitle}</b> Address
          </>
        }
        txHash={txHash}
      />,
    ),
  success: (_result: NodeOperatorShortInfo, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Address change has been accepted</>}
        description={
          <>
            {ROLES_METADATA[invite.role].capitalizedTitle} Address of{' '}
            <DescriptorId id={invite.nodeOperatorId} /> is
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

export const useTxModalStagesAcceptInvite = () =>
  useTxStages<
    AcceptInviteFormInputType,
    AcceptInviteFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    invariant(input.invite, 'Invite is required');
    return buildAcceptInviteStages(transitStage, {
      invite: input.invite,
      address: data.address,
    });
  });
