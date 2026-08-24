import { useCallback } from 'react';
import { useNodeOperator } from 'modules/web3';
import { useConfirmModal } from 'shared/hooks';
import { ConfirmOperatorModal } from './confirm-operator-modal';

export const useConfirmOperatorModal = () => {
  const confirm = useConfirmModal(ConfirmOperatorModal);
  const { nodeOperator } = useNodeOperator();

  return useCallback(async () => {
    if (!nodeOperator) return true;
    return confirm({ nodeOperator });
  }, [confirm, nodeOperator]);
};
