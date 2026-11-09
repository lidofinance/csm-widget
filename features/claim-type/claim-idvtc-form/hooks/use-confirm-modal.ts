import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmClaimIdvtcModalApp } from '../confirm-claim-idvtc-modal-app';

export const useConfirmClaimIdvtcModal = getUseConfirmModal(
  ConfirmClaimIdvtcModalApp,
);
