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
import { ChangeRoleFormNetworkData, ChangeRoleFormInputType } from '.';
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

  const methodRewards = useCallback(
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
  const methodRewardsChange = useCallback(
    async ({ nodeOperatorId, address }: ChangeRoleMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, address] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.changeNodeOperatorRewardAddress(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.changeNodeOperatorRewardAddress(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );
  const methodManagerReset = useCallback(
    async ({ nodeOperatorId }: ChangeRoleMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.resetNodeOperatorManagerAddress(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.resetNodeOperatorManagerAddress(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(
    ({
      isRewardsChange,
      isManagerReset,
      role,
    }: {
      isRewardsChange: boolean;
      isManagerReset: boolean;
      role: ROLES;
    }) => {
      switch (true) {
        case isRewardsChange:
          return methodRewardsChange;
        case isManagerReset:
          return methodManagerReset;
        case role === ROLES.REWARDS:
          return methodRewards;
        case role === ROLES.MANAGER:
          return methodManager;
        default: {
          throw new Error('Not implemented yet: true case');
        }
      }
    },
    [methodManager, methodManagerReset, methodRewards, methodRewardsChange],
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
      {
        nodeOperatorId,
        proposedAddress,
        role,
        isPropose,
        isManagerReset,
        isRewardsChange,
      }: ChangeRoleFormNetworkData,
    ): Promise<boolean> => {
      const address = isRevoke ? AddressZero : addressRaw;
      invariant(role, 'Role is not defined');
      invariant(address, 'Addess is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      if (
        !isRevoke &&
        isPropose &&
        role === ROLES.REWARDS &&
        !(await confirmRewardsRole())
      ) {
        return false;
      }

      if (
        !isRevoke &&
        isPropose &&
        proposedAddress &&
        !(await confirmRepropose())
      ) {
        return false;
      }

      try {
        const method = getMethod({ role, isManagerReset, isRewardsChange });

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
