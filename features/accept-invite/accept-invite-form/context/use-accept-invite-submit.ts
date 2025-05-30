import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { TransactionCallbackStage } from '@lidofinance/lido-ethereum-sdk';
import { PATH } from 'consts/urls';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import { useNavigate } from 'shared/navigate';
import { handleTxError } from 'shared/transaction-modal';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from './types';

// TODO: move to hooks
type UseAcceptInviteOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useAcceptInviteSubmit = ({
  onConfirm,
  onRetry,
}: UseAcceptInviteOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesAcceptInvite();
  const appendNO = useAppendOperator();
  const n = useNavigate();

  const acceptInvite = useCallback(
    async (
      { invite }: AcceptInviteFormInputType,
      { address, invites }: AcceptInviteFormNetworkData,
    ): Promise<boolean> => {
      invariant(invite, 'Invite is not defined');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(invite);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(invite, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              payload;
              txModalStages.success({ ...invite, address }, payload.hash);
              break;
            }
            case TransactionCallbackStage.MULTISIG_DONE:
              txModalStages.successMultisig();
              break;
            case TransactionCallbackStage.ERROR:
              txModalStages.failed(payload.error, onRetry);
              break;
            default:
          }
        };

        await csm.roles.confirmRole({
          nodeOperatorId: invite.id,
          role: invite.role,
          callback,
        });

        await onConfirm?.();

        // TODO: move to onConfirm
        appendNO({ id: invite.id, roles: [invite.role] });
        if (invites && invites.length <= 1) {
          void n(PATH.HOME);
        }

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.roles, onConfirm, appendNO, txModalStages, onRetry, n],
  );

  return {
    acceptInvite,
  };
};
