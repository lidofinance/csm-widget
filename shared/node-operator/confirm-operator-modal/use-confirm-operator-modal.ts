import { useCallback } from 'react';
import { isAddressEqual } from 'viem';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { useConfirmModal } from 'shared/hooks';
import { ConfirmOperatorModal } from './confirm-operator-modal';

export const useConfirmOperatorModal = () => {
  const confirm = useConfirmModal(ConfirmOperatorModal);
  const { data: operators } = useAvailableOperators();
  const { nodeOperator } = useNodeOperator();

  return useCallback(async () => {
    if (
      !nodeOperator ||
      (operators?.length ?? 0) <= 1 ||
      isAddressEqual(nodeOperator.managerAddress, nodeOperator.rewardsAddress)
    ) {
      return true;
    }
    return confirm({ nodeOperator });
  }, [confirm, operators, nodeOperator]);
};
