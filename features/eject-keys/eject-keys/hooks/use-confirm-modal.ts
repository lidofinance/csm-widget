import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmEjectKeysModal } from '../confirm-eject-keys-modal';

export const useConfirmEjectKeysModal = getUseConfirmModal(
  ConfirmEjectKeysModal,
);
