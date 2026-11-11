import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmCustomAddressesModalApp } from '../confirm-custom-addresses-modal-app';
import { ConfirmRemoveReferrerModalApp } from '../confirm-remove-referrer-modal-app';

export const useConfirmCustomAddressesModal = getUseConfirmModal(
  ConfirmCustomAddressesModalApp,
);

export const useConfirmRemoveReferrerModal = getUseConfirmModal(
  ConfirmRemoveReferrerModalApp,
);
