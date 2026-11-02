import { ModalComponentType, useModal } from 'providers/modal-provider';
import { useCallback } from 'react';
import { FormUi, useFormUi } from 'shared/hook-form/form-ui';

export type ConfirmModalProps = {
  onConfirm: () => void;
  onReject: () => void;
  ui?: FormUi;
};

export const useConfirmModal = <T>(
  modal: ModalComponentType<ConfirmModalProps & T>,
) => {
  const m = useModal(modal);
  const ui = useFormUi();

  return useCallback(
    async (props: T) => {
      return new Promise<boolean>((resolve) => {
        m.openModal({
          ...props,
          // legacy confirm modals spread their props onto lido-ui Modal; keep `ui` off them
          ...(ui === 'app' ? { ui } : {}),
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
    [m, ui],
  );
};

export const getUseConfirmModal = <T>(
  modal: ModalComponentType<ConfirmModalProps & T>,
) => {
  return () => useConfirmModal(modal);
};
