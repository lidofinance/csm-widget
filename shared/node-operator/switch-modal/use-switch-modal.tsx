import { PATH } from 'consts';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { getUseModal } from 'providers/modal-provider';
import { useCallback } from 'react';
import { useShowFlags } from 'shared/hooks';
import { useSwitchOperator } from '../use-switch-operator';
import { SwitchModal } from './switch-modal';

export const useSwitchModal = getUseModal(SwitchModal);

export const useOpenOperatorSwitchModal = (path?: PATH) => {
  const { nodeOperator } = useNodeOperator();
  const handleSwitchOperator = useSwitchOperator(path);

  const { openModal } = useSwitchModal();
  const { data: list } = useAvailableOperators();
  const { CAN_CREATE } = useShowFlags();

  return useCallback(() => {
    if (!nodeOperator || !list) return;
    openModal({
      active: nodeOperator,
      list,
      onChange: handleSwitchOperator,
      canCreate: CAN_CREATE,
    });
  }, [nodeOperator, list, openModal, handleSwitchOperator, CAN_CREATE]);
};
