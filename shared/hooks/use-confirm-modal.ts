import { ModalComponentType, useModal } from 'providers/modal-provider';
import { useCallback } from 'react';

export type ConfirmModalProps = {
  onConfirm: () => void;
  onReject: () => void;
};

export const useConfirmModal = (
  modal: ModalComponentType<ConfirmModalProps>,
) => {
  const m = useModal(modal);

  return useCallback(async () => {
    return new Promise((resolve) => {
      m.openModal({
        onConfirm: () => {
          resolve(true);
          m.closeModal();
        },
        onReject: () => {
          resolve(false);
          m.closeModal();
        },
      });
    });
  }, [m]);
};

export const getUseConfirmModal = (
  modal: ModalComponentType<ConfirmModalProps>,
) => {
  return () => useConfirmModal(modal);
};
