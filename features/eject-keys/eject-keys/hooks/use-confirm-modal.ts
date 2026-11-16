import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmEjectKeysModalApp } from '../confirm-eject-keys-modal-app';

export const useConfirmEjectKeysModal = getUseConfirmModal(
  ConfirmEjectKeysModalApp,
);
