import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmDisableTopUpModalApp } from '../confirm-disable-top-up-modal-app';

export const useConfirmDisableTopUpModal = getUseConfirmModal(
  ConfirmDisableTopUpModalApp,
);
