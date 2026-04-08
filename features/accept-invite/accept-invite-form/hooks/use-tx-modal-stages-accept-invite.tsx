import {
  type NodeOperatorShortInfo,
  type TransactionCallback,
} from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts/roles';
import { useMemo } from 'react';
import { Address } from 'shared/components';
import invariant from 'tiny-invariant';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import { DescriptorId } from 'shared/node-operator';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from '../context/types';

export const useTxModalStagesAcceptInvite = (): ((
  input: AcceptInviteFormInputType,
  data: AcceptInviteFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<NodeOperatorShortInfo>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: AcceptInviteFormInputType,
        data: AcceptInviteFormNetworkData,
        onRetry: () => void,
      ) => {
        invariant(input.invite, 'Invite is required');
        const invite = input.invite;

        return buildTxCallback<NodeOperatorShortInfo>(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="You are accepting address change"
                  description={
                    <>
                      <DescriptorId id={invite.id} /> &mdash;{' '}
                      <b>{ROLES_METADATA[invite.role].title}</b> address
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
                      <DescriptorId id={invite.id} /> &mdash;{' '}
                      <b>{ROLES_METADATA[invite.role].title}</b> address
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
                      {ROLES_METADATA[invite.role].capitalizedTitle} address of{' '}
                      <DescriptorId id={invite.id} /> is
                      <br />
                      <Address address={data.address} symbols={0} />
                    </>
                  }
                />,
                {
                  isClosableOnLedger: true,
                },
              ),
          },
          onRetry,
        );
      },
    [transitStage],
  );
};
