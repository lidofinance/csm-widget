import { type NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts/roles';
import { Address } from 'shared/components';
import { DescriptorId } from 'shared/node-operator';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from '../context/types';

export const useTxModalStagesAcceptInvite = () =>
  useTxStages<
    AcceptInviteFormInputType,
    AcceptInviteFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    invariant(input.invite, 'Invite is required');
    const invite = input.invite;

    return {
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
      pending: (txHash) =>
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
      success: (_result, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title={<>Address change has been accepted</>}
            description={
              <>
                {ROLES_METADATA[invite.role].capitalizedTitle} Address of{' '}
                <DescriptorId id={invite.nodeOperatorId} /> is
                <br />
                <Address address={data.address} symbols={0} />
              </>
            }
          />,
          {
            isClosableOnLedger: true,
          },
        ),
    };
  });
