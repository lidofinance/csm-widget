import { useNodeOperator } from 'modules/web3';
import { getUseModal } from 'providers/modal-provider';
import { FC, useEffect } from 'react';
import { ChooseOperatorModal } from './choose-operator-modal';

const useChooseOperatorModal = getUseModal(ChooseOperatorModal);

export const SelectOperatorWatcher: FC = () => {
  const { needsSelection, isDiscovering } = useNodeOperator();
  const { openModal, closeModal } = useChooseOperatorModal();

  useEffect(() => {
    if (isDiscovering || needsSelection) {
      openModal({});
    } else {
      closeModal();
    }
  }, [isDiscovering, needsSelection, openModal, closeModal]);

  return null;
};
