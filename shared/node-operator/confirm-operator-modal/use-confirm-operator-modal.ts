import { useCallback } from 'react';
import { useNodeOperator } from 'modules/web3';
import { useConfirmModal } from 'shared/hooks';
import { ConfirmOperatorModalApp } from './confirm-operator-modal-app';

export const useConfirmOperatorModal = () => {
  const confirm = useConfirmModal(ConfirmOperatorModalApp);
  const { nodeOperator } = useNodeOperator();

  return useCallback(async () => {
    if (!nodeOperator) return true;
    return confirm({ nodeOperator });
  }, [confirm, nodeOperator]);
};
