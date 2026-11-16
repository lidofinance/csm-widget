import { type NodeOperatorShortInfo, ROLES } from '@lidofinance/lido-csm-sdk';
import { useActiveOperatorSDK, useAppendOperator } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useChangeRoleMode } from 'shared/hooks';
import { zeroAddress } from 'viem';
import { useConfirmChangeRoleModal } from '../hooks/use-confirm-modal';
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
  const sdk = useActiveOperatorSDK();
  const moduleName = sdk.core.moduleName;
  const appendNO = useAppendOperator();
  const confirm = useConfirmChangeRoleModal();
  const mode = useChangeRoleMode(role);
  const buildCallback = useTxModalStagesChangeRole(role);

  return useCallback(
    (input, data) => {
      if (input.intent === 'accept' && data.invite) {
        const props = { nodeOperatorId: data.nodeOperatorId, role: data.role };
        return {
          action: 'accept',
          estimate: async () => sdk.roles.estimateConfirmAddress(props),
          submit: async () => {
            const { result } = await sdk.roles.confirmAddress({
              ...props,
              callback: buildCallback(input, data),
            });
            if (result) appendNO({ ...result, module: moduleName });
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

      const params = {
        address:
          input.intent === 'revoke'
            ? zeroAddress
            : (input.address ?? zeroAddress),
        nodeOperatorId: data.nodeOperatorId,
      };

      // TODO: split this flow into separate ones for better readability and maintainability
      return {
        action,
        confirm: async () => {
          if (input.intent) return true;

          const showRewards =
            data.role === ROLES.REWARDS &&
            (action === 'propose' || action === 'rewards-change');
          const showRepropose = action === 'propose' && !!data.proposedAddress;

          if (!showRewards && !showRepropose) return true;

          return confirm({
            showRewards,
            isProposal: action === 'propose',
            showRepropose,
          });
        },
        estimate: async () => {
          switch (action) {
            case 'rewards-change':
              return sdk.roles.estimateChangeRewardsAddress(params);
            case 'manager-reset':
              return sdk.roles.estimateResetManagerAddress(params);
            case 'propose':
              return data.role === ROLES.REWARDS
                ? sdk.roles.estimateProposeRewardsAddress(params)
                : sdk.roles.estimateProposeManagerAddress(params);
          }
        },
        submit: async () => {
          const callback = buildCallback(input, data);
          const txParams = { ...params, callback };

          let result: NodeOperatorShortInfo | undefined;

          switch (action) {
            case 'rewards-change':
              ({ result } = await sdk.roles.changeRewardsAddress(txParams));
              break;
            case 'manager-reset':
              ({ result } = await sdk.roles.resetManagerAddress(txParams));
              break;
            case 'propose':
              ({ result } =
                data.role === ROLES.REWARDS
                  ? await sdk.roles.proposeRewardsAddress(txParams)
                  : await sdk.roles.proposeManagerAddress(txParams));
              break;
          }

          if (result) {
            appendNO({ ...result, module: moduleName });
          }
        },
      };
    },
    [sdk, appendNO, moduleName, confirm, mode, buildCallback],
  );
};

export const useChangeRoleFlow = (): ChangeRoleFlow => {
  const data = useChangeRoleFormData(true);
  const resolve = useChangeRoleFlowResolver(data.role);
  return resolve({} as ChangeRoleFormInputType, data);
};
