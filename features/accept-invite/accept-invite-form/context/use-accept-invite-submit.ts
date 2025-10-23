import { useCallback } from 'react';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { useNavigate } from 'shared/navigate';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from './types';

export const useAcceptInviteSubmit: FormSubmitterHook<
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesAcceptInvite();
  const appendNO = useAppendOperator();
  const n = useNavigate();

  return useCallback(
    async ({ invite }, { address, nodeOperatorId }, { onConfirm, onRetry }) => {
      invariant(invite !== undefined, 'Invite is not defined');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(invite);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(invite, payload.hash);
              break;
            case TransactionCallbackStage.DONE:
              appendNO({ id: invite.id, roles: [invite.role] });

              txModalStages.success({ ...invite, address }, payload.hash);
              break;
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

        // FIXME: should i always redirect?
        if (!nodeOperatorId) {
          void n(PATH.HOME);
        }

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.roles, appendNO, txModalStages, n],
  );
};
