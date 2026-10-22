import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmDisableTopUpModal } from '../confirm-disable-top-up-modal';

export const useConfirmDisableTopUpModal = getUseConfirmModal(
  ConfirmDisableTopUpModal,
);
