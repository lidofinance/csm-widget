import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { ROLES } from 'consts/roles';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { AcceptInviteFormInputType } from '.';
import { useTxModalStagesAcceptInvite } from '../hooks/use-tx-modal-stages-accept-invite';
import { useNodeOperator } from 'providers/node-operator-provider';

type UseAcceptInviteOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type AcceptInviteMethodParams = {
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useAcceptInviteMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodReward = useCallback(
    async ({ nodeOperatorId }: AcceptInviteMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.confirmNodeOperatorRewardAddressChange(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.confirmNodeOperatorRewardAddressChange(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const methodManager = useCallback(
    async ({ nodeOperatorId }: AcceptInviteMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.confirmNodeOperatorManagerAddressChange(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.confirmNodeOperatorManagerAddressChange(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(
    (role: ROLES) => {
      switch (role) {
        case ROLES.MANAGER:
          return methodManager;
        case ROLES.REWARDS:
          return methodReward;
      }
    },
    [methodManager, methodReward],
  );
};

export const useAcceptInvite = ({
  onConfirm,
  onRetry,
}: UseAcceptInviteOptions) => {
  const { txModalStages } = useTxModalStagesAcceptInvite();
  const { append: appendNO } = useNodeOperator();

  const getMethod = useAcceptInviteMethods();

  const acceptInvite = useCallback(
    async ({ invite }: AcceptInviteFormInputType): Promise<boolean> => {
      invariant(invite, 'Invite is not defined');

      try {
        const role = invite.manager ? ROLES.MANAGER : ROLES.REWARDS;
        const method = getMethod(role);

        txModalStages.sign('0x0', role);

        const callback = await method({
          nodeOperatorId: invite.id,
        });

        const tx = await runWithTransactionLogger(
          'AcceptInvite signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending('0x0', role, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger(
            'AcceptInvite block confirmation',
            () => tx.wait(),
          );
        }

        await onConfirm?.();

        txModalStages.success('0x0', role, txHash);

        appendNO(invite);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getMethod, txModalStages, onConfirm, appendNO, onRetry],
  );

  return {
    acceptInvite,
  };
};
