import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { ROLES } from 'consts/roles';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useCSModuleWeb3, useSendTx } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from './types';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';

// TODO: move to hooks
type UseAcceptInviteOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type AcceptInviteMethodParams = {
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useAcceptInviteTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (role: ROLES, params: AcceptInviteMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      switch (role) {
        case ROLES.MANAGER:
          return {
            tx: await CSModuleWeb3.populateTransaction.confirmNodeOperatorManagerAddressChange(
              params.nodeOperatorId,
            ),
            txName: 'confirmNodeOperatorManagerAddressChange',
          };
        case ROLES.REWARDS:
          return {
            tx: await CSModuleWeb3.populateTransaction.confirmNodeOperatorRewardAddressChange(
              params.nodeOperatorId,
            ),
            txName: 'confirmNodeOperatorRewardAddressChange',
          };
      }
    },
    [CSModuleWeb3],
  );
};

export const useAcceptInviteSubmit = ({
  onConfirm,
  onRetry,
}: UseAcceptInviteOptions) => {
  const { txModalStages } = useTxModalStagesAcceptInvite();
  const { append: appendNO } = useNodeOperatorContext();
  const n = useNavigate();

  const getTx = useAcceptInviteTx();
  const sendTx = useSendTx();

  const acceptInvite = useCallback(
    async (
      { invite }: AcceptInviteFormInputType,
      { address, invites }: AcceptInviteFormNetworkData,
    ): Promise<boolean> => {
      invariant(invite, 'Invite is not defined');

      try {
        txModalStages.sign(invite);

        const tx = await getTx(invite.role, {
          nodeOperatorId: invite.id,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'AcceptInvite signing',
          () => sendTx(tx),
        );

        txModalStages.pending(invite, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger(
            'AcceptInvite block confirmation',
            waitTx,
          );
        }

        await onConfirm?.();

        // TODO: move to onConfirm
        appendNO({ id: invite.id, roles: [invite.role] });
        if (invites && invites.length <= 1) {
          void n(PATH.HOME);
        }

        txModalStages.success({ ...invite, address }, txHash);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [txModalStages, getTx, onConfirm, appendNO, n, sendTx, onRetry],
  );

  return {
    acceptInvite,
  };
};
