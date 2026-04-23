import { type NodeOperatorShortInfo, ROLES } from '@lidofinance/lido-csm-sdk';
import { useAppendOperator, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useChangeRoleMode } from 'shared/hooks';
import { zeroAddress } from 'viem';
import {
  useConfirmReproposeModal,
  useConfirmRewardsRoleModal,
} from '../hooks/use-confirm-modal';
import { useTxModalStagesChangeRole } from '../hooks/use-tx-modal-stages-change-role';
import { useChangeRoleFormData } from './change-role-data-provider';
import { ChangeRoleFormInputType, ChangeRoleFormNetworkData } from './types';

export type ChangeRoleFlow =
  | { action: 'view' }
  | ({ action: 'manager-reset' } & Executable)
  | ({ action: 'rewards-change' } & Executable)
  | ({ action: 'propose' } & Executable)
  | ({ action: 'accept' } & Executable);

export const useChangeRoleFlowResolver = (
  role: ROLES,
): FlowResolver<
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
  ChangeRoleFlow
> => {
  const sdk = useSmSDK();
  const appendNO = useAppendOperator();
  const confirmRepropose = useConfirmReproposeModal();
  const confirmRewardsRole = useConfirmRewardsRoleModal();
  const mode = useChangeRoleMode(role);
  const buildCallback = useTxModalStagesChangeRole(role);

  return useCallback(
    (input, data) => {
      if (input.intent === 'accept' && data.invite) {
        return {
          action: 'accept',
          submit: async () => {
            const { result } = await sdk.roles.confirmAddress({
              nodeOperatorId: data.nodeOperatorId,
              role: data.role,
              callback: buildCallback(input, data),
            });
            if (result) appendNO(result);
          },
        };
      }

      if (!data.canEdit) return { action: 'view' };

      const action =
        mode === 'managerReset'
          ? ('manager-reset' as const)
          : mode === 'rewardsChange'
            ? ('rewards-change' as const)
            : ('propose' as const);

      // TODO: split this flow into separate ones for better readability and maintainability
      return {
        action,
        confirm: async () => {
          if (input.intent === 'submit' && data.role === ROLES.REWARDS) {
            if (action === 'propose' || action === 'rewards-change') {
              const confirmed = await confirmRewardsRole({
                isProposal: action === 'propose',
              });
              if (!confirmed) return false;
            }
            if (
              action === 'propose' &&
              data.proposedAddress &&
              !(await confirmRepropose({}))
            ) {
              return false;
            }
          }
          return true;
        },
        submit: async () => {
          const address =
            input.intent === 'revoke'
              ? zeroAddress
              : (input.address ?? zeroAddress);

          const callback = buildCallback(input, data);

          const params = {
            address,
            nodeOperatorId: data.nodeOperatorId,
            callback,
          };

          let result: NodeOperatorShortInfo | undefined;

          switch (action) {
            case 'rewards-change':
              ({ result } = await sdk.roles.changeRewardsAddress(params));
              break;
            case 'manager-reset':
              ({ result } = await sdk.roles.resetManagerAddress(params));
              break;
            case 'propose':
              ({ result } =
                data.role === ROLES.REWARDS
                  ? await sdk.roles.proposeRewardsAddress(params)
                  : await sdk.roles.proposeManagerAddress(params));
              break;
          }

          if (result) {
            appendNO(result);
          }
        },
      };
    },
    [sdk, appendNO, confirmRepropose, confirmRewardsRole, mode, buildCallback],
  );
};

export const useChangeRoleFlow = (): ChangeRoleFlow => {
  const data = useChangeRoleFormData(true);
  const resolve = useChangeRoleFlowResolver(data.role);
  return resolve({} as ChangeRoleFormInputType, data);
};
