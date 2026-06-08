import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmClaimTypeModal } from '../confirm-claim-type-modal';

export const useConfirmClaimTypeModal = getUseConfirmModal(
  ConfirmClaimTypeModal,
);
