import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { getUseModal } from 'providers/modal-provider';
import { FC, useEffect } from 'react';
import { ChooseOperatorModal } from './choose-operator-modal';

const useChooseOperatorModal = getUseModal(ChooseOperatorModal);

export const SelectOperatorWatcher: FC = () => {
  const { needsSelection } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const { openModal, closeModal } = useChooseOperatorModal();
  const hasList = !!list;

  useEffect(() => {
    if (needsSelection && hasList) {
      openModal({});
    } else {
      closeModal();
    }
  }, [needsSelection, hasList, openModal, closeModal]);

  return null;
};
