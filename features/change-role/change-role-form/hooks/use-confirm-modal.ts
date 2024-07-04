import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmReproposeModal } from '../confirm-reproposed-modal';
import { ConfirmRewardsRoleModal } from '../confirm-rewards-role-modal';

export const useConfirmReproposeModal = getUseConfirmModal(
  ConfirmReproposeModal,
);

export const useConfirmRewardsRoleModal = getUseConfirmModal(
  ConfirmRewardsRoleModal,
);
