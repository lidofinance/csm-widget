import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmHighCostModalApp } from '../confirm-high-cost-modal-app';

export const useConfirmHighCostModal = getUseConfirmModal(
  ConfirmHighCostModalApp,
);
