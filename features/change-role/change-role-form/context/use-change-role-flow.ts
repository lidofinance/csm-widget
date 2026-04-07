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
import { useChangeRoleFormData } from './change-role-data-provider';
import { ChangeRoleFormInputType, ChangeRoleFormNetworkData } from './types';

export type ChangeRoleFlow =
  | { action: 'view' }
  | ({ action: 'manager-reset' } & Executable<NodeOperatorShortInfo>)
  | ({ action: 'rewards-change' } & Executable<NodeOperatorShortInfo>)
  | ({ action: 'propose' } & Executable<NodeOperatorShortInfo>);

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

  return useCallback(
    (input, data) => {
      if (!data.canEdit) return { action: 'view' };

      const action =
        mode === 'managerReset'
          ? ('manager-reset' as const)
          : mode === 'rewardsChange'
            ? ('rewards-change' as const)
            : ('propose' as const);

      return {
        action,
        confirm: async () => {
          if (action === 'propose' && !input.isRevoke) {
            if (
              data.role === ROLES.REWARDS &&
              !(await confirmRewardsRole({}))
            ) {
              return false;
            }
            if (data.proposedAddress && !(await confirmRepropose({}))) {
              return false;
            }
          }
          return true;
        },
        submit: async (callback) => {
          const address = input.isRevoke
            ? zeroAddress
            : (input.address ?? zeroAddress);

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
    [sdk, appendNO, confirmRepropose, confirmRewardsRole, mode],
  );
};

export const useChangeRoleFlow = (): ChangeRoleFlow => {
  const data = useChangeRoleFormData(true);
  const resolve = useChangeRoleFlowResolver(data.role);
  return resolve({} as ChangeRoleFormInputType, data);
};
