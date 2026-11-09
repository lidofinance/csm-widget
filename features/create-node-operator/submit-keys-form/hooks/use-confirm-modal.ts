import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmCustomAddressesModalApp } from '../confirm-custom-addresses-modal-app';

export const useConfirmCustomAddressesModal = getUseConfirmModal(
  ConfirmCustomAddressesModalApp,
);
