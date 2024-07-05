import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { AddressZero } from '@ethersproject/constants';
import { ROLES } from 'consts/roles';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { ChangeRoleFormDataContextValue, ChangeRoleFormInputType } from '.';
import {
  useConfirmReproposeModal,
  useConfirmRewardsRoleModal,
} from '../hooks/use-confirm-modal';
import { useTxModalStagesChangeRole } from '../hooks/use-tx-modal-stages-change-role';

type UseChangeRoleOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ChangeRoleMethodParams = {
  address: string;
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useChangeRoleMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodReward = useCallback(
    async ({ address, nodeOperatorId }: ChangeRoleMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, address] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.proposeNodeOperatorRewardAddressChange(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.proposeNodeOperatorRewardAddressChange(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );
  const methodManager = useCallback(
    async ({ address, nodeOperatorId }: ChangeRoleMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, address] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.proposeNodeOperatorManagerAddressChange(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.proposeNodeOperatorManagerAddressChange(...params, {
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

export const useChangeRoleSubmit = ({
  onConfirm,
  onRetry,
}: UseChangeRoleOptions) => {
  const { txModalStages } = useTxModalStagesChangeRole();

  const getMethod = useChangeRoleMethods();
  const confirmRepropose = useConfirmReproposeModal();
  const confirmRewardsRole = useConfirmRewardsRoleModal();

  const changeRole = useCallback(
    async (
      { address: addressRaw, isRevoke }: ChangeRoleFormInputType,
      { nodeOperatorId, proposedAddress, role }: ChangeRoleFormDataContextValue,
    ): Promise<boolean> => {
      const address = isRevoke ? AddressZero : addressRaw;
      invariant(role, 'Role is not defined');
      invariant(address, 'Addess is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      if (role === 'REWARDS' && !(await confirmRewardsRole())) {
        return false;
      }

      if (proposedAddress && !(await confirmRepropose())) {
        return false;
      }

      try {
        const method = getMethod(role);

        txModalStages.sign(address, role);

        const callback = await method({
          nodeOperatorId,
          address,
        });

        const tx = await runWithTransactionLogger(
          'ChangeRole signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(address, role, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('ChangeRole block confirmation', () =>
            tx.wait(),
          );
        }

        await onConfirm?.();

        txModalStages.success(address, role, txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      confirmRewardsRole,
      confirmRepropose,
      getMethod,
      txModalStages,
      onConfirm,
      onRetry,
    ],
  );

  return {
    changeRole,
  };
};
