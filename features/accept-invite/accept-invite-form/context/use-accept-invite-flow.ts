import { useCallback } from 'react';

import { PATH } from 'consts/urls';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import { useAcceptInviteFormData } from './accept-invite-data-provider';
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
      if (!input.invite) return { action: 'no-invite' };

      const invite = input.invite;

      return {
        action: 'accept' as const,
        submit: async () => {
          invariant(invite !== undefined, 'Invite is not defined');

          const sdk = sm[invite.module];
          invariant(sdk, `${invite.module} SDK not initialized`);

          const { result } = await sdk.roles.confirmAddress({
            nodeOperatorId: invite.nodeOperatorId,
            role: invite.role,
            callback: buildCallback(input, data),
          });

          if (result) appendNO({ ...result, module: invite.module });

          if (data.nodeOperatorId === undefined && data.invites.length <= 1) {
            void n(PATH.HOME);
          }
        },
      };
    },
    [sm, appendNO, n, buildCallback],
  );
};

export const useAcceptInviteFlow = (): AcceptInviteFlow => {
  const resolve = useAcceptInviteFlowResolver();
  const data = useAcceptInviteFormData(true);
  return resolve({} as AcceptInviteFormInputType, data);
};
