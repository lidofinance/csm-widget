import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { getUseModal } from 'providers/modal-provider';
import { FC, useEffect } from 'react';
import { SelectModal } from './select-modal';

export const useSelectModal = getUseModal(SelectModal);

export const SelectOperatorWatcher: FC = () => {
  const { needsSelection, switchNodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const { openModal, closeModal } = useSelectModal();

  useEffect(() => {
    if (needsSelection && list) {
      openModal({ list, onChange: switchNodeOperator });
    } else {
      closeModal();
    }
  }, [needsSelection, list, openModal, closeModal, switchNodeOperator]);

  return null;
};
