import { ModalComponentType, useModal } from 'providers/modal-provider';
import { useCallback } from 'react';

export type ConfirmModalProps = {
  onConfirm: () => void;
  onReject: () => void;
};

export const useConfirmModal = <T>(
  modal: ModalComponentType<ConfirmModalProps & T>,
) => {
  const m = useModal(modal);

  return useCallback(
    async (props: T) => {
      return new Promise((resolve) => {
        m.openModal({
          ...props,
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
    },
    [m],
  );
};

export const getUseConfirmModal = <T>(
  modal: ModalComponentType<ConfirmModalProps & T>,
) => {
  return () => useConfirmModal(modal);
};
