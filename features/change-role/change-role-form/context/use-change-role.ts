import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { isAddress } from 'ethers/lib/utils.js';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCSModuleWeb3 } from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { Address } from 'wagmi';
import { ChangeRoleFormInputType } from '.';
import { useTxModalStagesChangeRole } from '../hooks/use-tx-modal-stages-change-role';
import { ROLES } from 'consts/roles';

type UseChangeRoleOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ChangeRoleMethodParams = {
  address: Address;
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
        case ROLES.REWARD:
          return methodReward;
      }
    },
    [methodManager, methodReward],
  );
};

export const useChangeRole = ({ onConfirm, onRetry }: UseChangeRoleOptions) => {
  const nodeOperatorId = useNodeOperatorId(); // TODO: move to context
  const { txModalStages } = useTxModalStagesChangeRole();

  const getMethod = useChangeRoleMethods();

  const changeRole = useCallback(
    async ({ role, address }: ChangeRoleFormInputType): Promise<boolean> => {
      invariant(role, 'Role is not defined');
      invariant(address, 'Addess is not defined');
      invariant(isAddress(address), 'Addess should starts with "0x"');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

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
    [nodeOperatorId, getMethod, txModalStages, onConfirm, onRetry],
  );

  return {
    changeRole,
  };
};
