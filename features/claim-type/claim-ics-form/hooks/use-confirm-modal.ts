import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmClaimIcsModalApp } from '../confirm-claim-ics-modal-app';

export const useConfirmClaimIcsModal = getUseConfirmModal(
  ConfirmClaimIcsModalApp,
);
