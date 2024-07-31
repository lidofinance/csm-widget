import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmCustomAddressesModal } from '../confirm-custom-addresses-modal';

export const useConfirmCustomAddressesModal = getUseConfirmModal(
  ConfirmCustomAddressesModal,
);
