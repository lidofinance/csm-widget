import { useCallback } from 'react';

import { PATH } from 'consts/urls';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import {
  findInviteById,
  shouldNavigateHomeAfterAccept,
} from '../accept-invite-state';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from './types';

export type AcceptInviteFlow =
  { action: 'no-invite' } | ({ action: 'accept' } & Executable);

export const useAcceptInviteFlowResolver = (): FlowResolver<
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
  AcceptInviteFlow
> => {
  const { sm } = useLidoSDK();
  const appendNO = useAppendOperator();
  const n = useNavigate();
  const buildCallback = useTxModalStagesAcceptInvite();

  return useCallback(
    (input, data) => {
      const invite = findInviteById(data.invites, input.intent);
      if (!invite) return { action: 'no-invite' };

      const props = {
        nodeOperatorId: invite.nodeOperatorId,
        role: invite.role,
      };
      const getSdk = () => {
        const sdk = sm.get(invite.module);
        invariant(sdk, `${invite.module} SDK not initialized`);
        return sdk;
      };

      return {
        action: 'accept' as const,
        estimate: async () => getSdk().roles.estimateConfirmAddress(props),
        submit: async () => {
          const { result } = await getSdk().roles.confirmAddress({
            ...props,
            callback: buildCallback({ invite }, data),
          });

          if (result) appendNO({ ...result, module: invite.module });

          if (
            shouldNavigateHomeAfterAccept({
              nodeOperatorId: data.nodeOperatorId,
              invitesCount: data.invites.length,
            })
          ) {
            void n(PATH.HOME);
          }
        },
      };
    },
    [sm, appendNO, n, buildCallback],
  );
};
